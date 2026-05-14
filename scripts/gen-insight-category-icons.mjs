/* work-012 정정 2 — /insight 카테고리 아이콘 13건 Gemini PNG 산출.
 * 4 독립 + 1 그룹 + 8 하위 = 13건. 출력 = public/illustrations/insight/{slug}.png.
 * 실행: node --env-file=.env.local scripts/gen-insight-category-icons.mjs
 * 색 = 브랜드 팔레트 단독 (green primary / yellow accent / charcoal / white / grey).
 *      오렌지·레드·퍼플·블루 금지 (CLAUDE.md §13 절대 규칙 정합). */

import { GoogleGenAI } from "@google/genai";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const STYLE = [
  "flat 3D minimalist icon illustration, single centered object, square 1:1 composition",
  "pure white background",
  "brand color palette ONLY: vibrant green #00C853 as the dominant color, deep green #009640 for shadows and depth, small yellow #FFD43B accents only, dark charcoal #111418 for fine details and outlines, plus white and neutral grey",
  "solid flat colors, soft cast shadow underneath the object",
  "friendly clean shapes, Naver-shopping-style cute icon aesthetic",
  "NO gradient background, NO text, NO letters, NO numbers, NO logos",
  "absolutely NO orange, NO red, NO coral, NO purple, NO blue, NO pink",
].join(", ");

const ITEMS = [
  // ── 그룹 1건 ──
  {
    slug: "analysis",
    subject:
      "a green magnifying glass examining a small white house with a tiny yellow price tag attached",
  },
  // ── 독립 4건 ──
  {
    slug: "process",
    subject:
      "three ascending green steps with a small yellow flag planted on the top step",
  },
  {
    slug: "glossary",
    subject:
      "an open green book lying flat with a yellow bookmark ribbon and a tiny white house resting on the pages",
  },
  {
    slug: "data",
    subject:
      "a simple green bar chart of four rising bars with a small yellow upward arrow above them",
  },
  {
    slug: "guide",
    subject:
      "a green compass with a yellow needle pointing to the upper right",
  },
  // ── 하위 8건 ──
  {
    slug: "apartment",
    subject:
      "a tall modern green high-rise apartment tower with many small white windows",
  },
  {
    slug: "officetel",
    subject:
      "a sleek narrow modern mixed-use building, green facade with white window grid, slightly glossy",
  },
  {
    slug: "villa",
    subject:
      "a low-rise four-storey green multi-unit residential building with a small white entrance",
  },
  {
    slug: "house",
    subject:
      "a single detached green house with a triangular roof, one chimney and a small yard",
  },
  {
    slug: "dagagu",
    subject:
      "a medium green house building with three separate white doors at street level showing multiple households",
  },
  {
    slug: "dasedae",
    subject:
      "a compact green three-storey small apartment block with white balconies on each floor",
  },
  {
    slug: "store",
    subject:
      "a green storefront shop with a striped white-and-grey awning and a wide white display window",
  },
  {
    slug: "etc",
    subject:
      "a green open folder containing three small white building shapes of different kinds",
  },
];

const OUT_DIR = resolve("public/illustrations/insight");

async function generateOne({ slug, subject }) {
  const prompt = `${STYLE}. The object: ${subject}.`;
  console.log(`\n[${slug}] 생성 시작...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "1:1" },
      },
    });
    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData);
    if (!imagePart) {
      console.error(`[${slug}] FAIL: image part 없음`);
      return false;
    }
    const buf = Buffer.from(imagePart.inlineData.data, "base64");
    const outPath = resolve(OUT_DIR, `${slug}.png`);
    await writeFile(outPath, buf);
    console.log(`[${slug}] OK: ${outPath} (${buf.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`[${slug}] FAIL:`, err?.message ?? err);
    return false;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const item of ITEMS) {
    const success = await generateOne(item);
    if (success) ok += 1;
  }
  console.log(`\n=== 완료: ${ok}/${ITEMS.length} ===`);
  if (ok < ITEMS.length) process.exit(1);
}

main();
