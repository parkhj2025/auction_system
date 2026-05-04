import { GoogleGenAI } from "@google/genai";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPTS = [
  {
    slug: "analysis",
    prompt:
      "3D illustration in flat Apple-style minimalist 3D rendering, 3:4 portrait, Korean male professional in business attire sitting at a clean desk analyzing real estate listings on a monitor, floor plans and apartment listing documents on the desk, pure white background, brand color palette only (vibrant green #00C853, yellow #FFD43B, dark charcoal #111418, plus white and neutral grey), solid flat colors, NO gradient, NO realistic photo, NO stock charts, NO trading graphs, NO cryptocurrency, NO TV studio, soft cast shadows, modern minimalist 3D character design.",
  },
  {
    slug: "guide",
    prompt:
      "3D illustration in flat Apple-style minimalist 3D rendering, 3:4 portrait, two Korean professionals (male mentor and male client) at a clean meeting table reviewing a checklist document together, mentor pointing at the checklist, pure white background, brand color palette only (vibrant green #00C853, yellow #FFD43B, dark charcoal #111418, plus white and neutral grey), solid flat colors, NO gradient, NO realistic photo, NO stock charts, soft cast shadows, modern minimalist 3D character design.",
  },
  {
    slug: "glossary",
    prompt:
      "3D illustration in flat Apple-style minimalist 3D rendering, 3:4 portrait, Korean male professional holding a magnifying glass examining an open book on a desk with small 3D house icons sitting on the book pages, pure white background, brand color palette only (vibrant green #00C853, yellow #FFD43B, dark charcoal #111418, plus white and neutral grey), solid flat colors, NO gradient, NO realistic photo, NO Hanja characters, NO Japanese, soft cast shadows, modern minimalist 3D character design.",
  },
  {
    slug: "news",
    prompt:
      "3D illustration in flat Apple-style minimalist 3D rendering, 3:4 portrait, Korean male professional in business attire reading a folded newspaper at a clean desk with a laptop open beside him, the newspaper showing real estate property section with small apartment building illustrations, pure white background, brand color palette only (vibrant green #00C853, yellow #FFD43B, dark charcoal #111418, plus white and neutral grey), solid flat colors, NO gradient, NO realistic photo, NO TV studio, NO broadcast anchors, soft cast shadows, modern minimalist 3D character design.",
  },
];

async function generateOne({ slug, prompt }) {
  console.log(`\n[${slug}] 생성 시작...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData);
    if (!imagePart) {
      console.error(`[${slug}] FAIL: image part 없음`, JSON.stringify(response, null, 2).slice(0, 500));
      return false;
    }
    const buf = Buffer.from(imagePart.inlineData.data, "base64");
    const outPath = resolve(`public/images/insight/${slug}.png`);
    await writeFile(outPath, buf);
    console.log(`[${slug}] OK: ${outPath} (${buf.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`[${slug}] FAIL:`, err?.message || err);
    return false;
  }
}

const results = await Promise.all(PROMPTS.map(generateOne));
const failed = results.filter((r) => !r).length;
const total = PROMPTS.length;
console.log(`\n=== 완료: ${total - failed}/${total} 성공 ===`);
process.exit(failed > 0 ? 1 : 0);
