/**
 * 클라이언트 사이드 위임장 PDF 생성 스모크 테스트.
 *
 * 목적: pdf-lib + @pdf-lib/fontkit + NotoSansKR 커스텀 폰트 임베드의 통합이
 *       Node 환경에서 정상 작동하는지 빠르게 검증.
 *
 * 회귀 catch 대상 (Phase 6.5-POST, 2026-04-19):
 * - registerFontkit() 누락 → "Input to PDFDocument.embedFont was a custom font,
 *   but no fontkit instance was found" 에러
 * - 폰트 파일 경로 변경/누락 → ENOENT
 * - pdf-lib 메이저 버전 변경 시 API 변경
 *
 * 한계:
 * - generateDelegationPdfClient() 자체는 "use client" + fetch("/fonts/...") 사용으로
 *   Node 직접 호출 어려움. 본 스모크는 핵심 의존성(pdf-lib + fontkit + custom TTF) 통합만 검증.
 * - 전체 PDF 본문(레이아웃·서명·표) 시각 검증은 dev 서버에서 형준님 수행.
 *
 * 실행: node scripts/smoke-delegation-client.mjs
 *
 * CLAUDE.md Conventions: PDF 생성 코드 수정 시 본 스크립트 + Node PDFKit 샘플
 * (gen-sample-delegation.ts) 양쪽 PASS 필수.
 */
import fs from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const ROOT = process.cwd();
const REGULAR_PATH = path.join(ROOT, "public/fonts/NotoSansKR-Regular-subset.ttf");
const BOLD_PATH = path.join(ROOT, "public/fonts/NotoSansKR-Bold-subset.ttf");

async function main() {
  if (!fs.existsSync(REGULAR_PATH)) {
    throw new Error(`Regular font not found: ${REGULAR_PATH}`);
  }
  if (!fs.existsSync(BOLD_PATH)) {
    throw new Error(`Bold font not found: ${BOLD_PATH}`);
  }

  const regularBytes = fs.readFileSync(REGULAR_PATH);
  const boldBytes = fs.readFileSync(BOLD_PATH);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontReg = await pdfDoc.embedFont(regularBytes, { subset: true });
  const fontBold = await pdfDoc.embedFont(boldBytes, { subset: true });

  const page = pdfDoc.addPage([595.28, 841.89]);
  page.drawText("위임장 클라이언트 스모크 테스트", {
    x: 50,
    y: 750,
    font: fontBold,
    size: 18,
  });
  page.drawText(
    "pdf-lib + @pdf-lib/fontkit + NotoSansKR custom font 통합 검증",
    {
      x: 50,
      y: 720,
      font: fontReg,
      size: 11,
    },
  );

  const bytes = await pdfDoc.save();

  if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
    console.error("✗ FAIL: PDF byte length 0 또는 잘못된 타입");
    process.exit(1);
  }

  console.log(
    `✓ PASS: pdf-lib + @pdf-lib/fontkit + NotoSansKR custom embedFont (${(bytes.length / 1024).toFixed(1)} KB)`,
  );
}

main().catch((err) => {
  console.error("✗ FAIL:", err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
