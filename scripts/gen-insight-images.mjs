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
      "Editorial business photograph, 3:4 portrait, modern contemporary office, Korean professional analyst working at standing desk, looking at large monitor displaying real estate data charts and graphs, side view, focused expression, warm natural window light, muted neutral tones (beige, charcoal, soft white), shallow depth of field, cinematic, contemporary corporate atmosphere, Getty Images business editorial aesthetic, no text overlay, no logos. Professional human-centered documentary.",
  },
  {
    slug: "guide",
    prompt:
      "Editorial business photograph, 3:4 portrait, modern minimalist consulting meeting room, two Korean professionals (consultant and client) seated across a clean wooden table, consultant gesturing while explaining, paper documents and laptop on table, large window with diffused natural light, muted neutral tones (warm grey, soft white, charcoal), shallow depth of field, cinematic, contemporary corporate consulting atmosphere, Getty Images business editorial aesthetic, no text overlay, no logos. Professional human-centered documentary.",
  },
  {
    slug: "glossary",
    prompt:
      "Editorial business photograph, 3:4 portrait, modern contemporary office with large digital display screen showing data visualization or financial dashboard, Korean professional standing in front studying the screen, three-quarter back view, focused posture, soft cool ambient light mixed with screen glow, muted neutral tones (slate grey, charcoal, soft white), shallow depth of field, cinematic, contemporary corporate atmosphere, Getty Images business editorial aesthetic, no text overlay, no logos. Professional human-centered documentary.",
  },
  {
    slug: "news",
    prompt:
      "Editorial business photograph, 3:4 portrait, modern newsroom or media studio, Korean professional journalist seated at desk with multiple monitors showing news content and data, side or three-quarter view, focused expression, soft cool ambient light, muted neutral tones (cool grey, charcoal, soft white), shallow depth of field, cinematic, contemporary media atmosphere, Getty Images business editorial aesthetic, no text overlay, no logos. Professional human-centered documentary.",
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
