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

interface FetchPhotosParams {
  docid: string;
  caseNumber: string;
  courtCode: string;
  itemSequence: number;
}

/**
 * 사진을 조회하고 캐싱한다.
 * 캐시 hit 시 즉시 URL 반환, miss 시 대법원 API → sharp 압축 → Storage 업로드.
 */
export async function fetchAndCachePhotos(
  params: FetchPhotosParams
): Promise<PhotoMeta[]> {
  const { docid, caseNumber, courtCode, itemSequence } = params;
  const admin = createAdminClient();

  // 1. 캐시 체크
  const { data: listing } = await admin
    .from("court_listings")
    .select("photos, photos_fetched_at")
    .eq("docid", docid)
    .single();

  if (listing?.photos_fetched_at && Array.isArray(listing.photos) && listing.photos.length > 0) {
    return listing.photos as PhotoMeta[];
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

  // 4. 압축 + 업로드
  const photos: PhotoMeta[] = [];
  const storagePath = `${courtCode}/${docid}`;

  for (let i = 0; i < csPicLst.length; i++) {
    const pic = csPicLst[i];
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
