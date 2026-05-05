/* v48 — Compare 배경 일러스트 2장 생성 (16:5 ULTRA WIDE / Tier 2 형준님 검토 의무).
 *
 * 의도 (Plan v48 정정 5):
 * - 시간 흐름 또는 도시 풍경 부드러운 추상
 * - 무채색 또는 light green tint
 * - 부동산·경매 정합
 * - 시계 0 / 3D 0 / 주식·트레이딩 0 / 아크·곡선·그리드 0
 * - Stripe·Linear paradigm 부드러운 그라데이션
 * - 16:5 비율 (가로 길이 ≥ 세로 3배)
 *
 * 옵션 A: 한국 도시 스카이라인 silhouette (v45 paradigm 광역 + ULTRA WIDE 16:5)
 * 옵션 B: 부드러운 horizon + minimal silhouette (atmospheric paradigm / extremely low detail)
 *
 * 실행: node --env-file=.env.local --experimental-strip-types scripts/gen-compare-bg-v48.ts
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

const MODELS_FALLBACK = ["gemini-3-pro-image", "gemini-3-pro-image-preview"];

const PROMPTS = [
  {
    filename: "compare-bg-v48-a-cityscape-wide",
    desc: "Option A — 한국 도시 스카이라인 16:5 ULTRA WIDE / clean geometric / light green tint",
    prompt: `Modern minimal Korean cityscape silhouette as a soft background illustration.
Wide horizontal panoramic format, 16:5 aspect ratio (ULTRA WIDE - height is approximately 1/3 of width, like a panoramic banner).
Subject: A clean wide row of modern Korean apartment buildings and residential towers stretching across the ENTIRE width of the canvas — apartment complexes, low-rise houses, mid-rise buildings spread evenly and horizontally with subtle variation in heights.
Style: MODERN MINIMAL FLAT VECTOR ILLUSTRATION with clean geometric silhouettes and crisp edges. Flat color fields with smooth even gradients. NOT watercolor, NOT painted, NOT hand-drawn, NOT brushy. Reference aesthetic: Vercel/Linear/Stripe landing page aesthetic translated to a calm panoramic cityscape.
Color palette: Predominantly soft cool grays (#E5E7EB, #D1D5DB) and very pale mint green (#E6FAEE, #D1FAE5) tones with very subtle hints of brand green #00C853 used only on tiny clean accents (a few rooftop edges only). Sky gradient from pure white #FFFFFF at top to soft mint green near horizon, smooth and clean — not painterly.
Detail level: VERY LOW DETAIL — just clean geometric building silhouettes (rectangular shapes, simple roof variations), ABSOLUTELY no windows, no readable text, no characters, no clocks, no ornaments, no painterly texture, no brush strokes. Just clean flat shapes with subtle layered depth.
Mood: Modern, calm, minimal, technological-yet-warm, refined, panoramic.
Composition: Cityscape silhouette occupies bottom 50% with clean horizontal alignment spreading FULLY across the wide canvas, sky 50% with smooth flat gradient. The horizontal spread is critical — buildings should fill the entire width edge-to-edge.
Layering: Subtle overlapping layers of buildings (foreground darker silhouette, midground medium, background lightest) — but each layer is a CLEAN FLAT silhouette, not painted.
ABSOLUTELY NOT: 3D rendering, watercolor texture, hand-painted look, brush strokes, painterly effects, ink wash, clocks, money/coins, trading charts, characters or people, purple, pink, red, harsh pure black, busy detail, ornate elements, arcs, curves, grids, dotted patterns, dashed lines.
Modern flat vector illustration, designed to be used as a 10-15% opacity background layer behind text content.`.trim(),
  },
  {
    filename: "compare-bg-v48-b-horizon-atmospheric",
    desc: "Option B — minimal horizon + atmospheric / 부드러운 sky gradient + extremely low detail",
    prompt: `Abstract minimal horizon background as a soft atmospheric illustration.
Wide horizontal panoramic format, 16:5 aspect ratio (ULTRA WIDE - panoramic banner format).
Subject: A simple wide horizon line with very minimal silhouette of distant Korean residential buildings (just suggestive rectangular shapes at the very bottom edge). The dominant element is the soft expansive gradient sky — most of the canvas is sky / atmospheric space.
Style: MODERN MINIMAL with soft smooth gradient. Vercel/Linear/Stripe paradigm. Almost abstract, atmospheric, breathing space. Clean flat vector aesthetic.
Color palette: Predominantly very soft cool grays and pale mint green (#E6FAEE) with subtle hints of brand green #00C853 in the horizon area only. Smooth even gradient from pure white #FFFFFF at top to very soft mint green at bottom horizon.
Detail level: EXTREMELY LOW DETAIL — barely visible building silhouettes (just suggestive flat rectangular blocks at very bottom 15-20% of canvas), generous atmospheric negative space dominates 80% of the canvas.
Mood: Calm, breathing space, time-passing, atmospheric, modern, minimal.
Composition: Building silhouettes occupy ONLY the bottom 15-20% with very subtle presence (light gray flat shapes), rest 80-85% is the gradient sky. Horizontal spread of silhouettes covers full width but with minimal visual weight.
ABSOLUTELY NOT: 3D rendering, watercolor texture, painterly effects, clocks, money/coins, trading charts, characters or people, purple, pink, red, harsh black, ornate elements, arcs, curves, grids, dotted patterns, busy detail, brush strokes.
Modern minimal atmospheric flat illustration, designed for 10-15% opacity background layer behind text content.`.trim(),
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
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
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
  return { filename, desc, ok: false, error: "All fallback models failed" };
}

async function main() {
  console.log(`Generating ${PROMPTS.length} v48 compare bg illustrations (16:5 ULTRA WIDE)\n`);
  const results: Result[] = [];
  for (const { filename, desc, prompt } of PROMPTS) {
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
