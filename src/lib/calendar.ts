/**
 * 영업일 계산 utility (cycle 1-D-A-4-6 신규).
 *
 * Phase 1 paradigm = 주말 단독 skip (토요일 + 일요일).
 * Phase 2 영역 = 한국 공휴일 정합 paradigm (별개 cycle 영역 / data source 의무).
 *
 * 사용 영역: Step5Payment + Step5Complete 입금 마감 자동 표기 paradigm.
 * 입금 마감 paradigm = 매각기일 -1 영업일 오후 8시 (KST).
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTC+9

const KOR_DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * 매각기일 ISO string (YYYY-MM-DD) → KST 자정 Date.
 * Vercel 서버 = UTC paradigm 정합 (CLAUDE.md datetime 룰 정합).
 */
function parseBidDateKst(bidDateIso: string): Date {
  // YYYY-MM-DD → KST 00:00:00 시점 (UTC = 전일 15:00:00).
  return new Date(`${bidDateIso}T00:00:00+09:00`);
}

/**
 * 주어진 KST Date 기준 N 영업일 이전 Date 반환 (Phase 1 = 주말 skip 단독).
 * 토요일 / 일요일 = 영업일 영역 0.
 */
export function getBusinessDayBefore(date: Date, days: number = 1): Date {
  const result = new Date(date.getTime());
  let remaining = days;
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() - 1);
    // KST 기준 요일 계산 (UTC + 9시간).
    const kstDate = new Date(result.getTime() + KST_OFFSET_MS);
    const day = kstDate.getUTCDay(); // 0 = 일 / 6 = 토
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }
  return result;
}

/**
 * KST Date → "2026년 5월 19일 (월) 오후 8시" 형식 표기.
 * 입금 마감 카피 paradigm 정수 (요일 광역 표기 + 사용자 인지 ↑).
 */
export function formatBusinessDayKorean(date: Date): string {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  const y = kstDate.getUTCFullYear();
  const m = kstDate.getUTCMonth() + 1;
  const d = kstDate.getUTCDate();
  const day = KOR_DAY_LABELS[kstDate.getUTCDay()];
  return `${y}년 ${m}월 ${d}일 (${day}) 오후 8시`;
}

/**
 * 매각기일 (YYYY-MM-DD) → 입금 마감 카피.
 * 매각기일 -1 영업일 오후 8시 paradigm.
 *
 * 빈 string 또는 invalid date 시점 = "매각기일 확인 필요" 단독 fallback.
 */
export function formatPaymentDeadline(bidDateIso: string): string {
  if (!bidDateIso || !/^\d{4}-\d{2}-\d{2}$/.test(bidDateIso)) {
    return "매각기일 확인 필요";
  }
  const bidDate = parseBidDateKst(bidDateIso);
  if (Number.isNaN(bidDate.getTime())) {
    return "매각기일 확인 필요";
  }
  const deadline = getBusinessDayBefore(bidDate, 1);
  return formatBusinessDayKorean(deadline);
}
