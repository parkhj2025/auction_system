#!/usr/bin/env node
/**
 * Lighthouse audit for the landing page (/).
 * ---------------------------------------------------------------------------
 * Phase 6.8: 랜딩 Hero가 CTA 그 자체이므로 / 단일 경로만 측정.
 * Desktop + Mobile 2회 실행, 4개 카테고리(Performance/Accessibility/
 * Best Practices/SEO) 점수 + Core Web Vitals 지표를 JSON + HTML로 저장.
 *
 * 사용법:
 *   pnpm lighthouse                           # production URL 기본값
 *   pnpm lighthouse https://preview-url.app   # 임의 URL 오버라이드
 *
 * 출력:
 *   .lighthouse/report-desktop.html
 *   .lighthouse/report-desktop.json
 *   .lighthouse/report-mobile.html
 *   .lighthouse/report-mobile.json
 *   .lighthouse/summary.json  (4 categories + CWV 요약)
 */

import { mkdir, writeFile } from "node:fs/promises";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const DEFAULT_URL = "https://auctionsystem-green.vercel.app/";
const OUTPUT_DIR = ".lighthouse";

const url = process.argv[2] || DEFAULT_URL;

const FORM_FACTORS = [
  { label: "desktop", formFactor: "desktop", screenEmulation: { disabled: true } },
  {
    label: "mobile",
    formFactor: "mobile",
    // lighthouse 기본 mobile emulation 유지 (Moto G Power 프로파일)
    screenEmulation: undefined,
  },
];

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const CORE_METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "interactive",
];

function pct(score) {
  return score === null || score === undefined ? null : Math.round(score * 100);
}

function extractSummary(label, lhr) {
  const categories = {};
  for (const key of CATEGORIES) {
    const cat = lhr.categories[key];
    categories[key] = cat ? pct(cat.score) : null;
  }
  const metrics = {};
  for (const id of CORE_METRICS) {
    const audit = lhr.audits[id];
    if (!audit) continue;
    metrics[id] = {
      numeric: audit.numericValue ?? null,
      display: audit.displayValue ?? null,
    };
  }
  return { label, url: lhr.finalUrl ?? lhr.requestedUrl, categories, metrics };
}

async function runOne({ label, formFactor, screenEmulation }) {
  const chrome = await launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });
  try {
    const options = {
      logLevel: "error",
      output: ["html", "json"],
      onlyCategories: CATEGORIES,
      port: chrome.port,
      formFactor,
      ...(screenEmulation ? { screenEmulation } : {}),
    };
    const result = await lighthouse(url, options);
    if (!result) throw new Error(`lighthouse returned empty for ${label}`);
    const { lhr, report } = result;
    const [htmlReport, jsonReport] =
      Array.isArray(report) ? report : [report, JSON.stringify(lhr)];
    await writeFile(`${OUTPUT_DIR}/report-${label}.html`, htmlReport);
    await writeFile(`${OUTPUT_DIR}/report-${label}.json`, jsonReport);
    return extractSummary(label, lhr);
  } finally {
    await chrome.kill();
  }
}

function formatRow(summary) {
  const c = summary.categories;
  return `${summary.label.padEnd(8)} | perf=${c.performance ?? "?"} a11y=${c.accessibility ?? "?"} bp=${c["best-practices"] ?? "?"} seo=${c.seo ?? "?"}`;
}

(async () => {
  console.log(`[lighthouse] target: ${url}`);
  await mkdir(OUTPUT_DIR, { recursive: true });

  const summaries = [];
  for (const ff of FORM_FACTORS) {
    console.log(`[lighthouse] running ${ff.label}...`);
    const summary = await runOne(ff);
    summaries.push(summary);
    console.log(`[lighthouse] ${formatRow(summary)}`);
  }

  const summaryPath = `${OUTPUT_DIR}/summary.json`;
  await writeFile(
    summaryPath,
    JSON.stringify(
      {
        target: url,
        ranAt: new Date().toISOString(),
        results: summaries,
      },
      null,
      2,
    ),
  );

  console.log(`\n[lighthouse] summary written: ${summaryPath}`);
  for (const s of summaries) console.log(`  ${formatRow(s)}`);
})().catch((err) => {
  console.error("[lighthouse] failed:", err);
  process.exit(1);
});
