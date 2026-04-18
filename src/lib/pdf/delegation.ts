import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { BRAND_NAME } from "@/lib/constants";
import {
  formatDelegation,
  type DelegationData,
} from "./delegationTemplate";

const FONT_REGULAR = path.join(process.cwd(), "public/fonts/NotoSansKR-Regular-subset.ttf");
const FONT_BOLD = path.join(process.cwd(), "public/fonts/NotoSansKR-Bold-subset.ttf");

const PAGE = { w: 595.28, h: 841.89, margin: 50 };
const COLOR = {
  ink900: "#171717",
  ink700: "#404040",
  ink500: "#737373",
  border: "#c9c9cc",
};

const SIG_BOX_W = 150;
const SIG_BOX_H = 50;
const SIG_GAP = 50;

let regularBytes: Buffer | null = null;
let boldBytes: Buffer | null = null;

function loadFonts(): { regular: Buffer; bold: Buffer } {
  if (!regularBytes) regularBytes = fs.readFileSync(FONT_REGULAR);
  if (!boldBytes) boldBytes = fs.readFileSync(FONT_BOLD);
  return { regular: regularBytes, bold: boldBytes };
}

interface TableRow {
  key: string;
  value: string;
}

interface SignatureBoxCoords {
  applicant: { x: number; y: number; w: number; h: number };
  agent: { x: number; y: number; w: number; h: number };
}

export interface GenerateDelegationResult {
  pdfBytes: Buffer;
  signatureCoords: SignatureBoxCoords;
}

function drawTable(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  rows: TableRow[],
  opts: { width: number; labelW: number; rowH: number },
): number {
  const { width, labelW, rowH } = opts;
  const totalH = rowH * rows.length;

  doc.lineWidth(0.6).strokeColor(COLOR.border);
  doc.rect(x, y, width, totalH).stroke();
  doc.moveTo(x + labelW, y).lineTo(x + labelW, y + totalH).stroke();

  rows.forEach((row, i) => {
    const ry = y + i * rowH;
    if (i > 0) {
      doc.moveTo(x, ry).lineTo(x + width, ry).stroke();
    }
    doc
      .font("Bold")
      .fontSize(10)
      .fillColor(COLOR.ink700)
      .text(row.key, x + 8, ry + 6, { width: labelW - 16, lineBreak: false });
    doc
      .font("Regular")
      .fontSize(10)
      .fillColor(COLOR.ink900)
      .text(row.value, x + labelW + 8, ry + 6, {
        width: width - labelW - 16,
        lineBreak: false,
        ellipsis: true,
      });
  });

  return y + totalH;
}

function drawSectionHeader(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  text: string,
): number {
  doc.font("Bold").fontSize(11).fillColor(COLOR.ink900).text(text, x, y);
  return y + 16;
}

export async function generateDelegationPdf(
  data: DelegationData,
): Promise<GenerateDelegationResult> {
  const formatted = formatDelegation(data);
  const { regular, bold } = loadFonts();

  return new Promise<GenerateDelegationResult>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE.margin,
      bufferPages: true,
      autoFirstPage: true,
      info: {
        Title: formatted.title,
        Author: formatted.delegate.rows[0]?.value ?? BRAND_NAME,
        Subject: `${formatted.caseInfo.rows[1]?.value ?? ""} 매수신청대리위임장`,
        CreationDate: new Date(data.createdAt),
      },
    });

    doc.registerFont("Regular", regular);
    doc.registerFont("Bold", bold);

    const buffers: Buffer[] = [];
    let coords: SignatureBoxCoords | null = null;

    doc.on("data", (chunk: Buffer) => buffers.push(chunk));
    doc.on("end", () => {
      if (!coords) {
        reject(new Error("signatureCoords missing — internal layout error"));
        return;
      }
      resolve({ pdfBytes: Buffer.concat(buffers), signatureCoords: coords });
    });
    doc.on("error", reject);

    try {
      const innerW = PAGE.w - PAGE.margin * 2;
      const x = PAGE.margin;
      let y = PAGE.margin;

      // 제목 박스
      const titleH = 40;
      doc.lineWidth(1).strokeColor(COLOR.ink900);
      doc.rect(x, y, innerW, titleH).stroke();
      doc
        .font("Bold")
        .fontSize(20)
        .fillColor(COLOR.ink900)
        .text(formatted.title, x, y + 10, { width: innerW, align: "center" });
      y += titleH + 10;

      // 서론
      doc
        .font("Regular")
        .fontSize(10)
        .fillColor(COLOR.ink700)
        .text(formatted.intro, x, y, {
          width: innerW,
          align: "left",
          lineGap: 1,
        });
      y = doc.y + 10;

      // 위임인 표
      y = drawSectionHeader(doc, x, y, formatted.delegator.label);
      y = drawTable(doc, x, y, [...formatted.delegator.rows], {
        width: innerW,
        labelW: 110,
        rowH: 22,
      });
      y += 8;

      // 수임인 표
      y = drawSectionHeader(doc, x, y, formatted.delegate.label);
      y = drawTable(doc, x, y, [...formatted.delegate.rows], {
        width: innerW,
        labelW: 110,
        rowH: 22,
      });
      y += 8;

      // 사건의 표시
      y = drawSectionHeader(doc, x, y, formatted.caseInfo.label);
      y = drawTable(doc, x, y, [...formatted.caseInfo.rows], {
        width: innerW,
        labelW: 110,
        rowH: 22,
      });
      y += 8;

      // 위임 사항 조문 (동적 cursor)
      y = drawSectionHeader(doc, x, y, "위임 사항");
      const numW = 16;
      formatted.clauses.forEach((clause, i) => {
        const numStr = `${i + 1}.`;
        doc.font("Bold").fontSize(9.5).fillColor(COLOR.ink900);
        doc.text(numStr, x + 4, y, { width: numW, lineBreak: false });
        doc.font("Regular").fontSize(9.5).fillColor(COLOR.ink900);
        doc.text(clause, x + 4 + numW, y, {
          width: innerW - numW - 8,
          align: "left",
          lineGap: 0.5,
        });
        y = doc.y + 3;
      });

      // 작성일 (조문 끝난 후 동적 위치)
      const dateY = y + 18;
      doc
        .font("Regular")
        .fontSize(11)
        .fillColor(COLOR.ink900)
        .text(formatted.footer.dateLabel, x, dateY, {
          width: innerW,
          align: "right",
          lineBreak: false,
        });

      // 서명 블록 (병렬 배치 — 위임인 좌, 수임인 우)
      const labelY = dateY + 22;
      const boxY = labelY + 14;

      const totalSigW = SIG_BOX_W * 2 + SIG_GAP;
      const sigStartX = x + (innerW - totalSigW) / 2;
      const applicantBoxX = sigStartX;
      const agentBoxX = sigStartX + SIG_BOX_W + SIG_GAP;

      // 라벨
      doc
        .font("Bold")
        .fontSize(10.5)
        .fillColor(COLOR.ink900)
        .text(formatted.footer.delegatorSignLabel, applicantBoxX, labelY, {
          width: SIG_BOX_W,
          align: "left",
          lineBreak: false,
        });
      doc.text(formatted.footer.delegateSignLabel, agentBoxX, labelY, {
        width: SIG_BOX_W,
        align: "left",
        lineBreak: false,
      });

      // 박스
      doc.lineWidth(0.6).strokeColor(COLOR.border);
      doc.rect(applicantBoxX, boxY, SIG_BOX_W, SIG_BOX_H).stroke();
      doc.rect(agentBoxX, boxY, SIG_BOX_W, SIG_BOX_H).stroke();

      // placeholder
      doc
        .font("Regular")
        .fontSize(8)
        .fillColor(COLOR.ink500)
        .text("(서명 영역)", applicantBoxX, boxY + SIG_BOX_H / 2 - 4, {
          width: SIG_BOX_W,
          align: "center",
          lineBreak: false,
        });
      doc.text("(인 영역)", agentBoxX, boxY + SIG_BOX_H / 2 - 4, {
        width: SIG_BOX_W,
        align: "center",
        lineBreak: false,
      });

      coords = {
        applicant: { x: applicantBoxX, y: boxY, w: SIG_BOX_W, h: SIG_BOX_H },
        agent: { x: agentBoxX, y: boxY, w: SIG_BOX_W, h: SIG_BOX_H },
      };

      // 1페이지 강제
      const range = doc.bufferedPageRange();
      if (range.count > 1) {
        reject(
          new Error(
            `PDF page overflow: ${range.count} pages. 위임 사항 조문 길이 또는 표 데이터를 확인하세요.`,
          ),
        );
        return;
      }

      doc.flushPages();
      doc.end();
    } catch (e) {
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
}
