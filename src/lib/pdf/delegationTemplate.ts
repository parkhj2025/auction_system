import { AGENT_INFO, COMPANY, PRIVACY_CONTACT } from "@/lib/constants";
import { formatKSTDate } from "@/lib/datetime";

export interface DelegationData {
  delegator: {
    name: string;
    ssnFront: string;
    ssnBack: string;
    address: string;
    phone: string;
  };
  caseNumber: string;
  courtLabel: string;
  bidDate: string;
  bidAmount: number;
  deposit: number;
  signatureDataUrl: string | null;
  createdAt: string;
}

export interface DelegateInfo {
  officeName: string;
  ceoName: string;
  registrationNo: string;
  address: string;
  phone: string;
}

export const DELEGATE_INFO: DelegateInfo = {
  officeName: COMPANY.name,
  ceoName: COMPANY.ceo,
  registrationNo: AGENT_INFO.registrationNo,
  address: AGENT_INFO.address,
  phone: AGENT_INFO.phone,
};

export const DELEGATION_TITLE = "매수신청대리위임장";

/**
 * 서명 박스 좌표는 더 이상 정적 상수가 아니다.
 * 위임 사항 조문의 wrap 결과에 따라 실제 cursor y가 달라지므로,
 * delegation.ts의 generateDelegationPdf()가 페이지 하단 영역에서 동적으로
 * 계산한 좌표를 GenerateDelegationResult.signatureCoords로 반환한다.
 * Phase 2 서명 이미지 임베드 시 그 반환값을 사용한다.
 */

export const DELEGATION_INTRO =
  "위임인은 아래 수임인에게 다음 부동산 경매 사건의 매수신청 대리에 관한 일체의 권한을 위임합니다.";

export const DELEGATION_CLAUSES: ReadonlyArray<string> = [
  "수임인은 위임인을 대리하여 위 사건의 매각기일에 출석하여 입찰표를 제출하고 매수신청을 합니다.",
  "수임인은 입찰표 작성, 입찰보증금 납부, 영수증 수령 등 매수신청에 부수하는 일체의 행위를 할 권한을 가집니다.",
  "수임인은 매수신청의 결과(낙찰·차순위·패찰 등)를 위임인에게 지체 없이 통보합니다.",
  "본 위임장은 위 사건의 해당 매각기일에 한하여 효력이 있으며, 다른 매각기일 또는 다른 사건에는 적용되지 않습니다.",
  "위임인은 수임인이 본 위임에 따라 한 매수신청을 위임인 본인의 행위로 인정합니다.",
];

/**
 * PDF 본문 하단에 인쇄되는 보존·파기·연락처 경고문.
 * 근거: 전자상거래법 제6조 + 매수신청대리인 등록 등에 관한 규칙 제15조 → 5년 보관.
 * Modal과 PDF 양쪽이 동일 데이터(formatted.retentionNotice)를 소비.
 */
export function buildRetentionNotice(): string {
  return (
    "본 문서는 매수신청대리 업무 기록으로 전자상거래법 제6조 및 「공인중개사의 " +
    "매수신청대리인 등록 등에 관한 규칙」 제15조에 따라 5년간 보관되며, 기간 " +
    "만료 후 자동 파기됩니다. 개인정보 열람·정정·삭제 요청: " +
    PRIVACY_CONTACT
  );
}

export interface DelegationFormatted {
  title: string;
  intro: string;
  delegator: {
    label: string;
    rows: Array<{ key: string; value: string }>;
  };
  delegate: {
    label: string;
    rows: Array<{ key: string; value: string }>;
  };
  caseInfo: {
    label: string;
    rows: Array<{ key: string; value: string }>;
  };
  clauses: ReadonlyArray<string>;
  footer: {
    dateLabel: string;
    delegatorSignLabel: string;
    delegateSignLabel: string;
  };
  /** PDF 본문 하단 + Modal 하단에 동일하게 표기되는 보존·파기·연락처 경고문 */
  retentionNotice: string;
}

function formatKrwAmount(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

// 입력 ISO 무관 항상 Asia/Seoul 기준 출력 (UTC 서버 환경 대응).
const formatDate = formatKSTDate;

function formatSsn(front: string, back: string): string {
  const f = (front || "").padEnd(6, " ");
  const b = (back || "").padEnd(7, " ");
  return `${f.trim()}-${b.trim()}`;
}

export function formatDelegation(data: DelegationData): DelegationFormatted {
  return {
    title: DELEGATION_TITLE,
    intro: DELEGATION_INTRO,
    delegator: {
      label: "위임인 (매수신청인)",
      rows: [
        { key: "성명", value: data.delegator.name },
        { key: "주민등록번호", value: formatSsn(data.delegator.ssnFront, data.delegator.ssnBack) },
        { key: "주소", value: data.delegator.address },
        { key: "연락처", value: data.delegator.phone },
      ],
    },
    delegate: {
      label: "수임인 (매수신청대리인)",
      rows: [
        { key: "사무소", value: DELEGATE_INFO.officeName },
        { key: "대표자", value: `${DELEGATE_INFO.ceoName} (공인중개사)` },
        { key: "등록번호", value: DELEGATE_INFO.registrationNo },
        { key: "사무소 주소", value: DELEGATE_INFO.address },
        { key: "연락처", value: DELEGATE_INFO.phone },
      ],
    },
    caseInfo: {
      label: "매수신청 대리 사건의 표시",
      rows: [
        { key: "법원", value: data.courtLabel },
        { key: "사건번호", value: data.caseNumber },
        { key: "매각기일", value: formatDate(data.bidDate) },
        { key: "입찰금액", value: formatKrwAmount(data.bidAmount) },
        { key: "입찰보증금", value: formatKrwAmount(data.deposit) },
      ],
    },
    clauses: DELEGATION_CLAUSES,
    footer: {
      dateLabel: `작성일: ${formatDate(data.createdAt)}`,
      delegatorSignLabel: `위임인: ${data.delegator.name} (서명)`,
      delegateSignLabel: `수임인: ${DELEGATE_INFO.ceoName} (인)`,
    },
    retentionNotice: buildRetentionNotice(),
  };
}
