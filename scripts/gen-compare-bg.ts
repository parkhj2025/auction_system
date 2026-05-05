/* v45 — Compare 배경 일러스트 2장 생성 (형준님 검토 의무 / Tier 2).
 *
 * 의도 (Plan v45 정정 2):
 * - 시간 흐름 추상 풍경 / 부동산·경매 정합
 * - 무채색 또는 light green tint
 * - 부드러운 그라데이션 / 입체감 약함
 * - 시계 0 / 3D 0 / 주식·트레이딩 0 / 한자 0 / 길거리 0
 * - opacity 0.15-0.20 시각 (전경 메시지 보호 의무)
 *
 * 옵션 A: 한국 도시 스카이라인 추상 (light green tint / 부드러운 그라데이션)
 * 옵션 B: 부동산 청사진 / 도면 추상 (부드러운 라인 / light green tint)
 *
 * 실행: node --env-file=.env.local --experimental-strip-types scripts/gen-compare-bg.ts
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
    filename: "compare-bg-a-cityscape",
    desc: "Option A 모던 정정 — 한국 도시 스카이라인 modern flat vector / clean geometry / light green tint",
    prompt: `Modern minimal Korean cityscape silhouette as a soft background illustration.
Wide horizontal landscape format, 16:9 aspect ratio.
Subject: A clean row of modern Korean apartment buildings and residential towers (typical Korean cityscape — apartment complexes, low-rise houses, a few high-rise buildings) silhouetted against a soft pastel sky.
Style: MODERN MINIMAL FLAT VECTOR ILLUSTRATION with clean geometric silhouettes and crisp edges. Flat color fields with smooth even gradients. NOT watercolor, NOT painted, NOT hand-drawn texture, NOT brushy. Reference aesthetic: Vercel/Linear/Stripe landing page style translated to a calm cityscape. Clean, refined, contemporary.
Color palette: Predominantly soft cool grays (#E5E7EB, #D1D5DB) and very pale mint green (#E6FAEE, #D1FAE5) tones with subtle hints of brand green #00C853 used only on tiny clean accents (rooftop edges, a few crisp highlights). Sky gradient from pure white #FFFFFF at top to soft mint green near horizon, smooth and clean — not painterly.
Detail level: VERY LOW DETAIL — just clean geometric building silhouettes (rectangular shapes, simple roof variations), absolutely no windows, no readable text, no characters, no clocks, no ornaments, no painterly texture, no brush strokes. Just clean flat shapes with subtle layered depth.
Mood: Modern, calm, minimal, technological-yet-warm, refined.
Composition: Cityscape silhouette occupies bottom 1/3 with clean horizontal alignment, sky 2/3 with smooth flat gradient. Generous negative space dominates the upper area for text overlay.
Layering: Subtle overlapping layers of buildings (foreground darker silhouette, midground medium, background lightest) — but each layer is a CLEAN FLAT silhouette, not painted.
ABSOLUTELY NOT: 3D rendering, watercolor texture, hand-painted look, brush strokes, painterly effects, ink wash, clocks, money/coins, trading charts, characters or people, purple, pink, red, harsh pure black, busy detail, ornate elements.
Modern flat vector illustration, designed to be used as a 15-20% opacity background layer behind text content.`.trim(),
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
  console.log(`Generating ${PROMPTS.length} compare bg illustrations via Gemini API\n`);
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
