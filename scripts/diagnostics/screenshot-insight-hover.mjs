#!/usr/bin/env node
/**
 * /insight Hub 카드 hover paradigm 3 옵션 시각 비교 screenshot 산출.
 *
 * 산출 image 3건 (rest 카드 + Editor's Pick + hover 시점):
 *   - /tmp/insight-option-a.png (현 paradigm = whileHover y:-4 단독)
 *   - /tmp/insight-option-b.png (사전 메모리 paradigm = grayscale + scale-105)
 *   - /tmp/insight-option-c.png (옵션 a + b 통합)
 *
 * 사용: node scripts/diagnostics/screenshot-insight-hover.mjs
 */

import { chromium } from "playwright";

const URL = "http://localhost:3000/insight";

async function captureWithStyleInjection(label, cssOverride, motionPatch) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  // CSS override 단계 (옵션 b/c 광역 grayscale + scale paradigm 적용)
  await page.addInitScript(({ css, motion }) => {
    const style = document.createElement("style");
    style.id = "hover-test-override";
    style.textContent = css;
    document.documentElement.appendChild(style);
    if (motion) {
      // motion whileHover y:-4 광역 disable 단단 (옵션 b 광역)
      // → CSS 광역 transform translate-y 광역 0 paradigm
    }
  }, { css: cssOverride ?? "", motion: motionPatch });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // hover 진입 = 첫 rest 카드 광역 (Editor's Pick 사후 첫 카드)
  const targetCard = page.locator("section.bg-white >> a").first();
  await targetCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // 두 번째 rest 카드 광역 hover (시각 차이 광역 직접 노출)
  const restCards = page.locator("section.bg-white .grid >> a");
  const cardCount = await restCards.count();
  console.log(`  rest 카드 ${cardCount} 건 식별`);

  if (cardCount > 0) {
    const targetHover = restCards.first();
    await targetHover.scrollIntoViewIfNeeded();
    await targetHover.hover();
    await page.waitForTimeout(800); // hover transition 안정화
  }

  // Editor's Pick + rest grid 광역 screenshot (hub 안 카드 영역 광역)
  const hubBody = page.locator("section.bg-white").first();
  await hubBody.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.screenshot({
    path: `/tmp/insight-option-${label}.png`,
    fullPage: false,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // hub 광역 전체 capture 별개 산출
  await page.screenshot({
    path: `/tmp/insight-option-${label}-full.png`,
    fullPage: true,
  });

  console.log(`  ✓ /tmp/insight-option-${label}.png + -full.png 산출`);
  await browser.close();
}

async function main() {
  console.log("=== Option A (현 paradigm = whileHover y:-4) ===");
  // 사전 paradigm 직접 = override 영역 0
  await captureWithStyleInjection("a", "", false);

  console.log("\n=== Option B (사전 메모리 = grayscale + scale-105) ===");
  // 옵션 b = motion y 영역 0 + grayscale + scale paradigm
  const cssB = `
    /* rest 카드 광역 image grayscale paradigm */
    section.bg-white a .bg-cover {
      filter: grayscale(100%);
      transition: filter 0.3s ease-out, transform 0.3s ease-out;
    }
    section.bg-white a:hover .bg-cover {
      filter: grayscale(0%);
      transform: scale(1.05);
    }
    /* whileHover y 광역 폐기 paradigm = motion.div transform 영역 0 */
    section.bg-white a {
      transform: translateY(0) !important;
    }
  `;
  await captureWithStyleInjection("b", cssB, true);

  console.log("\n=== Option C (a + b 통합) ===");
  const cssC = `
    section.bg-white a .bg-cover {
      filter: grayscale(100%);
      transition: filter 0.3s ease-out, transform 0.3s ease-out;
    }
    section.bg-white a:hover .bg-cover {
      filter: grayscale(0%);
      transform: scale(1.05);
    }
    /* whileHover y:-4 영구 보존 (Option A 정합) */
  `;
  await captureWithStyleInjection("c", cssC, false);

  console.log("\n=== 산출 정합 ===");
  console.log("  /tmp/insight-option-a.png (현 = whileHover y:-4 단독)");
  console.log("  /tmp/insight-option-b.png (grayscale + scale-105 단독)");
  console.log("  /tmp/insight-option-c.png (whileHover y:-4 + grayscale + scale-105 통합)");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
