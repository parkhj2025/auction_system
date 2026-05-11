import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/* cycle 1-G-β — /about What 섹션 일러스트 산출 (Gemini 3 Pro Image Preview).
 * 출력: public/illustrations/about-what-v1.png
 * 비율: 16:6 (sharp crop 사후 처리 / 3 icon 가로 정렬). */

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPT = `A minimalist illustration showing three icon-style symbols arranged horizontally on a clean white background. Center icon: a green checkmark (#00C853) above a gavel and document, representing "bidding service" — bold and prominent. Left icon: a faded grey magnifying glass with subtle X mark, representing "legal analysis (not our service)". Right icon: a faded grey house key with subtle X mark, representing "eviction/investment advice (not our service)". Flat design, geometric shapes, charcoal (#111418) outlines, generous spacing. Korean modern minimalist aesthetic. No text labels. 16:6 aspect ratio.`;

console.log("[about-what] 산출 진입...");

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
  console.log(`[about-what] PNG 수신: ${pngBuffer.length} bytes`);

  /* 16:9 산출 → 16:6 crop (상하 약화) + 1600x600 + lanczos3 + PNG 저장. */
  const meta = await sharp(pngBuffer).metadata();
  const srcW = meta.width ?? 1376;
  const srcH = meta.height ?? 768;
  const targetRatio = 16 / 6;
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
    .resize(1600, 600, { kernel: "lanczos3", withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toBuffer();
  console.log(`[about-what] PNG crop + resize: ${pngOut.length} bytes`);

  const outPath = resolve("public/illustrations/about-what-v1.png");
  await writeFile(outPath, pngOut);
  console.log(`[about-what] OK: ${outPath}`);
} catch (err) {
  console.error("[about-what] FAIL:", err?.message || err);
  process.exit(1);
}
