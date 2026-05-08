import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/* Cycle 9-2 — trust-bg.jpg 생성 (Gemini 3 Pro Image Preview / 추상 black-green flow / TrustCTA bg).
 * 출력: public/images/trust-bg.jpg (현 hero-poster.jpg 광역 회수)
 * 비율: 16:9 horizontal / TrustCTA section bg paradigm 정합 */

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPT =
  "An abstract, cinematic, high-resolution background image evoking trust and speed. Dark black background (#111418) with flowing streams of vibrant emerald green light (#00C853) curving and weaving through the composition like a high-speed light trail or fiber optic flow. The green light should appear luminous, slightly motion-blurred, and suggest forward momentum. The composition is heavy and grounded — not floating particles, but solid streams of light bending across the frame from left to right. Negative space is dominant; the green flows occupy 30-40% of the visible area, leaving rich black space around them. Photographic style: macro long-exposure photography of light trails, with subtle bloom and depth of field. The mood is sophisticated, premium, calm yet powerful — conveying reliability, precision, and forward motion. No text, no logos, no human figures, no recognizable objects. 16:9 horizontal aspect ratio. Photorealistic and ultra-sharp, suitable for use as a hero background.";

console.log("[trust-bg] 생성 시작...");

try {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: PROMPT,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);
  if (!imagePart) {
    console.error("FAIL: image part 없음", JSON.stringify(response, null, 2).slice(0, 500));
    process.exit(1);
  }

  const pngBuffer = Buffer.from(imagePart.inlineData.data, "base64");
  console.log(`[trust-bg] PNG 수신: ${pngBuffer.length} bytes`);

  const jpgBuffer = await sharp(pngBuffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  console.log(`[trust-bg] JPG 변환: ${jpgBuffer.length} bytes`);

  const outPath = resolve("public/images/trust-bg.jpg");
  await writeFile(outPath, jpgBuffer);
  console.log(`[trust-bg] OK: ${outPath}`);
} catch (err) {
  console.error("[trust-bg] FAIL:", err?.message || err);
  process.exit(1);
}
