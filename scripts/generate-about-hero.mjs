import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/* cycle 1-G-β — /about Hero 일러스트 산출 (Gemini 3 Pro Image Preview).
 * 출력: public/illustrations/about-hero-v1.png
 * 비율: 16:10 (sharp crop 사후 처리 / Gemini API aspectRatio config 표준 비율 외 paradigm). */

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPT = `A minimalist illustration showing a professional Korean real estate agent (공인중개사) confidently walking towards a courthouse building, carrying a leather folder. Flat design style with clean geometric shapes. Use a color palette of charcoal (#111418) for the figure outline, vibrant green (#00C853) for accents on the folder and tie, soft yellow (#FFD43B) for a subtle highlight. White background. Korean modern minimalist aesthetic. The agent appears trustworthy and competent. No text in the illustration. 16:10 aspect ratio.`;

console.log("[about-hero] 산출 진입...");

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
    console.error(
      "FAIL: image part 없음",
      JSON.stringify(response, null, 2).slice(0, 500)
    );
    process.exit(1);
  }

  const pngBuffer = Buffer.from(imagePart.inlineData.data, "base64");
  console.log(`[about-hero] PNG 수신: ${pngBuffer.length} bytes`);

  /* 16:9 산출 → 16:10 crop (상하 약화) + lanczos3 + PNG 저장 (alpha 영구 보존). */
  const meta = await sharp(pngBuffer).metadata();
  const srcW = meta.width ?? 1376;
  const srcH = meta.height ?? 768;
  const targetRatio = 16 / 10;
  const srcRatio = srcW / srcH;
  let cropW = srcW;
  let cropH = srcH;
  if (srcRatio > targetRatio) {
    cropW = Math.round(srcH * targetRatio);
  } else {
    cropH = Math.round(srcW / targetRatio);
  }
  const offsetX = Math.round((srcW - cropW) / 2);
  const offsetY = Math.round((srcH - cropH) / 2);

  const pngOut = await sharp(pngBuffer)
    .extract({ left: offsetX, top: offsetY, width: cropW, height: cropH })
    .resize(1600, 1000, { kernel: "lanczos3", withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toBuffer();
  console.log(`[about-hero] PNG crop + resize: ${pngOut.length} bytes`);

  const outPath = resolve("public/illustrations/about-hero-v1.png");
  await writeFile(outPath, pngOut);
  console.log(`[about-hero] OK: ${outPath}`);
} catch (err) {
  console.error("[about-hero] FAIL:", err?.message || err);
  process.exit(1);
}
