/**
 * 대법원 경매정보 사이트 endpoint trace 자동화.
 * 작업 지시(2026-04-25): Playwright headful로 6건 사건 분석, 사이트가 호출하는
 * endpoint 식별, 우리 코드와 diff 비교, 보고서 작성.
 *
 * 단계:
 *   1) prototype 모드 (--proto): 단일 사건만 실행, 사이트 UI 자동화 가능성 검증
 *   2) 일괄 모드 (--all): 6건 순차 실행, 각 사건당 5초 간격
 *
 * 사용:
 *   node --env-file=.env.local scripts/diag-courtauction-trace.mjs --proto
 *   node --env-file=.env.local scripts/diag-courtauction-trace.mjs --all
 *
 * 출력:
 *   tmp/trace-{slug}.zip       - Playwright trace
 *   tmp/trace-{slug}.har       - HTTP archive
 *   tmp/captured-{slug}.json   - 필터된 /pgj/ 요청·응답 본문
 *   tmp/main-{slug}.html       - 메인 페이지 DOM
 *   tmp/search-{slug}.html     - 검색 페이지 DOM
 *   tmp/step{N}-{slug}.png     - 단계별 스크린샷
 *   tmp/diag-report.md         - 최종 보고서 (--all 후)
 *
 * 작업 금지:
 *   - 즉시 코드 패치 금지
 *   - court_code 매핑 변경 금지
 *   - 사건당 ≥5초 간격 (rate limit 준수)
 *   - 쿠키 평문 콘솔 출력 금지 (HAR 파일은 tmp/, gitignore)
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

/** 검증 사건 6건 — 작업 지시문 매트릭스 그대로 */
const CASES = [
  {
    case: "2024타경527667",
    courtCode: "B000240",
    courtName: "인천지방법원",
    dDay: "D-48",
    bucket: "본원/D-30+/성공",
  },
  {
    case: "2022타경2716",
    courtCode: "B000241",
    courtName: "부천지원",
    dDay: "D-6",
    bucket: "지원/D-14/성공",
  },
  {
    case: "2024타경49993",
    courtCode: "B000241",
    courtName: "부천지원",
    dDay: "D-40",
    bucket: "지원/D-30+/실패",
  },
  {
    case: "2023타경118641",
    courtCode: "B000212",
    courtName: "서울남부지방법원",
    dDay: "D-45",
    bucket: "본원/D-30+/?",
  },
  {
    case: "2023타경120583",
    courtCode: "B000212",
    courtName: "서울남부지방법원",
    dDay: "D-3",
    bucket: "본원/D-14/?",
  },
  {
    case: "2024타경5000",
    courtCode: "B250826",
    courtName: "안산지원",
    dDay: "D-30+",
    bucket: "지원/D-30+/?",
    note: "Code 자율선택 — 안산지원 사건 (가설 검증용)",
  },
];

function slugOf(c) {
  const num = c.case.replace(/[^0-9]/g, "");
  return `${c.courtCode}-${num}`;
}

async function runOne(meta, opts = {}) {
  const slug = slugOf(meta);
  const tmpDir = path.resolve("tmp");
  await fs.mkdir(tmpDir, { recursive: true });
  const fullMode = !!opts.full;

  console.log(`\n━━━ ${meta.case} (${meta.courtName}, ${meta.dDay}) ━━━`);

  const requests = [];
  const responses = [];

  const browser = await chromium.launch({
    headless: false,
    slowMo: 250,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    locale: "ko-KR",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    recordHar: { path: `${tmpDir}/trace-${slug}.har`, mode: "full" },
  });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();

  // ─ network capture: /pgj/ POST(JSON 본문) + image (사진 endpoint 식별용) ─
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("/pgj/") || url.includes("selectAuct") || /\.(jpg|jpeg|png|webp)/i.test(url)) {
      requests.push({
        stage: opts._stage ?? "?",
        method: req.method(),
        url,
        resourceType: req.resourceType(),
        headers: maskCookies(req.headers()),
        postData: req.postData() ?? null,
      });
    }
  });
  page.on("response", async (res) => {
    const url = res.url();
    const reqMethod = res.request().method();
    const ct = res.headers()["content-type"] ?? "";
    const isPgjPost = url.includes("/pgj/") && reqMethod === "POST";
    const isImage = /\bimage\//i.test(ct) || /\.(jpg|jpeg|png|webp)/i.test(url);
    if (isPgjPost) {
      let body;
      try {
        body = await res.text();
      } catch {
        body = "";
      }
      responses.push({
        kind: "json",
        url,
        status: res.status(),
        contentType: ct,
        bodyPreview: body.length > 2500 ? body.slice(0, 2500) + "...[truncated]" : body,
      });
    } else if (isImage) {
      responses.push({
        kind: "image",
        url,
        status: res.status(),
        contentType: ct,
        sizeHint: res.headers()["content-length"] ?? "?",
      });
    }
  });

  const photoEndpoints = new Set();
  page.on("response", (res) => {
    const url = res.url();
    const ct = res.headers()["content-type"] ?? "";
    if (/image\//i.test(ct) || /\.(jpg|jpeg|png|webp)/i.test(url)) {
      photoEndpoints.add(new URL(url).pathname);
    }
  });

  try {
    /* ─ 1) 메인 페이지 접속 ─ */
    console.log("[1] 메인 접속");
    opts._stage = "1-main";
    await page.goto("https://www.courtauction.go.kr/", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${tmpDir}/step1-main-${slug}.png` });
    if (opts.dumpHtml) {
      await fs.writeFile(`${tmpDir}/main-${slug}.html`, await page.content());
    }

    /* ─ 2) 검색 페이지 직접 진입 ─ */
    console.log("[2] 검색 페이지 진입");
    opts._stage = "2-search-page";
    await page.goto(
      "https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",
      { waitUntil: "domcontentloaded", timeout: 20000 }
    );
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${tmpDir}/step2-search-${slug}.png` });
    if (opts.dumpHtml) {
      await fs.writeFile(`${tmpDir}/search-${slug}.html`, await page.content());
    }

    /* ─ 3) form info dump ─ */
    console.log("[3] form info dump");
    opts._stage = "3-form-info";
    const formInfo = await page.evaluate(() => {
      const out = { inputs: [], selects: [], buttons: [], iframes: [] };
      for (const el of document.querySelectorAll("input")) {
        out.inputs.push({
          id: el.id, name: el.name, type: el.type, placeholder: el.placeholder,
          visible: el.offsetParent !== null,
        });
      }
      for (const el of document.querySelectorAll("select")) {
        out.selects.push({
          id: el.id, name: el.name,
          options: [...el.options].map((o) => ({ v: o.value, t: o.text })),
          visible: el.offsetParent !== null,
        });
      }
      for (const el of document.querySelectorAll("button, a[role='button'], a")) {
        const txt = (el.textContent ?? "").trim();
        if (txt && txt.length < 20) {
          out.buttons.push({ tag: el.tagName, id: el.id, text: txt });
        }
      }
      for (const el of document.querySelectorAll("iframe")) {
        out.iframes.push({ id: el.id, src: el.src });
      }
      return out;
    });
    await fs.writeFile(`${tmpDir}/forminfo-${slug}.json`, JSON.stringify(formInfo, null, 2));
    console.log(
      `   inputs=${formInfo.inputs.length} selects=${formInfo.selects.length} buttons=${formInfo.buttons.length} iframes=${formInfo.iframes.length}`
    );

    if (!fullMode) {
      // prototype mode: stop here
    } else {
      /* ─ 4) 검색 폼 입력 ─ */
      console.log("[4] 검색 폼 입력");
      opts._stage = "4-fill-form";
      // 법원 select: courtCode를 value로 시도 → label fallback
      try {
        await page.selectOption(
          "#mf_wfm_mainFrame_sbx_rletCortOfc",
          meta.courtCode
        );
        console.log(`   법원 = ${meta.courtCode} (value)`);
      } catch {
        try {
          await page.selectOption(
            "#mf_wfm_mainFrame_sbx_rletCortOfc",
            { label: meta.courtName }
          );
          console.log(`   법원 = ${meta.courtName} (label)`);
        } catch (e) {
          console.error(`   법원 선택 실패: ${e.message}`);
        }
      }
      await page.waitForTimeout(1500);

      // 사건 연도
      const year = meta.case.match(/^(\d{4})/)?.[1] ?? "2024";
      try {
        await page.selectOption("#mf_wfm_mainFrame_sbx_rletCsYear", year);
        console.log(`   연도 = ${year}`);
      } catch (e) {
        console.error(`   연도 선택 실패: ${e.message}`);
      }
      await page.waitForTimeout(800);

      // 사건번호 (숫자만)
      const csNumOnly = meta.case.match(/(\d+)[^\d]+(\d+)/)?.[2] ?? "";
      try {
        await page.fill("#mf_wfm_mainFrame_ibx_rletCsNo", csNumOnly);
        console.log(`   사건번호 = ${csNumOnly}`);
      } catch (e) {
        console.error(`   사건번호 입력 실패: ${e.message}`);
      }
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${tmpDir}/step4-filled-${slug}.png` });

      /* ─ 5) 검색 버튼 ─ */
      console.log("[5] 검색 버튼 클릭");
      opts._stage = "5-submit-search";
      const reqsBefore = requests.length;
      let clicked = false;
      const candidates = [
        () => page.getByRole("button", { name: "검색" }).first(),
        () => page.locator("a[role='button']", { hasText: "검색" }).first(),
        () => page.locator("button:has-text('검색')").first(),
        () => page.locator("a:has-text('검색')").first(),
        () => page.locator("text=검색").first(),
      ];
      for (const c of candidates) {
        try {
          const loc = c();
          if ((await loc.count()) > 0) {
            await loc.click({ timeout: 2500 });
            console.log(`   검색 클릭 OK (후보 ${candidates.indexOf(c) + 1})`);
            clicked = true;
            break;
          }
        } catch {}
      }
      if (!clicked) {
        console.error("   검색 버튼을 찾지 못함");
      }
      await page.waitForTimeout(4000);
      await page.screenshot({ path: `${tmpDir}/step5-results-${slug}.png` });
      const newReqs = requests.length - reqsBefore;
      console.log(`   검색 후 신규 요청: ${newReqs}`);

      /* ─ 6) 결과 row 클릭 ─ */
      console.log("[6] 결과 클릭");
      opts._stage = "6-detail";
      const detailReqsBefore = requests.length;
      const resultMatchers = [
        () => page.locator(`text=${meta.case}`).first(),
        () => page.locator(`text=${csNumOnly}`).first(),
        () => page.locator("table tbody tr").first(),
        () => page.locator("[role='row']").nth(1),
      ];
      let detailOpened = false;
      for (const m of resultMatchers) {
        try {
          const loc = m();
          if ((await loc.count()) > 0) {
            await loc.click({ timeout: 2500 });
            detailOpened = true;
            console.log(`   결과 클릭 OK (후보 ${resultMatchers.indexOf(m) + 1})`);
            break;
          }
        } catch {}
      }
      if (!detailOpened) {
        console.error("   결과 row를 찾지 못함");
        await fs.writeFile(`${tmpDir}/results-dom-${slug}.html`, await page.content());
      }
      await page.waitForTimeout(4500);
      await page.screenshot({ path: `${tmpDir}/step6-detail-${slug}.png` });
      console.log(`   상세 진입 후 신규 요청: ${requests.length - detailReqsBefore}`);

      /* ─ 7) 사진 탭 ─ */
      console.log("[7] 사진 탭 진입");
      opts._stage = "7-photos-tab";
      const photoReqsBefore = requests.length;
      const photoMatchers = [
        () => page.getByRole("tab", { name: /사진/ }).first(),
        () => page.locator("a:has-text('사진')").first(),
        () => page.locator("button:has-text('사진')").first(),
        () => page.locator("text=사진").first(),
        () => page.locator("text=물건사진").first(),
        () => page.locator("text=매각물건").first(),
      ];
      let photoOpened = false;
      for (const m of photoMatchers) {
        try {
          const loc = m();
          if ((await loc.count()) > 0) {
            await loc.click({ timeout: 2500 });
            photoOpened = true;
            console.log(`   사진 탭 클릭 OK (후보 ${photoMatchers.indexOf(m) + 1})`);
            break;
          }
        } catch {}
      }
      if (!photoOpened) console.error("   사진 탭을 찾지 못함");
      await page.waitForTimeout(4500);
      await page.screenshot({ path: `${tmpDir}/step7-photos-${slug}.png` });
      console.log(`   사진 탭 후 신규 요청: ${requests.length - photoReqsBefore}`);

      // 상세 페이지 DOM dump
      try {
        await fs.writeFile(`${tmpDir}/detail-${slug}.html`, await page.content());
      } catch {}
    }
  } catch (e) {
    console.error("자동화 실패:", e.message);
    try {
      await page.screenshot({ path: `${tmpDir}/error-${slug}.png` });
    } catch {}
  }

  await context.tracing.stop({ path: `${tmpDir}/trace-${slug}.zip` });
  await context.close();
  await browser.close();

  await fs.writeFile(
    `${tmpDir}/captured-${slug}.json`,
    JSON.stringify({ meta, requests, responses, photoEndpoints: [...photoEndpoints] }, null, 2)
  );

  console.log(`\n   요약: req=${requests.length} res=${responses.length}  image_paths=${photoEndpoints.size}`);
  const uniq = new Set();
  for (const r of responses) {
    if (r.kind === "json") uniq.add(new URL(r.url).pathname);
  }
  console.log("   unique JSON endpoints:");
  for (const p of [...uniq].sort()) console.log(`     ${p}`);
  if (photoEndpoints.size > 0) {
    console.log("   image paths (sample):");
    for (const p of [...photoEndpoints].slice(0, 8)) console.log(`     ${p}`);
  }
  return { meta, slug, requests, responses, photoEndpoints: [...photoEndpoints] };
}

function maskCookies(headers) {
  const out = { ...headers };
  if (out.cookie) out.cookie = "[REDACTED]";
  return out;
}

const argv = process.argv.slice(2);
function getArg(flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
}
const mode = argv.includes("--all")
  ? "all"
  : argv.includes("--full")
    ? "full"
    : argv.includes("--proto")
      ? "proto"
      : "proto";
const caseIndex = parseInt(getArg("--case-index") ?? "0", 10);

if (mode === "proto") {
  console.log("MODE: prototype (form info dump until step 3)");
  await runOne(CASES[caseIndex], { dumpHtml: true, full: false });
} else if (mode === "full") {
  console.log(`MODE: full (single case, index=${caseIndex})`);
  await runOne(CASES[caseIndex], { dumpHtml: true, full: true });
} else {
  console.log("MODE: all (6건 순차)");
  const results = [];
  for (const c of CASES) {
    const r = await runOne(c, { dumpHtml: false, full: true });
    results.push(r);
    await new Promise((r) => setTimeout(r, 5000));
  }
  await fs.writeFile("tmp/all-results.json", JSON.stringify(results, null, 2));
}
