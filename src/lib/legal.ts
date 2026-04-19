/**
 * HTML/PDF 단일 소스용 법률 문구 모듈.
 * 변호사 검토 후 문구 수정 시 1곳만 변경하면 PDF/Modal/CaseConfirmCard/privacy/terms 모두 자동 반영
 * (= 1곳 수정 = 5곳 반영). Phase 4-POST의 buildRetentionNotice() 패턴(delegationTemplate.ts) 동일 적용.
 */

export const USER_INPUT_LIABILITY_NOTICE =
  "위임인이 직접 확인·입력한 사건 정보(법원·사건번호·매각기일·물건 종류·주소)에 대한 책임은 위임인에게 있으며, 잘못된 정보로 인한 입찰 무효·보증금 손실 등의 불이익은 위임인이 부담합니다.";

export const CASE_CONFIRM_CHECKBOX_LABEL =
  "위 사건 정보가 본인이 의뢰하려는 사건과 일치함을 확인합니다";

/**
 * 위임장 PDF 수임인 인(印) 영역 placeholder 안내.
 * Phase 6.5-POST (2026-04-19): 사업자등록 완료 전 인감 미삽입 상태에 대한 고객 안내.
 * 위치: PDF 본문 수임인 박스 직하 (delegation.ts) + PDFPreviewModal 하단 배너 (단일 소스).
 * 사업자등록 완료 + 도장 이미지 정식 임베드 시 본 상수 + 호출처 일괄 제거 가능.
 */
export const AGENT_SEAL_PENDING_NOTICE =
  "수임인 인감은 사업자등록 완료 후 자동 삽입됩니다.";
