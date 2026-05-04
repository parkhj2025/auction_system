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
      "Editorial documentary photograph, 3:4 portrait, top-down view of a desk with property analysis documents, real estate auction papers, blueprints partially visible, calculator, marked-up Korean printout, neutral muted tones, beige and slate, soft shadow, depth of field, cinematic lighting, Apple stock photo aesthetic, no text overlay, no people, no logo. Professional documentary still life.",
  },
  {
    slug: "guide",
    prompt:
      "Editorial documentary photograph, 3:4 portrait, library bookshelf scene with old leather bound legal books, gentle golden afternoon light, warm tan and dark brown tones, depth of field, cinematic, classical educational atmosphere, Apple stock photo aesthetic, no text overlay, no people, no logo, no Korean text. Professional documentary still life.",
  },
  {
    slug: "glossary",
    prompt:
      "Editorial documentary photograph, 3:4 portrait, close-up of an open Korean dictionary or legal glossary, Hanja Chinese characters visible on aged paper, vintage fountain pen resting on the page, muted sepia and ivory tones, soft natural light from the side, shallow depth of field, scholarly atmosphere, Apple stock photo aesthetic, no people, no logo. Professional documentary still life.",
  },
  {
    slug: "news",
    prompt:
      "Editorial documentary photograph, 3:4 portrait, modern minimal cafe table with newspaper folded, laptop closed, ceramic coffee cup, soft morning light through window, neutral grey and warm white tones, shallow depth of field, contemporary urban Seoul atmosphere, Apple stock photo aesthetic, no text overlay, no people, no logo, no Korean text. Professional documentary still life.",
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
    const outPath = resolve(`public/images/insight/${slug}.jpg`);
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
console.log(`\n=== 완료: ${4 - failed}/4 성공 ===`);
process.exit(failed > 0 ? 1 : 0);
