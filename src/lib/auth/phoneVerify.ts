/**
 * 휴대폰 본인인증 — Phase 5 (Stage 2B 작업 10) mock 구현.
 *
 * 인터페이스 확정. 내부 로직은 Stage 2C(사업자등록 후) 실 SDK로 교체.
 * 실 SDK 전환 시 이 파일의 verifyPhone() 본문만 교체하면 되도록 인터페이스
 * 안정성을 유지한다. 호출자(Step2/PhoneVerifyModal)는 변경 불필요.
 *
 * --- NICE/KCB/토스 비교표 (Stage 2C 진입 시 의사결정 자료) ---
 *
 * | 사업자       | 통신3사 통합 비용/월 | 단건 비용  | 구현 난이도 | 사업자등록 요구  | 비고                       |
 * | ----------- | ------------------- | --------- | ---------- | --------------- | -------------------------- |
 * | NICE 평가정보 | ~30,000원 (기본료) + | ~80~100원 | 중          | 필수            | 가장 일반적, 문서 풍부      |
 * |             | 사용량               |           | (iframe)   |                 |                            |
 * | KCB 코리아   | ~30,000원 (기본료)   | ~70~90원  | 중          | 필수            | NICE 대비 약간 저렴         |
 * |             |                      |           | (iframe)   |                 |                            |
 * | 토스 본인인증 | 0원 (기본료 없음)    | ~200원    | 하 (REST)  | 필수, 사업자 인증 | 단건 비용 비싸나 초기 부담 0,|
 * |             |                      |           |            | 추가             | 월 100건 이하면 가장 저렴   |
 *
 * Phase 5 시점 권장: **토스** (월 트래픽 100건 이하 예상, 기본료 0).
 * Phase 5 → 2C 진입 시점에 월 트래픽 추정치로 재판단.
 *
 * --- mock vs 실 SDK 렌더 방식 차이 (UI 설계 시 인지) ---
 *
 * mock은 단순 모달에서 verify 버튼 1개 → 즉시 결과 반환.
 * 실 SDK 대부분 iframe(NICE/KCB) 또는 외부 redirect(토스 일부).
 * → PhoneVerifyModal의 컨테이너 박스는 유지하되, 내용물(버튼 vs iframe)이
 *   교체 가능한 구조로 설계해야 함.
 */

import { getKSTDateTimeIso } from "@/lib/datetime";

export interface PhoneVerifyRequest {
  phone: string;
  name: string;
  ssnFront: string;
}

export interface PhoneVerifyResult {
  ok: boolean;
  /** 연계정보 (Connecting Information) — 실 SDK에서 제공. mock은 미발급. */
  ci?: string;
  /** 중복가입확인정보 (Duplicate Information) — 실 SDK에서 제공. mock은 미발급. */
  di?: string;
  /** 인증 제공자 식별자. mock 단계는 "mock", Stage 2C에서 "nice"|"kcb"|"toss" */
  provider?: string;
  /** 인증 완료 시점 KST ISO. */
  mockedAt?: string;
}

const MOCK_DELAY_MS = 500;

/**
 * 휴대폰 본인인증을 수행한다.
 *
 * Phase 5 (mock): 500ms delay 후 항상 ok: true 반환. ci/di는 미발급.
 * Stage 2C: 실 SDK 호출로 본문 교체. 인터페이스/시그니처는 유지.
 */
export async function verifyPhone(
  req: PhoneVerifyRequest,
): Promise<PhoneVerifyResult> {
  // mock 단계 미사용. Stage 2C 실 SDK에서 통신사로 전달.
  void req;
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return {
    ok: true,
    provider: "mock",
    mockedAt: getKSTDateTimeIso(),
  };
}
