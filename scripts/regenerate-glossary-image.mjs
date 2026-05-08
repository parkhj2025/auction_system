import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/* Cycle 8-3 — glossary.jpg 단일 재생성 (Gemini 3 Pro Image Preview / 실사 cinematic editorial / 현 3장 톤앤매너 정합).
 * 출력: public/images/insight/glossary.jpg (현 파일 광역 교체)
 * 비율: 16:9 (Gemini API 지원값 중 2:1 가로 정합 / 카드 split 좌 정사각 영역에 object-cover) */

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FAIL: GEMINI_API_KEY 없음");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPT =
  "A Korean professional in their 30s sitting at a wooden desk in a bright modern office with large windows. Natural side lighting from the left creates a warm, soft atmosphere. The person is reading and annotating a thick glossary book or reference dictionary, with a fountain pen in hand and several open books spread across the desk. Beside the books, there are sticky notes with handwritten Korean terms, a notebook with neat handwriting, and a coffee cup. A small potted plant sits on the windowsill in the background. The person wears a beige knit sweater or a light navy blazer over a white shirt. Photography style: cinematic, editorial, shallow depth of field, soft natural light, warm color grading with beige and navy tones, slightly desaturated for a sophisticated minimal look. Aspect ratio 2:1 horizontal composition with the subject positioned slightly off-center. The atmosphere should feel studious, calm, and focused — conveying the act of carefully studying and explaining auction terminology. No text, no logos, no graphics overlay. Photorealistic.";

console.log("[glossary] 생성 시작...");

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
  console.log(`[glossary] PNG 수신: ${pngBuffer.length} bytes`);

  // PNG → JPG 변환 (현 3장 .jpg 정합 / quality 90)
  const jpgBuffer = await sharp(pngBuffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  console.log(`[glossary] JPG 변환: ${jpgBuffer.length} bytes`);

  const outPath = resolve("public/images/insight/glossary.jpg");
  await writeFile(outPath, jpgBuffer);
  console.log(`[glossary] OK: ${outPath}`);
} catch (err) {
  console.error("[glossary] FAIL:", err?.message || err);
  process.exit(1);
}
