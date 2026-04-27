#!/usr/bin/env node
/**
 * Typography Audit — 단계 5-2 #5 산출물.
 *
 * 목적: /analysis 라우트 컴포넌트의 text-* 클래스 사용 분포를 카운트하여
 *      type scale 일관성을 회귀 점검한다.
 *
 * 스캔 대상:
 *  - src/components/analysis/**\/*.tsx
 *  - src/app/analysis/**\/*.tsx
 *  - src/components/layout/**\/*.tsx (TopNav·Footer·MobileSticky)
 *
 * 보고:
 *  1) text-* 클래스 분포 (정렬: 빈도 내림차순)
 *  2) 의미 단위별 매핑 권고 (globals.css §5 type scale 주석 기반)
 *  3) 임의값 [Npx] / [N.Nrem] 사용 빈도 (감 의존 패턴 식별)
 *
 * 사용:
 *   node scripts/diagnostics/typography-audit.mjs
 *   node scripts/diagnostics/typography-audit.mjs --verbose   # 파일별 상세
 *
 * 회귀 점검: type scale 토큰 외 임의값 사용 증가 시 경고.
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), "..", "..");
const SCAN_DIRS = [
  "src/components/analysis",
  "src/app/analysis",
  "src/components/layout",
];

const args = process.argv.slice(2);
const verbose = args.includes("--verbose") || args.includes("-v");

/* ─── 의미 단위별 권장 매핑 (globals.css §5 type scale 주석과 일치) ─── */
const SEMANTIC_MAPPING = {
  display: "Hero h1 (페이지 최상단)",
  h1: "페이지 H1",
  h2: "섹션 H2 (## 01·02·03 ...)",
  h3: "서브 헤딩 (### ...)",
  h4: "카드 제목",
  body: "본문",
  "body-sm": "보조 본문",
  caption: "캡션·메타·태그",
  numeric: "숫자 강조 일반",
  "numeric-dominant": "Hero stat dominant (최저가)",
  "numeric-supporting": "Hero stat supporting",
};

const STANDARD_TEXT_SIZES = new Set([
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-display",
  "text-h1",
  "text-h2",
  "text-h3",
  "text-h4",
  "text-body",
  "text-body-sm",
  "text-caption",
  "text-numeric",
  "text-numeric-dominant",
  "text-numeric-supporting",
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) files.push(p);
  }
  return files;
}

function scan() {
  const distribution = new Map();
  const arbitraryValues = new Map();
  const perFile = {};

  for (const dir of SCAN_DIRS) {
    const absDir = path.join(REPO_ROOT, dir);
    const files = walk(absDir);
    for (const f of files) {
      const rel = path.relative(REPO_ROOT, f);
      const content = fs.readFileSync(f, "utf8");
      const fileEntry = (perFile[rel] = { standard: {}, arbitrary: [] });

      // 표준 text-* 클래스 (Tailwind + 우리 토큰)
      const stdMatches = content.matchAll(
        /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|display|h1|h2|h3|h4|body|body-sm|caption|numeric|numeric-dominant|numeric-supporting)\b/g
      );
      for (const m of stdMatches) {
        const cls = `text-${m[1]}`;
        distribution.set(cls, (distribution.get(cls) ?? 0) + 1);
        fileEntry.standard[cls] = (fileEntry.standard[cls] ?? 0) + 1;
      }

      // 임의값 text-[Npx] / text-[N.Nrem] / text-[N.Nem] (감 의존 패턴)
      const arbMatches = content.matchAll(
        /\btext-\[([0-9.]+(?:px|rem|em))\]/g
      );
      for (const m of arbMatches) {
        const cls = `text-[${m[1]}]`;
        arbitraryValues.set(cls, (arbitraryValues.get(cls) ?? 0) + 1);
        fileEntry.arbitrary.push(cls);
      }
    }
  }

  return { distribution, arbitraryValues, perFile };
}

function report() {
  const { distribution, arbitraryValues, perFile } = scan();

  console.log("\n=== Typography Audit (단계 5-2 #5) ===\n");
  console.log("스캔 대상:");
  for (const d of SCAN_DIRS) console.log(`  - ${d}`);

  console.log("\n[1] text-* 표준 클래스 분포 (빈도 내림차순):");
  const sortedStd = [...distribution.entries()].sort((a, b) => b[1] - a[1]);
  for (const [cls, count] of sortedStd) {
    const known = STANDARD_TEXT_SIZES.has(cls) ? "" : "  ⚠ 토큰 외";
    console.log(`  ${count.toString().padStart(4)}  ${cls}${known}`);
  }

  console.log("\n[2] 임의값 (text-[Npx] / text-[N.Nrem]) — 감 의존 패턴:");
  if (arbitraryValues.size === 0) {
    console.log("  · 0건 (양호)");
  } else {
    const sortedArb = [...arbitraryValues.entries()].sort((a, b) => b[1] - a[1]);
    for (const [cls, count] of sortedArb) {
      console.log(`  ${count.toString().padStart(4)}  ${cls}  ⚠ 표준 토큰 사용 권고`);
    }
  }

  console.log("\n[3] 의미 단위별 권장 매핑 (globals.css §5):");
  for (const [k, desc] of Object.entries(SEMANTIC_MAPPING)) {
    console.log(`  text-${k}  →  ${desc}`);
  }

  if (verbose) {
    console.log("\n[4] 파일별 상세 (--verbose):");
    for (const [rel, entry] of Object.entries(perFile)) {
      const stdCount = Object.values(entry.standard).reduce((a, b) => a + b, 0);
      const arbCount = entry.arbitrary.length;
      if (stdCount === 0 && arbCount === 0) continue;
      console.log(`\n  ${rel}`);
      const sortedFile = Object.entries(entry.standard).sort((a, b) => b[1] - a[1]);
      for (const [cls, count] of sortedFile) {
        console.log(`    ${count.toString().padStart(3)}  ${cls}`);
      }
      if (arbCount > 0) {
        const arbSummary = entry.arbitrary.reduce((acc, cls) => {
          acc[cls] = (acc[cls] ?? 0) + 1;
          return acc;
        }, {});
        for (const [cls, count] of Object.entries(arbSummary)) {
          console.log(`    ${count.toString().padStart(3)}  ${cls}  ⚠`);
        }
      }
    }
  }

  console.log("\n[요약]");
  const stdTotal = [...distribution.values()].reduce((a, b) => a + b, 0);
  const arbTotal = [...arbitraryValues.values()].reduce((a, b) => a + b, 0);
  console.log(`  · 표준 text-* 클래스: ${stdTotal}건`);
  console.log(`  · 임의값 text-[...]: ${arbTotal}건`);
  if (arbTotal === 0) {
    console.log("  · 결과: PASS (임의값 0)");
  } else {
    console.log(
      `  · 결과: 검토 권고 (임의값 ${arbTotal}건 — 표준 토큰으로 정합 가능 여부 확인)`
    );
  }
  console.log();
}

report();
