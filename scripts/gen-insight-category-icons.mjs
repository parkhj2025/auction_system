/* work-012 정정 3 — /insight 카테고리 아이콘 13건 Gemini PNG 풀컬러 재산출.
 * 4 독립 + 1 그룹 + 8 하위 = 13건. 출력 = public/illustrations/insight/{slug}.png.
 * 실행: node --env-file=.env.local scripts/gen-insight-category-icons.mjs
 * 색 = 풀컬러 (네이버 가격비교 사진 일관 / 선명 컬러 + 플랫 일러스트).
 *      일러스트 자체 색 ≠ 페이지 색 토큰 = 분리 paradigm (형준님 정정 3 직접 의뢰). */

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
  "vibrant full-color flat 3D illustration, single centered object, square 1:1 composition",
  "rich saturated cheerful colors — blues, greens, oranges, yellows, reds, warm neutrals all welcome where they look natural",
  "pure white background",
  "clean solid flat colors, smooth rounded shapes, soft cast shadow underneath the object",
  "Naver-shopping-style cute friendly icon illustration, consistent rendering style across the whole set",
  "NO gradient background, NO text, NO letters, NO numbers, NO logos, NO photographic realism",
].join(", ");

const ITEMS = [
  // ── 그룹 1건 ──
  {
    slug: "analysis",
    subject:
      "a magnifying glass examining a small cute house with a price tag attached to it",
  },
  // ── 독립 4건 ──
  {
    slug: "process",
    subject:
      "three ascending steps with a small flag planted on the top step",
  },
  {
    slug: "glossary",
    subject:
      "an open book lying flat with a bookmark ribbon and a tiny cute house resting on the pages",
  },
  {
    slug: "data",
    subject:
      "a simple bar chart of four rising bars with a small upward arrow above them",
  },
  {
    slug: "guide",
    subject: "a classic compass with the needle pointing to the upper right",
  },
  // ── 하위 8건 ──
  {
    slug: "apartment",
    subject:
      "a tall modern high-rise apartment tower with many small windows",
  },
  {
    slug: "officetel",
    subject:
      "a sleek narrow modern mixed-use officetel building with a glossy window grid facade",
  },
  {
    slug: "villa",
    subject:
      "a low-rise four-storey multi-unit residential villa building with a small entrance",
  },
  {
    slug: "house",
    subject:
      "a single detached house with a triangular roof, one chimney and a small front yard",
  },
  {
    slug: "dagagu",
    subject:
      "a medium house building with three separate doors at street level showing multiple households",
  },
  {
    slug: "dasedae",
    subject:
      "a compact three-storey small apartment block with a balcony on each floor",
  },
  {
    slug: "store",
    subject:
      "a cheerful storefront shop with a striped awning and a wide display window",
  },
  {
    slug: "etc",
    subject:
      "an open folder containing three small building shapes of different kinds",
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
