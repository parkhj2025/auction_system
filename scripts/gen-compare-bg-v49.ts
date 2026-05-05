/* v49 — Compare 배경 일러스트 2장 신규 생성 (Tier 2 형준님 검토 의무).
 *
 * 의도 (Plan v49 정정 5):
 * - 시간 흐름 또는 도시 풍경 부드러운 추상
 * - 무채색 또는 light green tint
 * - 부동산·경매 정합
 * - 시계 0 / 3D 0 / 주식·트레이딩 0 / 아크·곡선·그리드 0
 * - Stripe·Linear paradigm 부드러운 그라데이션
 * - 16:5 ULTRA WIDE 비율
 * - opacity 0.10-0.15 시각 (전경 가독성 보호)
 *
 * 옵션 A v49: Refined Cityscape (v48 paradigm 보존 + silhouette 영역 ↓ / 더 부드러운 그라데이션)
 * 옵션 B v49: Soft Horizon (atmospheric horizon + minimal silhouette / 80% sky)
 *
 * 실행: node --env-file=.env.local --experimental-strip-types scripts/gen-compare-bg-v49.ts
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
    filename: "compare-bg-v49-a-refined-cityscape",
    desc: "Option A v49 — Refined Cityscape (silhouette 영역 ↓ + 더 부드러운 그라데이션 / 16:5 ULTRA WIDE)",
    prompt: `Modern minimal Korean cityscape silhouette as a refined soft background illustration.
Wide horizontal panoramic format, 16:5 aspect ratio (ULTRA WIDE - panoramic banner).
Subject: A clean refined row of modern Korean apartment buildings and residential towers stretching across the entire width — apartment complexes, low-rise houses, mid-rise buildings spread evenly with subtle height variation. The cityscape silhouette occupies ONLY the bottom 35-40% of the canvas, with the upper 60-65% being expansive smooth gradient sky.
Style: MODERN MINIMAL FLAT VECTOR ILLUSTRATION with very clean geometric silhouettes and crisp edges. Refined, contemporary, breathing. Vercel/Linear/Stripe landing page aesthetic translated to a calm panoramic cityscape with generous atmospheric space.
Color palette: Predominantly very soft cool grays (#E5E7EB, #D1D5DB) and very pale mint green (#E6FAEE, #ECFDF5) tones with extremely subtle hints of brand green #00C853 used only on tiny accents (a few rooftop edges). Sky gradient from pure white #FFFFFF at top to soft mint green near horizon, smooth and clean — completely flat, not painterly.
Detail level: VERY LOW DETAIL — clean geometric building silhouettes, NO windows visible, NO readable text, NO characters, NO clocks, NO ornaments, NO painterly texture, NO brush strokes. Pure flat geometric shapes only.
Mood: Refined, calm, minimal, atmospheric, panoramic, breathing space, contemporary.
Composition: Cityscape silhouette = bottom 35-40% with clean horizontal alignment fully spread across the wide canvas, sky = top 60-65% with smooth flat gradient. Generous atmospheric space dominates the upper area.
Layering: Subtle 2-3 layered building silhouettes (foreground darker, background lighter) — but each layer is a CLEAN FLAT silhouette with crisp edges.
ABSOLUTELY NOT: 3D rendering, watercolor texture, hand-painted, brush strokes, painterly effects, ink wash, clocks, money/coins, trading charts, characters or people, purple, pink, red, harsh pure black, busy detail, ornate elements, arcs, curves, grids, dotted patterns, dashed lines, lens flares.
Modern refined flat vector illustration, designed for 10-15% opacity background layer behind text content.`.trim(),
  },
  {
    filename: "compare-bg-v49-b-soft-horizon",
    desc: "Option B v49 — Soft Horizon (atmospheric / 80% sky + 20% minimal silhouette / breathing space)",
    prompt: `Abstract minimal soft horizon as an atmospheric background illustration.
Wide horizontal panoramic format, 16:5 aspect ratio (ULTRA WIDE - panoramic banner format).
Subject: A simple wide horizon with very minimal silhouette of distant Korean residential buildings (just suggestive flat rectangular shapes at the very bottom edge / barely visible). The dominant element is the soft expansive gradient sky / atmospheric space.
Style: MODERN MINIMAL with soft smooth gradient. Vercel/Linear/Stripe paradigm. Almost abstract, atmospheric, breathing space. Clean flat vector aesthetic — no painterly texture.
Color palette: Predominantly very soft cool grays and pale mint green (#E6FAEE) with subtle hints of brand green #00C853 only at the horizon line (a thin subtle accent). Smooth even gradient from pure white #FFFFFF at top to very soft mint green at bottom horizon.
Detail level: EXTREMELY LOW DETAIL — barely visible building silhouettes (just suggestive flat rectangular blocks at very bottom 15-20% of canvas), generous atmospheric negative space dominates 80-85% of the canvas.
Mood: Calm, breathing space, time-passing, atmospheric, modern, minimal, refined.
Composition: Building silhouettes occupy ONLY the bottom 15-20% with very subtle presence (light gray flat shapes spreading horizontally), rest 80-85% is the expansive gradient sky. Horizontal spread covers full width but with minimal visual weight.
ABSOLUTELY NOT: 3D rendering, watercolor texture, painterly effects, clocks, money/coins, trading charts, characters or people, purple, pink, red, harsh black, ornate elements, arcs, curves, grids, dotted patterns, busy detail, brush strokes, lens flares.
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
  console.log(`Generating ${PROMPTS.length} v49 compare bg illustrations (16:5 ULTRA WIDE / refined paradigm)\n`);
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
