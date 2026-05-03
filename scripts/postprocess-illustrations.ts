/* Phase 1.2 (A-1-2) v5 V0+++ — sharp flatten 단일 paradigm.
 * 본질 = alpha 채널 평탄화만 (raw pixel manipulation 광역 폐기).
 * 출력 = PNG 보존 (WebP 변환 폐기 / Next.js Image 위임).
 * Light gray 본질 영역 광역 보존 (ambient bars / body lines / 옥상 텍스트 / 그림자).
 *
 * 실행: pnpm postprocess:illustrations
 */

import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const ILLUSTRATIONS_DIR = path.join(process.cwd(), "public", "illustrations");

const FILES = [
  "hero-shield-courthouse",
  "insight-market-chart",
  "insight-guide-book",
  "insight-news",
  "insight-cases-building",
] as const;

type Result = {
  filename: string;
  beforeKB: number;
  afterKB: number;
  hadAlpha: boolean;
};

async function processOne(filename: string): Promise<Result | null> {
  const inputPath = path.join(ILLUSTRATIONS_DIR, `${filename}.png`);
  if (!fs.existsSync(inputPath)) {
    console.error(`✗ ${filename}.png 부재 (skip)`);
    return null;
  }
  const beforeBuf = fs.readFileSync(inputPath);
  const beforeKB = beforeBuf.length / 1024;

  /* metadata 본질 alpha 채널 존재 본질 확인. */
  const meta = await sharp(beforeBuf).metadata();
  const hadAlpha = meta.hasAlpha === true;

  /* sharp flatten({background: '#FFFFFF'}) 단일. */
  const outBuf = await sharp(beforeBuf)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  /* PNG 형식 보존 본질 — 입력 .png 본질 본질 덮어쓰기. */
  fs.writeFileSync(inputPath, outBuf);
  const afterKB = outBuf.length / 1024;

  return { filename, beforeKB, afterKB, hadAlpha };
}

async function main() {
  console.log(`sharp flatten 단일 본질 시작 (5건)\n`);
  const results: Result[] = [];
  for (const filename of FILES) {
    process.stdout.write(`[${filename}] `);
    const r = await processOne(filename);
    if (!r) {
      console.log("FAIL");
      continue;
    }
    results.push(r);
    console.log(
      `${r.beforeKB.toFixed(1)} → ${r.afterKB.toFixed(1)} KB (alpha ${r.hadAlpha ? "ON → flatten" : "OFF / no-op"})`
    );
  }

  console.log("\n=== Summary ===");
  console.log(
    "filename                       | before  | after   | alpha"
  );
  console.log(
    "-------------------------------|---------|---------|--------"
  );
  for (const r of results) {
    console.log(
      `${r.filename.padEnd(31)}| ${r.beforeKB.toFixed(1).padStart(6)}KB | ${r.afterKB.toFixed(1).padStart(6)}KB | ${r.hadAlpha ? "ON → flatten" : "OFF / no-op"}`
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
