/**
 * PDF 생성 후 필수 검증 규칙 (Phase 1 형준님 명령):
 *  1. pdf-parse로 텍스트 추출
 *  2. 템플릿 원본 문자열 집합과 byte-level 비교
 *  3. 누락 1글자라도 있으면 exit code 1
 *  4. 페이지 수 == 1 (서명 블록이 다음 페이지로 분리되면 치명)
 *
 * 사용:
 *   node scripts/verify-pdf-text.mjs                              # 기본
 *   node scripts/verify-pdf-text.mjs scripts/sample-other.pdf      # 다른 PDF
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PDF = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(ROOT, "scripts/sample-delegation.pdf");

const expectedFragments = [
  "매수신청대리위임장",
  "위임인은 아래 수임인에게 다음 부동산 경매 사건의 매수신청 대리에 관한 일체의 권한을 위임합니다",
  "위임인 (매수신청인)",
  "성명",
  "박형준",
  "주민등록번호",
  "900101-1234567",
  "주소",
  "연락처",
  "010-1234-5678",
  "수임인 (매수신청대리인)",
  "사무소",
  "경매퀵",
  "대표자",
  "박형준 (공인중개사)",
  "등록번호",
  "공인중개사 등록번호 미정 (사업자등록 후 갱신)",
  "사무소 주소",
  "사무소 주소 미정 (사업자등록 후 갱신)",
  "연락처 미정",
  "매수신청 대리 사건의 표시",
  "법원",
  "인천지방법원",
  "사건번호",
  "2021타경521675",
  "매각기일",
  "2026년 04월 18일",
  "입찰금액",
  "99,470,000원",
  "입찰보증금",
  "9,947,000원",
  "위임 사항",
  "수임인은 위임인을 대리하여 위 사건의 매각기일에 출석하여 입찰표를 제출하고 매수신청을 합니다",
  "수임인은 입찰표 작성, 입찰보증금 납부, 영수증 수령 등 매수신청에 부수하는 일체의 행위를 할 권한을 가집니다",
  "수임인은 매수신청의 결과(낙찰·차순위·패찰 등)를 위임인에게 지체 없이 통보합니다",
  "본 위임장은 위 사건의 해당 매각기일에 한하여 효력이 있으며, 다른 매각기일 또는 다른 사건에는 적용되지 않습니다",
  "위임인은 수임인이 본 위임에 따라 한 매수신청을 위임인 본인의 행위로 인정합니다",
  "작성일:",
  "위임인: 박형준 (서명)",
  "(서명 영역)",
  "수임인: 박형준 (인)",
  "(인 영역)",
];

console.log(`PDF: ${PDF}`);
const { PDFParse } = await import("pdf-parse");
const pdfBytes = fs.readFileSync(PDF);
const parser = new PDFParse({ data: new Uint8Array(pdfBytes) });
const result = await parser.getText();
const extractedRaw = result.text ?? "";

const pageCount = result.pages?.length ?? (extractedRaw.match(/-- \d+ of \d+ --/g) || []).length;
console.log(`pages: ${pageCount}`);
console.log("");
// 줄바꿈/공백 정규화 (pdf 추출은 줄바꿈을 임의 위치에 끼울 수 있음)
const extracted = extractedRaw.replace(/\s+/g, "");

let missing = 0;
console.log("expected fragment".padEnd(60) + " | match");
console.log("-".repeat(72));
for (const frag of expectedFragments) {
  const norm = frag.replace(/\s+/g, "");
  const ok = extracted.includes(norm);
  if (!ok) missing++;
  console.log(`${(frag.length > 56 ? frag.substring(0, 53) + "..." : frag).padEnd(60)} | ${ok ? "✓" : "✗ MISSING"}`);
}

console.log("");
console.log(`총 ${expectedFragments.length}개 프래그먼트 중 누락 ${missing}개`);

// 글자 단위 누락 체크 (모든 expected 글자가 추출 텍스트에 1번이라도 등장하는지)
const allChars = new Set();
for (const frag of expectedFragments) {
  for (const ch of frag) {
    if (ch.match(/[가-힣]/)) allChars.add(ch);
  }
}
const missingChars = [];
for (const ch of allChars) {
  if (!extracted.includes(ch)) missingChars.push(ch);
}
console.log(`한글 고유 글자 ${allChars.size}개 중 추출 누락 ${missingChars.length}개`);
if (missingChars.length > 0) {
  console.log(`누락 글자: ${missingChars.join(", ")}`);
}

const pageOverflow = pageCount !== 1;

if (missing > 0 || missingChars.length > 0 || pageOverflow) {
  console.log("");
  if (pageOverflow) console.log(`❌ FAIL: 페이지 수 ${pageCount} (1페이지 강제 위반).`);
  if (missing > 0 || missingChars.length > 0) console.log("❌ FAIL: 텍스트 검증 실패.");
  console.log("완료 보고 금지.");
  process.exit(1);
} else {
  console.log("");
  console.log("✓ PASS: 1페이지 + 모든 프래그먼트 + 한글 글자 추출됨");
  console.log("⚠ 주의: 텍스트 추출 OK ≠ 시각 렌더링 OK. 형준님 시각 검증 필수.");
}
