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
      "Editorial real estate photograph, 3:4 portrait, modern contemporary Korean property analyst office, Korean professional analyst looking at large monitor displaying apartment listings, floor plans, and interior photos of Korean residential buildings, blueprints and property documents on the desk, side view, focused expression, warm natural window light, muted neutral tones (beige, charcoal, soft white), shallow depth of field, cinematic, Getty Images real estate editorial aesthetic, no stock charts, no trading screens, no text overlay, no logos. Professional human-centered documentary.",
  },
  {
    slug: "glossary",
    prompt:
      "Editorial real estate photograph, 3:4 portrait, modern Korean real estate brokerage office, Korean professional reviewing property documents and a city district map showing apartment buildings, real estate listing materials (apartment photos, floor plans) spread on a wide wooden desk, three-quarter view, focused posture, warm natural office light, muted neutral tones (warm beige, charcoal, soft white), shallow depth of field, cinematic, Getty Images real estate editorial aesthetic, no stock charts, no financial data screens, no text overlay, no logos. Professional human-centered documentary.",
  },
  {
    slug: "news",
    prompt:
      "Editorial real estate photograph, 3:4 portrait, modern Korean professional reading a newspaper open to a real estate property section showing apartment building photos and housing market articles, sitting at a clean desk in a contemporary office, laptop and coffee cup nearby, side or three-quarter view, focused expression, warm natural window light, muted neutral tones (warm beige, charcoal, soft white), shallow depth of field, cinematic, Getty Images real estate editorial aesthetic, no broadcast TV studio, no anchors, no text overlay, no logos. Professional human-centered documentary.",
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
const total = PROMPTS.length;
console.log(`\n=== 완료: ${total - failed}/${total} 성공 ===`);
process.exit(failed > 0 ? 1 : 0);
