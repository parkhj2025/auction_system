/* Phase 1.2 (A-1-2) v5 V0 — Gemini API 일러스트 생성 본질.
 * 5 일러스트 (Hero Shield+Temple + 인사이트 4 카테고리).
 * 모델명 fallback paradigm (Opus 권장 3): gemini-3-pro-image → gemini-3-pro-image-preview.
 * 글로벌 style guide 광역 적용.
 * public/illustrations/{filename}.png 저장.
 *
 * 실행: pnpm gen:illustrations
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

/* 모델명 fallback (Opus 권장 3 / 핸드오프 명시 → -preview suffix paradigm). */
const MODELS_FALLBACK = ["gemini-3-pro-image", "gemini-3-pro-image-preview"];

/* 글로벌 style guide (모든 prompt 공통 — §A-3-1 정합). */
const GLOBAL_STYLE = `
Style: Flat design illustration, isometric perspective (30deg),
single accent color #00C853 (green), white background,
Charcoal #111418 for outlines, Light Gray #F2F3F5 for ambient elements,
Yellow #FFD400 for small motion accents only,
clean lines, no gradients except brand green (#00C853 to #009640 135deg),
geometric shapes, professional but friendly,
Korean fintech aesthetic (Toss / Kakao Pay reference),
no text or letters in illustration,
transparent background (PNG with alpha),
1024x1024 square format.
`.trim();

/* 5 prompt 본질 (§A-3-2 정합). */
const PROMPTS = [
  {
    filename: "hero-shield-courthouse",
    desc: "Hero — Shield + modern Korean courthouse (V0+ 재호출 본질)",
    prompt: `Isometric flat illustration of a modern Korean civic courthouse building, 5 floors with glass facade and concrete structure. The building uses light gray (#F2F3F5) for surfaces and charcoal (#111418) for outlines and window frames. In front of the building, a large prominent green gradient shield (#00C853 to #009640 135deg) with a clean white checkmark inside the shield as the main focal point. Add yellow (#FFD400) speed dashes 2-3 short strokes around the shield to subtly suggest safety and speed. STRICTLY NO greek pillars, NO temple, NO triangular pediment, NO columns, NO gavel, NO hammer, NO scales of justice, NO people, NO text or letters anywhere. Solid pure white background (#FFFFFF), absolutely no checkered pattern, no transparency placeholder. Clean modern Korean fintech style (Toss / Kakao Pay reference).`,
  },
  {
    filename: "insight-market-chart",
    desc: "인사이트 1 — 시장 인사이트 (라인 차트) [V0++++ 재호출]",
    prompt: `Isometric flat illustration of an upward trending line chart with 3 data points, green ascending line (#00C853), small green circular dots at each peak. Charcoal (#111418) thin axis lines. Small yellow (#FFD400) accent star on the highest data point only. Light gray (#F2F3F5) ambient bars in the background to suggest isometric depth. No text or numbers. Friendly fintech style. Solid pure white background (#FFFFFF), absolutely no checkered pattern, no transparency placeholder, no transparency indicator.`,
  },
  {
    filename: "insight-guide-book",
    desc: "인사이트 2 — 가이드 (책) [V0++++ 재호출]",
    prompt: `Isometric flat illustration of an open book with a green bookmark ribbon hanging down from the top. White pages with charcoal (#111418) horizontal text placeholder lines (no readable letters). Green (#00C853) book cover and spine. Soft light gray (#F2F3F5) drop shadow underneath the book. Friendly educational style. Solid pure white background (#FFFFFF), absolutely no checkered pattern, no transparency placeholder, no transparency indicator.`,
  },
  {
    filename: "insight-news",
    desc: "인사이트 3 — 뉴스 (신문) [V0++++ 재호출]",
    prompt: `Isometric flat illustration of a folded newspaper. Charcoal (#111418) headline placeholder bars (no readable text), light gray (#F2F3F5) body text placeholder lines (preserve as ambient detail). Small green (#00C853) highlight rectangle on one section. Green strip on paper edge. Yellow (#FFD400) burst accents on corners. Subtle light gray drop shadow. Friendly editorial style. Solid pure white background (#FFFFFF), absolutely no checkered pattern, no transparency placeholder, no transparency indicator.`,
  },
  {
    filename: "insight-cases-building",
    desc: "인사이트 4 — 낙찰사례 (건물 + green pin) [V0++++ 재호출]",
    prompt: `Isometric flat illustration of a 3-floor apartment building with a green location pin (#00C853) floating above its roof with small motion arcs. Light gray (#F2F3F5) ambient secondary buildings in the background, with small ambient trees and street lamps. Charcoal (#111418) outline for the main building windows and door. White window frames. Yellow (#FFD400) small accents around the pin. No text or letters anywhere on the building. Friendly real estate style. Solid pure white background (#FFFFFF), absolutely no checkered pattern, no transparency placeholder, no transparency indicator.`,
  },
] as const;

type Result =
  | { filename: string; desc: string; ok: true; model: string; size: number; mime: string }
  | { filename: string; desc: string; ok: false; error: string };

async function generateOne(
  modelName: string,
  prompt: string,
  filename: string
): Promise<{ ok: true; size: number; mime: string } | { ok: false; error: string }> {
  try {
    const fullPrompt = `${GLOBAL_STYLE}\n\n${prompt}`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
    });

    const candidates = response.candidates ?? [];
    if (candidates.length === 0) {
      return { ok: false, error: "No candidates in response" };
    }
    const parts = candidates[0]?.content?.parts ?? [];
    for (const part of parts) {
      const inline = part.inlineData;
      if (inline?.data) {
        const buffer = Buffer.from(inline.data, "base64");
        const outDir = path.join(process.cwd(), "public", "illustrations");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(outDir, `${filename}.png`);
        fs.writeFileSync(outPath, buffer);
        return {
          ok: true,
          size: buffer.length,
          mime: inline.mimeType ?? "image/png",
        };
      }
    }
    return { ok: false, error: "No inline image data in response parts" };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function generateWithFallback(
  prompt: string,
  filename: string,
  desc: string
): Promise<Result> {
  for (const model of MODELS_FALLBACK) {
    process.stdout.write(`[${filename}] trying ${model}... `);
    const result = await generateOne(model, prompt, filename);
    if (result.ok) {
      console.log(`OK (${(result.size / 1024).toFixed(1)} KB)`);
      return { filename, desc, model, ok: true, size: result.size, mime: result.mime };
    }
    console.log(`NG (${result.error.slice(0, 80)})`);
  }
  return {
    filename,
    desc,
    ok: false,
    error: "All fallback models failed",
  };
}

async function main() {
  /* ONLY 환경 변수 본질 — 단일 또는 comma-separated list paradigm (V0+ 재호출 + V0++++ 4건 재호출 본질). */
  const onlyFilter = process.env.ONLY;
  const onlySet = onlyFilter
    ? new Set(onlyFilter.split(",").map((s) => s.trim()).filter(Boolean))
    : null;
  const targets = onlySet
    ? PROMPTS.filter((p) => onlySet.has(p.filename))
    : PROMPTS;
  if (onlySet && targets.length === 0) {
    console.error(`ONLY=${onlyFilter} 본질 일치 prompt 0건. 사용 가능: ${PROMPTS.map((p) => p.filename).join(", ")}`);
    process.exit(1);
  }
  console.log(`Generating ${targets.length} illustrations via Gemini API${onlyFilter ? ` (ONLY=${onlyFilter})` : ""}\n`);
  const results: Result[] = [];
  for (const { filename, desc, prompt } of targets) {
    const result = await generateWithFallback(prompt, filename, desc);
    results.push(result);
  }

  console.log("\n=== Summary ===");
  let okCount = 0;
  for (const r of results) {
    if (r.ok) {
      console.log(`✓ ${r.filename}.png — ${(r.size / 1024).toFixed(1)} KB / ${r.mime} (${r.model})`);
      okCount++;
    } else {
      console.log(`✗ ${r.filename} — ${r.error}`);
    }
  }
  console.log(`\nOK: ${okCount}/${results.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
