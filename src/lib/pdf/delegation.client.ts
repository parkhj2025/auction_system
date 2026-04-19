"use client";

import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import { AGENT_SEAL_PENDING_NOTICE } from "@/lib/legal";
import {
  formatDelegation,
  type DelegationData,
  type DelegationFormatted,
} from "./delegationTemplate";

/**
 * 클라이언트 사이드 위임장 PDF 미리보기 생성 (Phase 6.5-POST 작업 3, 2026-04-19).
 *
 * 설계 원칙:
 * - 서버 PDFKit(delegation.ts)과 별개의 브라우저 호환 pdf-lib 기반.
 * - delegationTemplate.formatDelegation() 결과 객체 동일 소비 → HTML/PDF 단일 소스 유지.
 * - byte-level 동일성 불필요 (Out of Scope 확정) — 시각 정보 표시 목적.
 * - Storage 저장 PDF는 서버 재생성으로 처리. 본 모듈 결과는 미리보기 전용.
 *
 * 좌표계: pdf-lib는 bottom-up (y=0이 하단). PDFKit은 top-down. ty() 헬퍼로 변환.
 */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const COLOR = {
  ink900: rgb(0.09, 0.09, 0.09),
  ink700: rgb(0.25, 0.25, 0.25),
  ink500: rgb(0.45, 0.45, 0.45),
  border: rgb(0.79, 0.79, 0.80),
};

const SIG_BOX_W = 150;
const SIG_BOX_H = 42;
const SIG_GAP = 50;

let regularBytesCache: ArrayBuffer | null = null;
let boldBytesCache: ArrayBuffer | null = null;

async function loadFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
  if (!regularBytesCache) {
    const res = await fetch("/fonts/NotoSansKR-Regular-subset.ttf");
    if (!res.ok) {
      throw new Error(`Failed to load regular font: ${res.status}`);
    }
    regularBytesCache = await res.arrayBuffer();
  }
  if (!boldBytesCache) {
    const res = await fetch("/fonts/NotoSansKR-Bold-subset.ttf");
    if (!res.ok) {
      throw new Error(`Failed to load bold font: ${res.status}`);
    }
    boldBytesCache = await res.arrayBuffer();
  }
  return { regular: regularBytesCache, bold: boldBytesCache };
}

/** PDFKit top-down y → pdf-lib bottom-up y 변환 */
function ty(yFromTop: number): number {
  return PAGE_H - yFromTop;
}

/** 한국어 char-by-char wrap (font.widthOfTextAtSize 기반) */
function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
): string[] {
  const lines: string[] = [];
  let current = "";
  for (const char of text) {
    const test = current + char;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
      if (current) lines.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateDelegationPdfClient(
  data: DelegationData,
): Promise<Uint8Array> {
  const formatted: DelegationFormatted = formatDelegation(data);
  const { regular, bold } = await loadFonts();

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(formatted.title);
  pdfDoc.setAuthor(formatted.delegate.rows[0]?.value ?? "");
  pdfDoc.setCreationDate(new Date());

  const fontReg = await pdfDoc.embedFont(regular, { subset: true });
  const fontBold = await pdfDoc.embedFont(bold, { subset: true });
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);

  const innerW = PAGE_W - MARGIN * 2;
  const x = MARGIN;
  let cursor = MARGIN;

  // 제목 박스
  page.drawRectangle({
    x,
    y: ty(cursor + 40),
    width: innerW,
    height: 40,
    borderColor: COLOR.ink900,
    borderWidth: 1,
  });
  const titleW = fontBold.widthOfTextAtSize(formatted.title, 20);
  page.drawText(formatted.title, {
    x: x + (innerW - titleW) / 2,
    y: ty(cursor + 28),
    font: fontBold,
    size: 20,
    color: COLOR.ink900,
  });
  cursor += 50;

  // 서론
  const introLines = wrapText(formatted.intro, innerW, fontReg, 10);
  for (const line of introLines) {
    page.drawText(line, {
      x,
      y: ty(cursor + 10),
      font: fontReg,
      size: 10,
      color: COLOR.ink700,
    });
    cursor += 13;
  }
  cursor += 8;

  // 표 헬퍼
  function drawTable(
    label: string,
    rows: ReadonlyArray<{ key: string; value: string }>,
  ) {
    page.drawText(label, {
      x,
      y: ty(cursor + 11),
      font: fontBold,
      size: 11,
      color: COLOR.ink900,
    });
    cursor += 16;

    const labelW = 110;
    const rowH = 22;
    const tableH = rowH * rows.length;

    page.drawRectangle({
      x,
      y: ty(cursor + tableH),
      width: innerW,
      height: tableH,
      borderColor: COLOR.border,
      borderWidth: 0.6,
    });
    page.drawLine({
      start: { x: x + labelW, y: ty(cursor) },
      end: { x: x + labelW, y: ty(cursor + tableH) },
      color: COLOR.border,
      thickness: 0.6,
    });

    rows.forEach((row, i) => {
      const ry = cursor + i * rowH;
      if (i > 0) {
        page.drawLine({
          start: { x, y: ty(ry) },
          end: { x: x + innerW, y: ty(ry) },
          color: COLOR.border,
          thickness: 0.6,
        });
      }
      page.drawText(row.key, {
        x: x + 8,
        y: ty(ry + 14),
        font: fontBold,
        size: 10,
        color: COLOR.ink700,
      });
      page.drawText(row.value, {
        x: x + labelW + 8,
        y: ty(ry + 14),
        font: fontReg,
        size: 10,
        color: COLOR.ink900,
      });
    });
    cursor += tableH + 8;
  }

  drawTable(formatted.delegator.label, [...formatted.delegator.rows]);
  drawTable(formatted.delegate.label, [...formatted.delegate.rows]);
  drawTable(formatted.caseInfo.label, [...formatted.caseInfo.rows]);

  // 위임 사항 조문
  page.drawText("위임 사항", {
    x,
    y: ty(cursor + 11),
    font: fontBold,
    size: 11,
    color: COLOR.ink900,
  });
  cursor += 16;

  const numW = 16;
  for (let i = 0; i < formatted.clauses.length; i++) {
    const clause = formatted.clauses[i];
    page.drawText(`${i + 1}.`, {
      x: x + 4,
      y: ty(cursor + 9.5),
      font: fontBold,
      size: 9.5,
      color: COLOR.ink900,
    });
    const clauseLines = wrapText(clause, innerW - numW - 8, fontReg, 9.5);
    for (let j = 0; j < clauseLines.length; j++) {
      page.drawText(clauseLines[j], {
        x: x + 4 + numW,
        y: ty(cursor + 9.5),
        font: fontReg,
        size: 9.5,
        color: COLOR.ink900,
      });
      cursor += 11;
    }
    cursor += 3;
  }

  // 작성일 (우측 정렬)
  cursor += 14;
  const dateW = fontReg.widthOfTextAtSize(formatted.footer.dateLabel, 10.5);
  page.drawText(formatted.footer.dateLabel, {
    x: x + innerW - dateW,
    y: ty(cursor + 10.5),
    font: fontReg,
    size: 10.5,
    color: COLOR.ink900,
  });
  cursor += 18;

  // 서명 라벨 + 박스 (병렬)
  const totalSigW = SIG_BOX_W * 2 + SIG_GAP;
  const sigStartX = x + (innerW - totalSigW) / 2;
  const applicantBoxX = sigStartX;
  const agentBoxX = sigStartX + SIG_BOX_W + SIG_GAP;

  const labelY = cursor;
  page.drawText(formatted.footer.delegatorSignLabel, {
    x: applicantBoxX,
    y: ty(labelY + 10.5),
    font: fontBold,
    size: 10.5,
    color: COLOR.ink900,
  });
  page.drawText(formatted.footer.delegateSignLabel, {
    x: agentBoxX,
    y: ty(labelY + 10.5),
    font: fontBold,
    size: 10.5,
    color: COLOR.ink900,
  });

  cursor += 18;
  const boxY = cursor;
  page.drawRectangle({
    x: applicantBoxX,
    y: ty(boxY + SIG_BOX_H),
    width: SIG_BOX_W,
    height: SIG_BOX_H,
    borderColor: COLOR.border,
    borderWidth: 0.6,
  });
  page.drawRectangle({
    x: agentBoxX,
    y: ty(boxY + SIG_BOX_H),
    width: SIG_BOX_W,
    height: SIG_BOX_H,
    borderColor: COLOR.border,
    borderWidth: 0.6,
  });

  // 위임인 박스: 서명 이미지 임베드 또는 placeholder
  if (data.signatureDataUrl) {
    try {
      const sigPng = await pdfDoc.embedPng(data.signatureDataUrl);
      const sigDims = sigPng.scaleToFit(SIG_BOX_W - 4, SIG_BOX_H - 4);
      page.drawImage(sigPng, {
        x: applicantBoxX + (SIG_BOX_W - sigDims.width) / 2,
        y: ty(boxY + (SIG_BOX_H + sigDims.height) / 2),
        width: sigDims.width,
        height: sigDims.height,
      });
    } catch {
      const placeholderText = "(서명 임베드 실패)";
      const pw = fontReg.widthOfTextAtSize(placeholderText, 8);
      page.drawText(placeholderText, {
        x: applicantBoxX + (SIG_BOX_W - pw) / 2,
        y: ty(boxY + SIG_BOX_H / 2 + 3),
        font: fontReg,
        size: 8,
        color: COLOR.ink500,
      });
    }
  } else {
    const placeholderText = "(서명 영역)";
    const pw = fontReg.widthOfTextAtSize(placeholderText, 8);
    page.drawText(placeholderText, {
      x: applicantBoxX + (SIG_BOX_W - pw) / 2,
      y: ty(boxY + SIG_BOX_H / 2 + 3),
      font: fontReg,
      size: 8,
      color: COLOR.ink500,
    });
  }

  // 수임인 박스: placeholder 유지 + 인감 안내 1줄 (PDFKit과 동일 패턴)
  const sealPlaceholder = "(인 영역)";
  const spw = fontReg.widthOfTextAtSize(sealPlaceholder, 8);
  page.drawText(sealPlaceholder, {
    x: agentBoxX + (SIG_BOX_W - spw) / 2,
    y: ty(boxY + SIG_BOX_H / 2 + 3),
    font: fontReg,
    size: 8,
    color: COLOR.ink500,
  });

  const sealNoticeY = boxY + SIG_BOX_H + 4;
  const snw = fontReg.widthOfTextAtSize(AGENT_SEAL_PENDING_NOTICE, 7);
  page.drawText(AGENT_SEAL_PENDING_NOTICE, {
    x: agentBoxX + (SIG_BOX_W - snw) / 2,
    y: ty(sealNoticeY + 7),
    font: fontReg,
    size: 7,
    color: COLOR.ink500,
  });

  // 책임 조항 + retentionNotice 합성 paragraph (PDFKit 패턴 그대로)
  const noticeY = boxY + SIG_BOX_H + 16;
  const noticeText = `${formatted.userLiabilityNotice} ${formatted.retentionNotice}`;
  const noticeLines = wrapText(noticeText, innerW, fontReg, 7);
  let noticeCursor = noticeY;
  for (const line of noticeLines) {
    page.drawText(line, {
      x,
      y: ty(noticeCursor + 7),
      font: fontReg,
      size: 7,
      color: COLOR.ink500,
    });
    noticeCursor += 9;
  }

  return await pdfDoc.save();
}
