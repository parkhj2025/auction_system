#!/usr/bin/env node
/**
 * /insight Hub 카드 hover 사전 + 사후 상태 side-by-side screenshot.
 *
 * 산출 = rest 카드 영역 단단 (Editor's Pick 폐기 / 시각 비교 단단 paradigm):
 *   - /tmp/insight-rest-a-static.png (현 / non-hover)
 *   - /tmp/insight-rest-a-hover.png (현 / hover y:-4)
 *   - /tmp/insight-rest-b-static.png (메모리 / non-hover grayscale)
 *   - /tmp/insight-rest-b-hover.png (메모리 / hover scale-105 + grayscale-0)
 *   - /tmp/insight-rest-c-static.png (통합 / non-hover grayscale)
 *   - /tmp/insight-rest-c-hover.png (통합 / hover y:-4 + grayscale-0 + scale-105)
 */

import { chromium } from "playwright";

const URL = "http://localhost:3000/insight";

async function capture(label, cssOverride) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  await page.addInitScript((css) => {
    if (css) {
      const style = document.createElement("style");
      style.textContent = css;
      document.documentElement.appendChild(style);
    }
  }, cssOverride ?? "");

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // rest 카드 grid 영역 단단 (Editor's Pick 사후)
  const restGrid = page.locator("section.bg-white .grid").first();
  await restGrid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const restBox = await restGrid.boundingBox();
  if (!restBox) throw new Error("rest grid bounding box NG");

  // non-hover screenshot (마우스 광역 멀리)
  await page.mouse.move(10, 10);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `/tmp/insight-rest-${label}-static.png`,
    clip: {
      x: Math.max(0, restBox.x - 20),
      y: Math.max(0, restBox.y - 40),
      width: Math.min(1440, restBox.width + 40),
      height: Math.min(900 - restBox.y + 40, restBox.height + 80),
    },
  });
  console.log(`  ✓ /tmp/insight-rest-${label}-static.png`);

  // hover screenshot (rest 첫 카드 광역)
  const firstCard = page.locator("section.bg-white .grid > div").first();
  await firstCard.hover();
  await page.waitForTimeout(800); // transition 안정화
  await page.screenshot({
    path: `/tmp/insight-rest-${label}-hover.png`,
    clip: {
      x: Math.max(0, restBox.x - 20),
      y: Math.max(0, restBox.y - 40),
      width: Math.min(1440, restBox.width + 40),
      height: Math.min(900 - restBox.y + 40, restBox.height + 80),
    },
  });
  console.log(`  ✓ /tmp/insight-rest-${label}-hover.png`);

  await browser.close();
}

// CSS selector — InsightHubLayout 광역 사진 div = `aspect-[4/3] ... bg-cover bg-center` + inline style backgroundImage paradigm.
// 가장 단단 selector = aspect-[4/3] 단독 (Editor's Pick 광역 lg:aspect-auto 광역 별개 paradigm).
const CSS_B = `
  section.bg-white a > div[aria-hidden="true"][class*="aspect-"] {
    filter: grayscale(100%) !important;
    transition: filter 0.3s ease-out, transform 0.3s ease-out !important;
  }
  section.bg-white a:hover > div[aria-hidden="true"][class*="aspect-"] {
    filter: grayscale(0%) !important;
    transform: scale(1.05) !important;
  }
  /* whileHover y:-4 단계 폐기 (motion.div translate 광역 영역 0 paradigm) */
  section.bg-white .grid > div[style*="translate"] {
    transform: translate(0, 0) !important;
  }
`;

const CSS_C = `
  section.bg-white a > div[aria-hidden="true"][class*="aspect-"] {
    filter: grayscale(100%) !important;
    transition: filter 0.3s ease-out, transform 0.3s ease-out !important;
  }
  section.bg-white a:hover > div[aria-hidden="true"][class*="aspect-"] {
    filter: grayscale(0%) !important;
    transform: scale(1.05) !important;
  }
  /* whileHover y:-4 영구 보존 (정정 단계 영역 0) */
`;

async function main() {
  console.log("=== Option A 정적 + hover ===");
  await capture("a", "");

  console.log("\n=== Option B 정적 + hover ===");
  await capture("b", CSS_B);

  console.log("\n=== Option C 정적 + hover ===");
  await capture("c", CSS_C);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
