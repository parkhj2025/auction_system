/* Phase 1.2 (A-1-2) v7 V0 (재진입) — Manako-style flat illustration + 캐릭터 + 환경 + green primary.
 * paradigm 광역 변경: monoline / 와이어프레임 폐기 → flat illustration full-color + 풍부한 색감.
 * Manako purple base → green primary 변환 (브랜드 정수 보존).
 *
 * 5건 정수 영역:
 * 1. hero-infographic — 사무실 isometric + 캐릭터(소파/모바일/미소) + 노트북·서류 floating + green checkmark + 식물 + 램프 + 도시 background + green gradient 배경
 * 2. feature-1 — 집 거실 + 캐릭터(소파/모바일/편안/미소) + green 알림 bubble + 식물 + 램프 + 쿠션
 * 3. feature-2 — 데스크 + 캐릭터(노트북/미소) + 종이 → 모바일 변환 + green sparkle + 화살표
 * 4. feature-3 — bank scene + 캐릭터(서류/미소) + 동전 + green shield + 분리 계좌 + green ring
 * 5. compare — split scene + 좌 캐릭터 stressed (시계 + 법원 + 피곤) → 화살표 → 우 캐릭터 happy (소파 + 모바일 + green + 미소)
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

const MODELS_FALLBACK = ["gemini-3-pro-image", "gemini-3-pro-image-preview"];

/* v7 (재진입) 광역 style guide — Manako-style flat illustration + green primary. */
const GLOBAL_STYLE = `
Style: Modern flat vector illustration in the style of Manako/Storyset/Dribbble landing page heros,
1024x1024 square format, isometric perspective when needed,
RICH FULL-COLOR illustration (NOT monoline, NOT wireframe, NOT outline-only),
characters drawn as cute friendly young adults with full body, expressive smiling faces, simple geometric features,
GREEN PRIMARY dominant color: brand green #00C853 with #009640 (deeper green) for shadows/depth,
soft green gradient backgrounds (#E6FAEE to #C8F0DC tones for ambient),
warm secondary colors allowed: yellow #FFD400 (small accents only), peach/orange (object accents),
charcoal #111418 for text/lines/details (NOT for backgrounds),
clean shapes with soft shadows underneath objects,
environment-rich scenes (furniture, plants, lamps, devices, ambient elements),
no text, no letters, no logos, no numbers, no readable characters anywhere,
solid background — either pure white #FFFFFF OR soft green gradient (no checkered pattern, no transparency placeholder, no transparency indicator),
absolutely NO pink, NO red, NO coral, NO purple as primary or background,
absolutely NO monoline / wireframe / outline-only style.
Reference aesthetic: Toss landing page illustrations, Storyset.com, Dribbble "fintech illustration" search results,
but with green primary instead of purple/blue.
`.trim();

const PROMPTS = [
  {
    filename: "hero-infographic",
    desc: "Hero — 사무실 + 캐릭터 + 노트북·서류 + green checkmark + 도시 + green gradient",
    prompt: `Hero scene: Modern bright office interior in isometric perspective with soft green gradient background (light green to white). One cheerful young Korean professional character (full body, sitting comfortably with a laptop on their lap, friendly smile). Around them, floating elements: a smartphone, paper documents stacking up, and a large green checkmark icon glowing. Background details: large windows with soft sun rays, indoor potted plants with green leaves, modern hanging pendant lamps, a small city skyline visible through the windows (cute simple buildings). The dominant color theme is GREEN (#00C853) — character's outfit accents in green, plants in green, ambient gradient in soft green. Yellow #FFD400 small accents allowed (lamp glow / sparkle). NO purple, NO pink. Rich flat illustration style like Manako/Storyset hero.`,
  },
  {
    filename: "feature-1-no-courthouse",
    desc: "Feature 1 — 집 거실 + 캐릭터 소파 + 모바일 + green 알림 bubble + 식물 + 램프",
    prompt: `Cozy home living room scene with soft green gradient background. One cheerful young Korean character sitting comfortably on a modern sofa with cushions, holding a smartphone with both hands, looking at the screen with a relaxed smile. Above the smartphone, a large green notification bubble icon floats up with a white checkmark inside. Environment details: indoor potted plants with rich green leaves on either side, a tall floor lamp with warm yellow glow, decorative pillows, a small side table, a hanging picture frame on the wall, hardwood floor. The dominant color theme is GREEN — sofa in soft green tone, plants vivid green, notification bright green #00C853. Character's outfit in warm friendly colors (peach top, comfortable). NO purple, NO pink, NO red. Rich flat illustration style like Manako/Storyset cozy home scene.`,
  },
  {
    filename: "feature-2-document-digital",
    desc: "Feature 2 — 데스크 + 캐릭터 노트북 + 종이→모바일 변환 + green sparkle + 화살표",
    prompt: `Modern workspace desk scene with soft green gradient background. One cheerful young Korean character (full body, sitting at a desk on a comfortable chair, looking at a laptop screen with a satisfied smile). On the desk, a stack of paper documents transforming into a smartphone display through a curved green arrow with a sparkle effect. Environment details: a desk with green tabletop or green accent, indoor plant in a pot, a coffee mug with steam, a desk lamp with warm glow, papers scattered, a calendar on the wall. The dominant color theme is GREEN — desk surface, plant, transformation arrow all in vivid green #00C853. Character in warm friendly outfit. Yellow #FFD400 small accents (sparkle / lamp). NO purple, NO pink. Rich flat illustration style like Manako/Storyset workspace scene.`,
  },
  {
    filename: "feature-3-deposit-separated",
    desc: "Feature 3 — bank scene + 캐릭터 서류 + 동전 + green shield + 분리 계좌 + green ring",
    prompt: `Bank/finance scene with soft green gradient background. One cheerful young Korean character (full body, holding a folder of documents with both hands, professional friendly smile). Behind/around the character, financial elements: a large stack of golden coins protected by a glowing green shield icon, a green ring/halo of protection circling the coins, two separated bank account cards floating to the sides (one labeled with a piggy bank icon, one with a vault lock icon), small floating green checkmarks indicating safety. Environment details: a soft green gradient background, indoor plant accent, modern bank counter or desk in the background. The dominant color theme is GREEN — shield, protection ring, account icons all in vivid green #00C853. Coins in golden yellow #FFD400. Character in professional warm outfit. NO purple, NO pink, NO red. Rich flat illustration style like Manako/Storyset finance scene.`,
  },
  {
    filename: "compare-flow",
    desc: "Compare — split scene + 좌 캐릭터 stressed (시계+법원+피곤) → 화살표 → 우 캐릭터 happy (소파+모바일+green+미소)",
    prompt: `Split-scene before-and-after comparison illustration with soft green gradient background. LEFT SIDE: A young Korean character looking tired and stressed, walking heavily with a heavy bag towards a small Korean civic courthouse building in the background, with a clock showing many hours floating above their head, sweat drops, slumped posture, neutral/grayish color tones for this side (charcoal outline, muted grays). MIDDLE: A bold curved arrow flowing left to right with a green sparkle / transformation effect. RIGHT SIDE: The same character now happy and relaxed, sitting comfortably on a sofa at home, holding a smartphone with a big bright smile, a green notification bubble with a white checkmark floating up, indoor plants and warm lighting, soft green gradient ambient. The transformation: stressful left → easy joyful right. The right side is GREEN dominant (#00C853) — sofa accent, notification, plants. NO purple, NO pink. Rich flat illustration style like Manako/Storyset transformation scene.`,
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
  return { filename, desc, ok: false, error: "All fallback models failed" };
}

async function main() {
  const onlyFilter = process.env.ONLY;
  const onlySet = onlyFilter
    ? new Set(onlyFilter.split(",").map((s) => s.trim()).filter(Boolean))
    : null;
  const targets = onlySet
    ? PROMPTS.filter((p) => onlySet.has(p.filename))
    : PROMPTS;
  if (onlySet && targets.length === 0) {
    console.error(`ONLY=${onlyFilter} 일치 prompt 0건. 사용 가능: ${PROMPTS.map((p) => p.filename).join(", ")}`);
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
