/**
 * 온디맨드 사진 페처.
 *
 * 단일 API selectAuctnCsSrchRslt.on으로 텍스트+사진 동시 수신 (D10).
 * csPicLst에서 base64 추출 → sharp 압축 → Storage 업로드 → JSONB 캐싱.
 */

import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSession } from "./session";
import { COURT_AUCTION } from "./codes";

/** Storage에 저장된 사진 1장의 메타데이터 */
export interface PhotoMeta {
  seq: number;
  url: string;
  caption: string;
  categoryCode: string;
}

/** 대법원 API 응답의 csPicLst 항목 */
interface RawPicItem {
  picFile: string; // base64 JPEG
  picTitlNm: string;
  cortAuctnPicDvsCd: string;
  cortAuctnPicSeq: number;
  pageSeq: number;
  cortOfcCd: string;
  csNo: string;
  picFileUrl: string;
}

/** 사진 구분 코드 → 한글 캡션 */
const PIC_CATEGORY: Record<string, string> = {
  "000241": "전경사진",
  "000242": "감정평가사진",
  "000243": "현황조사사진",
  "000244": "매각물건사진",
  "000245": "내부사진",
  "000246": "등기부사진",
  "000247": "기타사진",
};

const DEFAULT_MAX_PHOTOS = 4;
const ALL_MAX_PHOTOS = 20;

/**
 * 사진 선별.
 * - 기본(all=false): 전경 2 + 내부 2 + 부족 시 다른 카테고리 보충, 최대 `max`장.
 * - all=true: 응답 순서 그대로, `max` 상한까지.
 */
function selectPhotos(
  pics: RawPicItem[],
  max: number,
  all: boolean
): RawPicItem[] {
  const withBody = pics.filter((p) => p.picFile);

  if (all) {
    return withBody.slice(0, max);
  }

  const byCategory = new Map<string, RawPicItem[]>();
  for (const p of withBody) {
    const code = p.cortAuctnPicDvsCd;
    if (!byCategory.has(code)) byCategory.set(code, []);
    byCategory.get(code)!.push(p);
  }

  const result: RawPicItem[] = [];
  const exterior = byCategory.get("000241") ?? [];
  result.push(...exterior.slice(0, 2));
  const interior = byCategory.get("000245") ?? [];
  result.push(...interior.slice(0, 2));

  if (result.length < max) {
    const used = new Set(result);
    for (const p of withBody) {
      if (result.length >= max) break;
      if (used.has(p)) continue;
      result.push(p);
      used.add(p);
    }
  }

  return result.slice(0, max);
}

interface FetchPhotosParams {
  docid: string;
  caseNumber: string;
  courtCode: string;
  itemSequence: number;
}

interface FetchPhotosOpts {
  /** true면 MAX_PHOTOS=20까지 순서대로, false(기본)면 4장(전경 2+내부 2+보충). */
  all?: boolean;
}

/**
 * 사진을 조회하고 캐싱한다.
 * 캐시 hit 시 즉시 URL 반환, miss 시 대법원 API → sharp 압축 → Storage 업로드.
 *
 * `opts.all=true`일 때는 캐시가 기본 상한(4)을 넘지 못하면 재fetch를 시도한다.
 * 재fetch 결과가 기존 캐시보다 적거나(Vercel WAF로 빈 응답) 동일하면 기존 캐시를 유지한다(파괴 방지).
 */
export async function fetchAndCachePhotos(
  params: FetchPhotosParams,
  opts: FetchPhotosOpts = {}
): Promise<PhotoMeta[]> {
  const { docid, caseNumber, courtCode, itemSequence } = params;
  const { all = false } = opts;
  const admin = createAdminClient();

  const { data: listing } = await admin
    .from("court_listings")
    .select("photos, photos_fetched_at")
    .eq("docid", docid)
    .single();

  const cached: PhotoMeta[] =
    Array.isArray(listing?.photos) ? (listing!.photos as PhotoMeta[]) : [];

  if (listing?.photos_fetched_at && cached.length > 0) {
    if (!all || cached.length > DEFAULT_MAX_PHOTOS) {
      return cached;
    }
    // all 요청 + 캐시가 기본 상한 이하 → 전체 재fetch 시도 (아래 로직 계속)
  }

  // 2. 세션 획득
  const session = createSession();
  await session.init();

  // 3. 상세+사진 API 호출
  const res = await fetch(
    `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.DETAIL_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "User-Agent": COURT_AUCTION.USER_AGENT,
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        Origin: COURT_AUCTION.BASE_URL,
        Referer: `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
        "SC-Userid": COURT_AUCTION.SC_USERID,
        "SC-Pgmid": COURT_AUCTION.DETAIL_PGM_ID,
        submissionid: COURT_AUCTION.DETAIL_SUBMISSION_ID,
        "sec-ch-ua":
          '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Cookie: session.cookieHeader(),
      },
      body: JSON.stringify({
        dma_srchGdsDtlSrch: {
          csNo: caseNumber,
          cortOfcCd: courtCode,
          dspslGdsSeq: String(itemSequence),
          pgmId: COURT_AUCTION.DETAIL_PGM_ID,
          srchInfo: {},
        },
      }),
    }
  );

  session.mergeResponseCookies(res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Court detail API error: HTTP ${res.status} — ${text.slice(0, 200)}`
    );
  }

  const json = await res.json();
  const csPicLst: RawPicItem[] | undefined =
    json?.data?.dma_result?.csPicLst;

  if (!csPicLst || csPicLst.length === 0) {
    // 방어: 기존 캐시가 있으면 유지 (Vercel WAF로 csPicLst가 비어 올 수 있음)
    if (cached.length > 0) {
      return cached;
    }
    // 사진 없는 사건 — 빈 배열 캐싱 (재호출 방지)
    await admin
      .from("court_listings")
      .update({
        photos: [],
        photos_fetched_at: new Date().toISOString(),
        photos_count: 0,
      })
      .eq("docid", docid);
    return [];
  }

  // 4. 선별 → 압축 + 업로드
  const maxPhotos = all ? ALL_MAX_PHOTOS : DEFAULT_MAX_PHOTOS;
  const selected = selectPhotos(csPicLst, maxPhotos, all);

  const photos: PhotoMeta[] = [];
  const storagePath = `${courtCode}/${docid}`;

  for (let i = 0; i < selected.length; i++) {
    const pic = selected[i];
    if (!pic.picFile) continue;

    try {
      // base64 → Buffer → sharp 압축
      const inputBuffer = Buffer.from(pic.picFile, "base64");
      const webpBuffer = await sharp(inputBuffer)
        .resize(800, 600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      // Storage 업로드
      const fileName = `${storagePath}/${i}.webp`;
      const { error: uploadError } = await admin.storage
        .from("court-photos")
        .upload(fileName, webpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.error(`[photos] Upload failed for ${fileName}:`, uploadError.message);
        continue;
      }

      // Public URL
      const { data: urlData } = admin.storage
        .from("court-photos")
        .getPublicUrl(fileName);

      const category = pic.cortAuctnPicDvsCd;
      photos.push({
        seq: i,
        url: urlData.publicUrl,
        caption:
          PIC_CATEGORY[category] ??
          `사진 ${i + 1}`,
        categoryCode: category,
      });
    } catch (err) {
      console.error(`[photos] Process failed for pic ${i}:`, err);
    }
  }

  // 방어: 재fetch 결과가 기존 캐시보다 적으면 기존 캐시 유지 (부분 실패 보호)
  if (cached.length > photos.length) {
    return cached;
  }

  // 5. JSONB 캐싱
  await admin
    .from("court_listings")
    .update({
      photos,
      photos_fetched_at: new Date().toISOString(),
      photos_count: photos.length,
    })
    .eq("docid", docid);

  return photos;
}
