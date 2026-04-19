/**
 * 양식 검증용 샘플 PDF 생성 (1회용).
 * 실 모듈(src/lib/pdf/delegation.ts)을 그대로 호출 → 단일 소스 원칙 유지.
 *
 * 두 가지 케이스:
 *  - default → scripts/sample-delegation.pdf       (표준 길이 주소)
 *  - long-address → scripts/sample-delegation-long.pdf (장문 주소 회귀)
 */
import fs from "node:fs";
import { generateDelegationPdf } from "../src/lib/pdf/delegation";
import type { DelegationData } from "../src/lib/pdf/delegationTemplate";
import { getKSTDateTimeIso } from "../src/lib/datetime";

const baseSample: DelegationData = {
  delegator: {
    name: "박형준",
    ssnFront: "900101",
    ssnBack: "1234567",
    address: "인천광역시 미추홀구 주안동 100-1 101호",
    phone: "010-1234-5678",
  },
  caseNumber: "2021타경521675",
  courtLabel: "인천지방법원",
  // bidDate는 샘플 시뮬레이션 — 특정 사건 매각기일 고정 표현 (실제 입찰일 의미).
  bidDate: "2026-04-18",
  bidAmount: 99_470_000,
  deposit: 9_947_000,
  signatureDataUrl: null,
  // createdAt은 실행 시점(오늘 KST)으로 동적 생성.
  createdAt: getKSTDateTimeIso(),
};

const longAddressSample: DelegationData = {
  ...baseSample,
  delegator: {
    ...baseSample.delegator,
    address:
      "인천광역시 미추홀구 주안동 길고긴 아파트 단지 이름 제2차 123동 4567호 (60자 이상 장문 주소 회귀 테스트)",
  },
};

async function generate(label: string, data: DelegationData, outPath: string) {
  const { pdfBytes, signatureCoords } = await generateDelegationPdf(data);
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`[${label}] ${outPath} (${(pdfBytes.length / 1024).toFixed(0)} KB)`);
  console.log(
    `  signatureCoords: applicant=${JSON.stringify(signatureCoords.applicant)}, agent=${JSON.stringify(signatureCoords.agent)}`,
  );
}

async function main() {
  // PDF 뷰어 lock 회피용. 검증 후 형준님이 닫고 본 파일명으로 rename 또는
  // 다음 빌드에서 자연 덮어쓰기.
  await generate("default", baseSample, "scripts/sample-delegation-v5.pdf");
  await generate("long-address", longAddressSample, "scripts/sample-delegation-long-v4.pdf");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
