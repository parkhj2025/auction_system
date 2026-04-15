/**
 * 대법원 경매정보 크롤러 — 메인 오케스트레이터.
 *
 * 사용법:
 *   node --env-file=.env.local scripts/crawler/index.mjs \
 *     --court incheon \
 *     --days 14 \
 *     [--dry-run]
 *
 * 기본 동작:
 *   - 지정 법원의 지정 기간(오늘 ~ N일 후) 경매 물건 전체 수집
 *   - court_listings 테이블에 docid 기준 upsert
 *   - 요청 간 1.5초 간격 (WAF 부담 최소화)
 *   - 각 페이지 완료마다 진행 로그
 *   - dry-run 모드: Supabase 쓰지 않고 출력만
 *
 * 종료 코드:
 *   0 — 성공
 *   1 — 실패 (WAF 차단, 네트워크 에러, 응답 파싱 실패 등)
 */

import { createSession } from "./session.mjs";
import { callSearch } from "./api.mjs";
import { mapRecordToRow } from "./mapper.mjs";
import { upsertListings, markStaleInactive, countListings } from "./upsert.mjs";
import { COURT_CODES, ACTIVE_CRAWL_COURTS } from "./codes.mjs";

// ----- CLI 파싱 -----

function parseArgs(argv) {
  const args = { court: "incheon", days: 14, dryRun: false, verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--court") args.court = argv[++i];
    else if (a === "--days") args.days = parseInt(argv[++i], 10);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--verbose" || a === "-v") args.verbose = true;
    else if (a === "--help" || a === "-h") {
      console.log(`
사용법:
  node --env-file=.env.local scripts/crawler/index.mjs [options]

옵션:
  --court <key>    법원 키 (default: incheon)
                   사용 가능: ${Object.keys(COURT_CODES).join(", ")}
  --days <n>       오늘부터 N일 후까지 수집 (default: 14)
  --dry-run        Supabase 쓰지 않고 출력만
  --verbose, -v    레코드 샘플 출력
  --help, -h       이 도움말
      `);
      process.exit(0);
    }
  }
  return args;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ----- 메인 -----

async function main() {
  const args = parseArgs(process.argv);

  const courtInfo = COURT_CODES[args.court];
  if (!courtInfo) {
    console.error(`❌ Unknown court key: ${args.court}`);
    console.error(`   available: ${Object.keys(COURT_CODES).join(", ")}`);
    process.exit(1);
  }

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + args.days);

  const bidStart = formatDate(today);
  const bidEnd = formatDate(endDate);

  console.log("═".repeat(60));
  console.log("  대법원 경매정보 크롤러");
  console.log("═".repeat(60));
  console.log(`  법원: ${courtInfo.name} (${courtInfo.code})`);
  console.log(`  기간: ${bidStart} ~ ${bidEnd} (${args.days}일)`);
  console.log(`  모드: ${args.dryRun ? "DRY-RUN (DB 쓰지 않음)" : "실제 upsert"}`);
  console.log("═".repeat(60));
  console.log();

  const batchStartedAt = new Date().toISOString();

  // 1. 세션 초기화
  console.log("[1/3] 세션 초기화...");
  const session = createSession();
  try {
    const initResult = await session.init();
    console.log(`  ✅ 쿠키 획득: ${Object.keys(initResult.cookies).join(", ")}`);
  } catch (err) {
    console.error(`  ❌ 세션 초기화 실패: ${err.message}`);
    process.exit(1);
  }

  // 2. 페이지네이션 루프
  console.log();
  console.log("[2/3] 물건 목록 수집...");

  const PAGE_SIZE = 10;
  const RATE_LIMIT_MS = 1500;
  const allRows = [];
  const seenDocids = new Set();
  let pageNo = 1;
  let totalCnt = null;

  while (true) {
    // 세션 TTL 체크 (15분 넘었으면 재초기화)
    await session.ensureFresh();

    let response;
    try {
      response = await callSearch(session, {
        courtCode: courtInfo.code,
        bidStart,
        bidEnd,
        pageNo,
        pageSize: PAGE_SIZE,
      });
    } catch (err) {
      console.error(`  ❌ 페이지 ${pageNo} 호출 실패: ${err.message}`);
      // 1회 재시도
      console.log(`  재시도 10초 후...`);
      await sleep(10000);
      try {
        response = await callSearch(session, {
          courtCode: courtInfo.code,
          bidStart,
          bidEnd,
          pageNo,
          pageSize: PAGE_SIZE,
        });
      } catch (err2) {
        console.error(`  ❌ 재시도 실패: ${err2.message}`);
        console.error(`  크롤러 중단. 지금까지 수집된 ${allRows.length}건은 유지.`);
        break;
      }
    }

    const results = response.data?.dlt_srchResult ?? [];
    const pageInfo = response.data?.dma_pageInfo ?? {};

    if (totalCnt === null) {
      totalCnt = parseInt(pageInfo.totalCnt ?? "0", 10);
      const groupCnt = pageInfo.groupTotalCount ?? "?";
      console.log(
        `  ℹ️  totalCnt: ${totalCnt} / groupTotalCount: ${groupCnt} / ipcheck: ${response.data?.ipcheck}`
      );
    }

    if (results.length === 0) {
      console.log(`  페이지 ${pageNo}: 결과 없음 — 종료`);
      break;
    }

    for (const raw of results) {
      if (seenDocids.has(raw.docid)) continue; // 중복 방지
      seenDocids.add(raw.docid);
      allRows.push(mapRecordToRow(raw, { courtNameFallback: courtInfo.name }));
    }

    console.log(
      `  페이지 ${pageNo}: +${results.length}건 (누적 ${allRows.length}/${totalCnt})`
    );

    if (args.verbose && pageNo === 1) {
      console.log("  샘플 첫 건:");
      const s = allRows[0];
      console.log(`    docid: ${s.docid}`);
      console.log(`    사건: ${s.case_number}`);
      console.log(`    주소: ${s.address_display}`);
      console.log(`    감정가: ${s.appraisal_amount?.toLocaleString()}원`);
      console.log(`    최저가: ${s.min_bid_amount?.toLocaleString()}원`);
      console.log(`    매각일: ${s.bid_date} ${s.bid_time}`);
      console.log(`    용도: ${s.usage_name}`);
      console.log();
    }

    // 더 이상 페이지 없음
    if (allRows.length >= totalCnt || results.length < PAGE_SIZE) {
      break;
    }

    pageNo++;
    await sleep(RATE_LIMIT_MS);
  }

  console.log();
  console.log(`  총 수집: ${allRows.length}건`);

  // 3. Supabase upsert (dry-run 아니면)
  console.log();
  console.log("[3/3] Supabase upsert...");

  if (args.dryRun) {
    console.log("  ⏭️  DRY-RUN — 건너뜀");
  } else if (allRows.length === 0) {
    console.log("  수집된 데이터 없음 — 건너뜀");
  } else {
    try {
      // 배치로 upsert (대량 시 Supabase가 한 번에 받을 수 있는 양)
      const BATCH_SIZE = 100;
      let totalUpserted = 0;
      for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
        const chunk = allRows.slice(i, i + BATCH_SIZE);
        const { upserted } = await upsertListings(chunk);
        totalUpserted += upserted;
        console.log(
          `  배치 ${Math.floor(i / BATCH_SIZE) + 1}: ${upserted}건 upsert`
        );
      }
      console.log(`  ✅ 총 upsert: ${totalUpserted}건`);

      // 비활성화 처리
      const { deactivated } = await markStaleInactive({
        courtCode: courtInfo.code,
        cutoffIso: batchStartedAt,
      });
      if (deactivated > 0) {
        console.log(`  🗑️  비활성화: ${deactivated}건 (이번 배치에 없던 기존 row)`);
      }

      // 헬스체크
      const liveCount = await countListings(courtInfo.code);
      console.log(`  📊 현재 활성 + 비활성 총 row: ${liveCount}건`);
    } catch (err) {
      console.error(`  ❌ Supabase 에러: ${err.message}`);
      process.exit(1);
    }
  }

  console.log();
  console.log("═".repeat(60));
  console.log(`  ✅ 크롤러 완료 — ${allRows.length}건 처리`);
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
