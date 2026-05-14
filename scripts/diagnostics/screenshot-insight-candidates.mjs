#!/usr/bin/env node
/**
 * /insight 카드 hover 후보 5건 시각 비교 screenshot.
 *
 * 산출 image 광역 (rest 카드 영역 + non-hover + hover):
 *   - cand1-* (Premium Editorial / Opus 후보 1)
 *   - cand3-* (Image Zoom + Reveal / Opus 후보 3)
 *   - cand4-* (Minimal Lift + Border / Opus 후보 4)
 *   - cand5-* (Premium Editorial++ / Code 자율 통합 / 후보 1 + layered shadow + title decoration)
 *
 * 후보 2 (Spotlight Reveal) = mouse-tracking dynamic = static screenshot NG → 별개 paradigm.
 */

import { chromium } from "playwright";

const URL = "http://localhost:3000/insight";

// 후보 1: Premium Editorial
const CAND1 = `
  section.bg-white .grid > div { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; }
  section.bg-white a > div[aria-hidden="true"][class*="aspect-"] {
    transition: transform 0.3s ease-out, filter 0.3s ease-out !important;
  }
  section.bg-white a:hover > div[aria-hidden="true"][class*="aspect-"] {
    transform: scale(1.05) !important;
    filter: brightness(1.05) !important;
  }
  section.bg-white .grid > div:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 8px 24px -4px rgba(0, 200, 83, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04) !important;
  }
`;

// 후보 3: Image Zoom + Reveal
const CAND3 = `
  section.bg-white .grid > div { transition: transform 0.3s ease-out !important; }
  section.bg-white a > div[aria-hidden="true"][class*="aspect-"] {
    transition: transform 0.4s ease-out !important;
  }
  section.bg-white a:hover > div[aria-hidden="true"][class*="aspect-"] {
    transform: scale(1.10) !important;
  }
  section.bg-white .grid > div:hover {
    transform: translateY(-4px) !important;
  }
  section.bg-white a span[class*="uppercase"] {
    opacity: 0.5;
    transition: opacity 0.3s !important;
  }
  section.bg-white a:hover span[class*="uppercase"] {
    opacity: 1 !important;
  }
`;

// 후보 4: Minimal Lift + Border
const CAND4 = `
  section.bg-white .grid > div { transition: transform 0.2s ease-out !important; }
  section.bg-white .grid > div a {
    border-color: rgba(0, 200, 83, 0.3) !important;
    transition: border-color 0.3s !important;
  }
  section.bg-white .grid > div:hover {
    transform: translateY(-2px) !important;
  }
  section.bg-white .grid > div:hover a {
    border-color: rgba(0, 200, 83, 1.0) !important;
  }
`;

// 후보 5 (Code 자율 통합): Premium Editorial++
//   = 후보 1 + layered shadow (brand-green + dark / 2 layer) + title underline decoration
const CAND5 = `
  section.bg-white .grid > div { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s !important; }
  section.bg-white a > div[aria-hidden="true"][class*="aspect-"] {
    transition: transform 0.3s ease-out, filter 0.3s ease-out !important;
  }
  section.bg-white a:hover > div[aria-hidden="true"][class*="aspect-"] {
    transform: scale(1.05) !important;
    filter: brightness(1.05) !important;
  }
  section.bg-white .grid > div:hover {
    transform: translateY(-4px) !important;
    box-shadow:
      0 4px 12px rgba(0, 200, 83, 0.08),
      0 20px 60px -10px rgba(0, 0, 0, 0.08) !important;
  }
  section.bg-white a h3 {
    transition: text-decoration-color 0.3s !important;
    text-decoration: underline transparent;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
  }
  section.bg-white a:hover h3 {
    text-decoration-color: rgba(0, 200, 83, 0.6) !important;
  }
`;

async function capture(label, cssOverride) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  if (cssOverride) {
    await page.addInitScript((css) => {
      const style = document.createElement("style");
      style.textContent = css;
      document.documentElement.appendChild(style);
    }, cssOverride);
  }

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const restGrid = page.locator("section.bg-white .grid").first();
  await restGrid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await restGrid.boundingBox();
  if (!box) throw new Error("rest grid bounding box NG");

  const clip = {
    x: Math.max(0, box.x - 20),
    y: Math.max(0, box.y - 40),
    width: Math.min(1440, box.width + 40),
    height: Math.min(900 - box.y + 40, box.height + 80),
  };

  // static
  await page.mouse.move(10, 10);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/insight-${label}-static.png`, clip });
  console.log(`  ✓ /tmp/insight-${label}-static.png`);

  // hover (첫 카드)
  const firstCard = page.locator("section.bg-white .grid > div").first();
  await firstCard.hover();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/insight-${label}-hover.png`, clip });
  console.log(`  ✓ /tmp/insight-${label}-hover.png`);

  await browser.close();
}

async function main() {
  console.log("=== 후보 1: Premium Editorial (Opus 추천) ===");
  await capture("cand1", CAND1);

  console.log("\n=== 후보 3: Image Zoom + Reveal ===");
  await capture("cand3", CAND3);

  console.log("\n=== 후보 4: Minimal Lift + Border ===");
  await capture("cand4", CAND4);

  console.log("\n=== 후보 5: Premium Editorial++ (Code 자율 통합) ===");
  await capture("cand5", CAND5);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
