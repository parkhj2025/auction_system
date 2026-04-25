#!/usr/bin/env node
/**
 * seed-photos.mjs — 자택 IP에서 대법원 상세 API를 호출해
 *                   court_listings.photos 캐시를 선제적으로 채우는 CLI.
 *
 * Vercel 서버리스 IP가 대법원 WAF에서 빈 csPicLst를 받는 문제를 우회하기 위해
 * 신규 사건 투입 시 맥(자택 IP)에서 1회 실행.
 *
 * 사용법:
 *   node --env-file=.env.local scripts/seed-photos.mjs <docid>
 *   node --env-file=.env.local scripts/seed-photos.mjs --case 2024타경505827 --court B000240 --item 1
 *
 * 옵션:
 *   --docid <str>      기존 court_listings 행의 docid. 값으로 조회하여 case/court/item 획득.
 *   --case  <str>      사건번호 (예: 2024타경505827). --docid 없을 때 필요.
 *   --court <str>      법원 코드 (예: B000240). --docid 없을 때 필요.
 *   --item  <int>      item_sequence (기본 1).
 *   --all              기본 4장 대신 최대 20장까지 업로드 (블로그 콘텐츠용).
 *   --max   <int>      --all과 함께 쓰는 상한 (기본 20).
 *   --force            이미 캐시된 사건도 재시드.
 *   --dry-run          대법원 API 호출까지만 수행, Storage/DB 변경 안 함.
 *   --verbose, -v      상세 로그 출력.
 *
 * 환경 변수 (.env.local 또는 export):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 종료 코드:
 *   0  성공 (혹은 이미 캐시됨, 또는 csPicLst 0장 → photos_unavailable 마킹 후 정상 종료)
 *   1  인자 오류 / DB 연결 실패
 *   2  대법원 세션 초기화 실패
 *   3  상세 API 호출 자체 실패 (HTTP 에러 등)
 *   4  Storage 업로드 실패
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";
const BASE = "https://www.courtauction.go.kr";
const DEFAULT_MAX = 4;
const ALL_MAX = 20;
const PIC_CATEGORY = {
  "000241": "전경사진",
  "000242": "감정평가사진",
  "000243": "현황조사사진",
  "000244": "매각물건사진",
  "000245": "내부사진",
  "000246": "등기부사진",
  "000247": "기타사진",
};

function parseArgs(argv) {
  const args = {
    docid: null,
    case: null,
    court: null,
    item: 1,
    all: false,
    max: null,
    force: false,
    dryRun: false,
    verbose: false,
    positional: [],
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--docid":
        args.docid = argv[++i];
        break;
      case "--case":
        args.case = argv[++i];
        break;
      case "--court":
        args.court = argv[++i];
        break;
      case "--item":
        args.item = parseInt(argv[++i], 10);
        break;
      case "--all":
        args.all = true;
        break;
      case "--max":
        args.max = parseInt(argv[++i], 10);
        break;
      case "--force":
        args.force = true;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--verbose":
      case "-v":
        args.verbose = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        if (a.startsWith("--")) {
          console.error(`알 수 없는 옵션: ${a}`);
          process.exit(1);
        }
        args.positional.push(a);
    }
  }
  if (!args.docid && args.positional.length > 0) {
    args.docid = args.positional[0];
  }
  return args;
}

function printHelp() {
  console.log(`seed-photos.mjs — 대법원 사진 캐시 선제 주입 CLI

사용법:
  node --env-file=.env.local scripts/seed-photos.mjs <docid>
  node --env-file=.env.local scripts/seed-photos.mjs --case 2024타경505827 --court B000240 --item 1 --all

docid 없이 호출하면 인자로 받은 (case, court, item)으로 행을 찾거나,
court_listings에 없으면 새로 INSERT 후 진행.
docid는 ASCII-only여야 함 (Supabase Storage key 제약).
권장 컨벤션: "{courtCode}-{사건번호_숫자부분}-{itemSeq}"  예: B000240-505827-1
`);
}

function makeDocid(courtCode, caseNumber, itemSeq) {
  // 연도(\d+) + 구분자(타경 등 non-digit) + 사건번호 순번(\d+) 을 분리해 순번만 사용.
  // 과거 버그: slice(-6)으로 잘라 5자리 사건(예: 2024타경49993)이
  // "449993"으로 잘못 추출되던 문제를 정규식 분리로 해결.
  const match = caseNumber.match(/(\d+)[^\d]+(\d+)/);
  if (!match) throw new Error(`invalid caseNumber: ${caseNumber}`);
  return `${courtCode}-${match[2]}-${itemSeq}`;
}

function cookieHeader(jar) {
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}
function mergeCookies(jar, res) {
  for (const c of res.headers.getSetCookie()) {
    const [pair] = c.split(";");
    const [k, v] = pair.split("=");
    if (k && v) jar.set(k.trim(), v.trim());
  }
}

async function initSession(verbose) {
  const jar = new Map();
  const common = {
    "User-Agent": UA,
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua":
      '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
  };
  const r0 = await fetch(`${BASE}/`, {
    headers: {
      ...common,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
  });
  if (!r0.ok) throw new Error(`init step 1 failed: HTTP ${r0.status}`);
  mergeCookies(jar, r0);
  if (verbose) console.log(`  [init] step 1 OK, cookies=${jar.size}`);
  await new Promise((r) => setTimeout(r, 2000));
  const r1 = await fetch(
    `${BASE}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
    {
      headers: {
        ...common,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: `${BASE}/`,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        Cookie: cookieHeader(jar),
      },
    }
  );
  if (!r1.ok) throw new Error(`init step 2 failed: HTTP ${r1.status}`);
  mergeCookies(jar, r1);
  if (verbose) console.log(`  [init] step 2 OK, cookies=${jar.size}`);
  return jar;
}

async function fetchPicList(jar, { caseNumber, courtCode, itemSequence }) {
  const res = await fetch(`${BASE}/pgj/pgj15B/selectAuctnCsSrchRslt.on`, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      Origin: BASE,
      Referer: `${BASE}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
      "SC-Userid": "NONUSER",
      "SC-Pgmid": "PGJ15BM01",
      submissionid: "mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo",
      "sec-ch-ua":
        '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      Cookie: cookieHeader(jar),
    },
    body: JSON.stringify({
      dma_srchGdsDtlSrch: {
        csNo: caseNumber,
        cortOfcCd: courtCode,
        dspslGdsSeq: String(itemSequence),
        pgmId: "PGJ15BM01",
        srchInfo: {},
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`detail API HTTP ${res.status}`);
  }
  const json = await res.json();
  return json?.data?.dma_result?.csPicLst ?? [];
}

function selectPhotos(pics, max, all) {
  const withBody = pics.filter((p) => p.picFile);
  if (all) return withBody.slice(0, max);
  const byCat = new Map();
  for (const p of withBody) {
    const c = p.cortAuctnPicDvsCd;
    if (!byCat.has(c)) byCat.set(c, []);
    byCat.get(c).push(p);
  }
  const result = [];
  result.push(...(byCat.get("000241") ?? []).slice(0, 2));
  result.push(...(byCat.get("000245") ?? []).slice(0, 2));
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

async function main() {
  const args = parseArgs(process.argv);
  const verbose = args.verbose;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error(
      "env 누락: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local 로드 확인)"
    );
    process.exit(1);
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  // 식별자 결정
  let docid = args.docid;
  let caseNumber = args.case;
  let courtCode = args.court;
  let itemSeq = args.item || 1;

  if (docid) {
    const { data, error } = await admin
      .from("court_listings")
      .select(
        "docid, case_number, court_code, item_sequence, photos_fetched_at, photos_count"
      )
      .eq("docid", docid)
      .maybeSingle();
    if (error) {
      console.error("DB 조회 실패:", error.message);
      process.exit(1);
    }
    if (data) {
      caseNumber = data.case_number;
      courtCode = data.court_code;
      itemSeq = data.item_sequence;
      if (!args.force && data.photos_fetched_at && data.photos_count > 0) {
        console.log(
          `이미 캐시됨 (photos_count=${data.photos_count}). 강제 재시드는 --force.`
        );
        process.exit(0);
      }
    } else {
      console.error(
        `docid=${docid} 행이 court_listings에 없습니다. --case/--court/--item로 호출하세요.`
      );
      process.exit(1);
    }
  } else {
    if (!caseNumber || !courtCode) {
      console.error("--docid 또는 (--case + --court) 필수. --help 참조.");
      process.exit(1);
    }
    docid = makeDocid(courtCode, caseNumber, itemSeq);
    console.log(`생성된 docid: ${docid}`);
    const { error: upsertErr } = await admin.from("court_listings").upsert(
      {
        docid,
        court_code: courtCode,
        court_name: `${courtCode} (seed-photos)`,
        case_number: caseNumber,
        item_sequence: itemSeq,
        mokmul_sequence: 1,
        is_active: false,
        raw_snapshot: {
          __manual_insert: true,
          reason: "seed-photos CLI",
          inserted_at: new Date().toISOString(),
          inserted_by: "seed-photos.mjs",
        },
      },
      { onConflict: "docid", ignoreDuplicates: true }
    );
    if (upsertErr) {
      console.error("court_listings INSERT 실패:", upsertErr.message);
      process.exit(1);
    }
  }

  if (!/^[\x20-\x7e]+$/.test(docid)) {
    console.error(
      `docid에 ASCII-only만 허용됩니다 (Storage key 제약): ${docid}`
    );
    process.exit(1);
  }

  console.log(
    `[1] 대법원 세션 초기화  (case=${caseNumber}, court=${courtCode}, item=${itemSeq})`
  );
  let jar;
  try {
    jar = await initSession(verbose);
  } catch (e) {
    console.error("세션 초기화 실패:", e.message);
    process.exit(2);
  }

  console.log("[2] 상세 API 호출");
  let pics;
  try {
    pics = await fetchPicList(jar, {
      caseNumber,
      courtCode,
      itemSequence: itemSeq,
    });
  } catch (e) {
    console.error("상세 API 호출 실패:", e.message);
    process.exit(3);
  }
  pics = pics.filter((p) => p.picFile);
  console.log(`    csPicLst: ${pics.length}장 (picFile 보유)`);
  if (pics.length === 0) {
    // 사진 미수신 케이스: 사건이 사이트에 등록돼 있으나 사진이 첨부되지 않았거나,
    // 사건 자체가 해당 (court, csNo, item) 조합으로 조회되지 않는 상황.
    // 진단을 위해 raw_snapshot에 photos_unavailable=true 플래그를 마킹하고
    // photos_fetched_at을 세팅해 향후 호출 시 재시도가 무한 반복되지 않도록 한다.
    const { data: existing } = await admin
      .from("court_listings")
      .select("raw_snapshot")
      .eq("docid", docid)
      .maybeSingle();
    const mergedSnapshot = {
      ...(existing?.raw_snapshot ?? {}),
      photos_unavailable: true,
      photos_unavailable_marked_at: new Date().toISOString(),
      photos_unavailable_reason:
        "csPicLst empty in selectAuctnCsSrchRslt.on at fetch time. Other channels not investigated.",
    };
    const { error: markErr } = await admin
      .from("court_listings")
      .update({
        photos: [],
        photos_fetched_at: new Date().toISOString(),
        photos_count: 0,
        raw_snapshot: mergedSnapshot,
      })
      .eq("docid", docid);
    if (markErr) {
      console.error("photos_unavailable 마킹 실패:", markErr.message);
      process.exit(3);
    }
    console.log(
      `사진 미수신 (csPicLst 0장). photos_unavailable=true 마킹 후 정상 종료.`
    );
    console.log(`  docid: ${docid}`);
    process.exit(0);
  }

  const max = args.all ? (args.max ?? ALL_MAX) : DEFAULT_MAX;
  const selected = selectPhotos(pics, max, args.all);
  console.log(
    `[3] 선별: ${selected.length}장 (mode=${args.all ? "all" : "default"}, max=${max})`
  );

  if (args.dryRun) {
    console.log("\n[dry-run] Storage/DB 변경 없이 종료");
    for (const p of selected) {
      console.log(
        `  seq=${p.cortAuctnPicSeq} ${p.cortAuctnPicDvsCd} ${PIC_CATEGORY[p.cortAuctnPicDvsCd] ?? "?"}`
      );
    }
    process.exit(0);
  }

  const photos = [];
  const storagePath = `${courtCode}/${docid}`;
  for (let i = 0; i < selected.length; i++) {
    const p = selected[i];
    const buf = Buffer.from(p.picFile, "base64");
    const webp = await sharp(buf)
      .resize(800, 600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    const fileName = `${storagePath}/${i}.webp`;
    const { error: upErr } = await admin.storage
      .from("court-photos")
      .upload(fileName, webp, { contentType: "image/webp", upsert: true });
    if (upErr) {
      console.error(`    업로드 실패 ${fileName}:`, upErr.message);
      continue;
    }
    const { data: urlData } = admin.storage
      .from("court-photos")
      .getPublicUrl(fileName);
    const cat = p.cortAuctnPicDvsCd;
    photos.push({
      seq: i,
      url: urlData.publicUrl,
      caption: PIC_CATEGORY[cat] ?? `사진 ${i + 1}`,
      categoryCode: cat,
    });
    if (verbose)
      console.log(
        `    [${String(i).padStart(2)}] ${cat} ${PIC_CATEGORY[cat]}  ${webp.length}B`
      );
  }

  if (photos.length === 0) {
    console.error("모든 업로드가 실패했습니다.");
    process.exit(4);
  }

  const { error: updErr } = await admin
    .from("court_listings")
    .update({
      photos,
      photos_fetched_at: new Date().toISOString(),
      photos_count: photos.length,
    })
    .eq("docid", docid);
  if (updErr) {
    console.error("court_listings UPDATE 실패:", updErr.message);
    process.exit(4);
  }

  console.log(
    `[4] court_listings.photos UPDATE 완료. photos_count=${photos.length}`
  );
  console.log(
    `\n결과 호출: GET /api/court-listings/${docid}/photos${args.all ? "?all=true" : ""}`
  );
}

main().catch((e) => {
  console.error("치명적 오류:", e);
  process.exit(1);
});
