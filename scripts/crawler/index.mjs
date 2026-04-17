/**
 * 대법원 경매정보 증분 크롤러.
 *
 * 사용법:
 *   node --env-file=.env.local scripts/crawler/index.mjs \
 *     --court incheon --days 14
 *
 * 또는 바탕화면 바로가기:
 *   scripts/run-crawler.bat (Windows)
 *   scripts/run-crawler.sh  (Mac/Linux)
 *
 * 4단계 증분 수집:
 *   0. 네트워크 사전 체크 (검색 API 단일 호출)
 *   1. 목록 수집 (검색 API 페이지네이션)
 *   2. DB 대조 (신규/기존/비활성 분류)
 *   3. Supabase 저장 (upsert + 비활성화)
 *   4. 종합 리포트
 *
 * 종료 코드:
 *   0 — 성공
 *   1 — 실패
 */

import { createSession } from "./session.mjs";
import { callSearch } from "./api.mjs";
import { mapRecordToRow } from "./mapper.mjs";
import {
  upsertListings,
  markStaleInactive,
  countListings,
} from "./upsert.mjs";
import { COURT_CODES } from "./codes.mjs";

// ─── ANSI 색상 ───────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

function ok(msg) {
  process.stdout.write(`${C.green}  OK${C.reset} ${msg}\n`);
}
function fail(msg) {
  process.stdout.write(`${C.red}  FAIL${C.reset} ${msg}\n`);
}
function warn(msg) {
  process.stdout.write(`${C.yellow}  --${C.reset} ${msg}\n`);
}
function info(msg) {
  process.stdout.write(`${C.cyan}  >>>${C.reset} ${msg}\n`);
}
function header(msg) {
  process.stdout.write(`\n${C.bold}${msg}${C.reset}\n`);
}

// ─── CLI 파싱 ────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { court: "incheon", days: 14, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--court") args.court = argv[++i];
    else if (a === "--days") args.days = parseInt(argv[++i], 10);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log(`
사용법:
  node --env-file=.env.local scripts/crawler/index.mjs [options]

옵션:
  --court <key>    법원 키 (default: incheon)
  --days <n>       오늘부터 N일 후까지 수집 (default: 14)
  --dry-run        Supabase 쓰지 않고 출력만
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

function formatDateTime(date) {
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDuration(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (min === 0) return `${sec}초`;
  return `${min}분 ${remSec}초`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** "아무 키나 누르면 종료" 대기 */
function waitForKey() {
  return new Promise((resolve) => {
    process.stdout.write(
      `\n${C.dim}  아무 키나 누르면 종료...${C.reset}\n`
    );
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once("data", () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    } else {
      // 파이프 등 non-TTY 환경
      resolve();
    }
  });
}

// ─── 상수 ────────────────────────────────────────────────────

const PAGE_SIZE = 50;
const RATE_LIMIT_MS = 3000;
const BATCH_SIZE = 100;

// ─── 메인 ────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date();
  const args = parseArgs(process.argv);

  const courtInfo = COURT_CODES[args.court];
  if (!courtInfo) {
    fail(`알 수 없는 법원 키: "${args.court}"`);
    fail(`사용 가능: ${Object.keys(COURT_CODES).join(", ")}`);
    await waitForKey();
    process.exit(1);
  }

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + args.days);
  const bidStart = formatDate(today);
  const bidEnd = formatDate(endDate);

  process.stdout.write("\n");
  process.stdout.write(
    `${C.bold}${"═".repeat(50)}${C.reset}\n`
  );
  process.stdout.write(
    `${C.bold}  경매퀵 크롤러 — 증분 수집${C.reset}\n`
  );
  process.stdout.write(
    `${C.bold}${"═".repeat(50)}${C.reset}\n`
  );
  info(`법원: ${courtInfo.name} (${courtInfo.code})`);
  info(`기간: ${bidStart} ~ ${bidEnd} (${args.days}일)`);
  info(`모드: ${args.dryRun ? "DRY-RUN" : "실제 저장"}`);
  info(`시작: ${formatDateTime(startedAt)}`);

  // ─── 0단계: 네트워크 사전 체크 ─────────────────────────────

  header("[0/4] 네트워크 사전 체크");

  const session = createSession();
  try {
    await session.init();
    ok("세션 쿠키 획득");
  } catch (err) {
    fail("대법원 사이트에 연결할 수 없습니다.");
    fail("인터넷 연결을 확인해주세요.");
    fail(`상세: ${err.message}`);
    await waitForKey();
    process.exit(1);
  }

  // 세션 초기화 후 추가 대기 (브라우저 동작 모방)
  await sleep(2000);

  // 단일 검색 API 호출로 차단 여부 확인 (pageSize=10, 자연스러운 요청)
  try {
    const probe = await callSearch(session, {
      courtCode: courtInfo.code,
      bidStart,
      bidEnd,
      pageNo: 1,
      pageSize: 10,
    });
    const ipcheck = probe.data?.ipcheck;
    ok(`검색 API 정상 응답 (ipcheck: ${ipcheck})`);
  } catch (err) {
    const msg = err.message || "";
    if (msg.includes("400") || msg.includes("불편을 드려")) {
      fail("이 네트워크에서는 검색 API가 차단되어 있습니다.");
      fail("다른 네트워크(모바일 핫스팟, 집 Wi-Fi 등)를 시도해주세요.");
      fail("24시간 후 자동 해제될 수 있습니다.");
    } else {
      fail(`검색 API 오류: ${msg}`);
    }
    await waitForKey();
    process.exit(1);
  }

  await sleep(RATE_LIMIT_MS);

  // ─── 1단계: 목록 수집 ──────────────────────────────────────

  header("[1/4] 목록 수집");

  const allRows = [];
  const seenDocids = new Set();
  let pageNo = 1;
  let totalCnt = null;
  let totalPages = "?";

  while (true) {
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
      warn(`페이지 ${pageNo} 실패: ${err.message}`);
      // 1회 재시도
      warn("10초 후 재시도...");
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
        fail(`재시도 실패: ${err2.message}`);
        fail(`지금까지 수집된 ${allRows.length}건으로 계속 진행합니다.`);
        break;
      }
    }

    const results = response.data?.dlt_srchResult ?? [];
    const pageInfo = response.data?.dma_pageInfo ?? {};

    if (totalCnt === null) {
      totalCnt = parseInt(pageInfo.totalCnt ?? "0", 10);
      totalPages = Math.ceil(totalCnt / PAGE_SIZE);
    }

    if (results.length === 0) break;

    for (const raw of results) {
      if (seenDocids.has(raw.docid)) continue;
      seenDocids.add(raw.docid);
      allRows.push(
        mapRecordToRow(raw, { courtNameFallback: courtInfo.name })
      );
    }

    process.stdout.write(
      `\r  페이지 ${pageNo}/${totalPages} — 누적 ${allRows.length}/${totalCnt}건`
    );

    if (allRows.length >= totalCnt || results.length < PAGE_SIZE) break;

    pageNo++;
    await sleep(RATE_LIMIT_MS);
  }

  process.stdout.write("\n");
  ok(`목록 수집 완료: ${allRows.length}건 (${pageNo}페이지)`);

  if (allRows.length === 0) {
    warn("수집된 데이터가 없습니다. 기간이나 법원을 확인해주세요.");
    await waitForKey();
    process.exit(0);
  }

  // ─── 2단계: DB 대조 (증분 필터링) ─────────────────────────

  header("[2/4] DB 대조");

  let existingDocids = new Set();
  let newRows = [];
  let existingCount = 0;
  let staleCount = 0;

  if (args.dryRun) {
    warn("DRY-RUN — DB 대조 건너뜀");
    newRows = allRows;
  } else {
    try {
      // 해당 court_code의 기존 active docid 전부 조회
      // Supabase 기본 limit=1000이므로 range 페이지네이션 필수
      const client = (await import("./upsert.mjs")).getClient();
      const allDbDocids = [];
      const DB_BATCH = 1000;
      let offset = 0;

      while (true) {
        const { data: batch, error: batchErr } = await client
          .from("court_listings")
          .select("docid")
          .eq("court_code", courtInfo.code)
          .eq("is_active", true)
          .range(offset, offset + DB_BATCH - 1);

        if (batchErr) throw new Error(batchErr.message);
        allDbDocids.push(...(batch ?? []));
        if (!batch || batch.length < DB_BATCH) break;
        offset += DB_BATCH;
      }

      existingDocids = new Set(allDbDocids.map((r) => r.docid));
      info(`DB 기존 active: ${existingDocids.size}건`);

      // 분류
      const collectedDocids = new Set(allRows.map((r) => r.docid));
      newRows = allRows.filter((r) => !existingDocids.has(r.docid));
      existingCount = allRows.length - newRows.length;

      // 비활성 대상 (DB에 있으나 이번 수집에 없는 것)
      staleCount = [...existingDocids].filter(
        (d) => !collectedDocids.has(d)
      ).length;

      ok(`신규: ${C.bold}${newRows.length}건${C.reset}`);
      ok(`기존 갱신: ${existingCount}건`);
      if (staleCount > 0) {
        warn(`비활성 대상: ${staleCount}건`);
      }
    } catch (err) {
      fail(`DB 조회 실패: ${err.message}`);
      fail("Supabase 연결을 확인해주세요.");
      fail(".env.local 파일의 URL과 키를 확인하세요.");
      await waitForKey();
      process.exit(1);
    }
  }

  // ─── 3단계: Supabase 저장 ─────────────────────────────────

  header("[3/4] Supabase 저장");

  if (args.dryRun) {
    warn("DRY-RUN — 저장 건너뜀");
  } else {
    try {
      // 전체 upsert (기존 건은 last_seen_at 갱신, 신규 건은 INSERT)
      const totalBatches = Math.ceil(allRows.length / BATCH_SIZE);
      let totalUpserted = 0;

      for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
        const chunk = allRows.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        process.stdout.write(
          `\r  배치 ${batchNum}/${totalBatches} 저장 중...`
        );
        const { upserted } = await upsertListings(chunk);
        totalUpserted += upserted;
      }
      process.stdout.write("\n");
      ok(`upsert 완료: ${totalUpserted}건`);

      // 비활성화
      const batchStartedAt = startedAt.toISOString();
      const { deactivated } = await markStaleInactive({
        courtCode: courtInfo.code,
        cutoffIso: batchStartedAt,
      });
      if (deactivated > 0) {
        warn(`비활성화: ${deactivated}건`);
      } else {
        ok("비활성화 대상 없음");
      }
    } catch (err) {
      fail(`저장 실패: ${err.message}`);
      fail("Supabase 연결을 확인해주세요.");
      await waitForKey();
      process.exit(1);
    }
  }

  // ─── 4단계: 종합 리포트 ────────────────────────────────────

  const endedAt = new Date();
  const durationMs = endedAt - startedAt;

  let activeCount = "?";
  if (!args.dryRun) {
    try {
      activeCount = await countListings(courtInfo.code);
    } catch {
      /* ignore */
    }
  }

  process.stdout.write("\n");
  process.stdout.write(
    `${C.bold}${"═".repeat(50)}${C.reset}\n`
  );
  process.stdout.write(
    `${C.bold}${C.green}  크롤러 완료${C.reset}\n`
  );
  process.stdout.write(
    `${C.bold}${"═".repeat(50)}${C.reset}\n`
  );
  process.stdout.write(
    `  시작: ${formatDateTime(startedAt)}\n`
  );
  process.stdout.write(
    `  종료: ${formatDateTime(endedAt)}\n`
  );
  process.stdout.write(
    `  소요: ${formatDuration(durationMs)}\n`
  );
  process.stdout.write(
    `  ${"─".repeat(46)}\n`
  );
  process.stdout.write(
    `  목록 수집: ${allRows.length.toLocaleString()}건 (${pageNo}페이지)\n`
  );
  process.stdout.write(
    `  ${C.green}신규 추가: ${newRows.length}건${C.reset}\n`
  );
  process.stdout.write(
    `  기존 갱신: ${existingCount.toLocaleString()}건\n`
  );
  process.stdout.write(
    `  비활성화: ${staleCount}건\n`
  );
  process.stdout.write(
    `  현재 활성: ${typeof activeCount === "number" ? activeCount.toLocaleString() : activeCount}건\n`
  );
  process.stdout.write(
    `${C.bold}${"═".repeat(50)}${C.reset}\n`
  );

  await waitForKey();
}

main().catch(async (err) => {
  fail(`예기치 않은 오류: ${err.message}`);
  console.error(err);
  await waitForKey();
  process.exit(1);
});
