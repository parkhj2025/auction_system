import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 원화 금액 → "2억 300만원" 형식 */
export function formatKoreanWon(won: number): string {
  if (won == null || Number.isNaN(won)) return "-";
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (parts.length === 0) return `${won.toLocaleString("ko-KR")}원`;
  return `${parts.join(" ")}원`;
}

/** 원 단위 정확 표기: "99,470,000원" */
export function formatWonExact(won: number): string {
  if (won == null || Number.isNaN(won)) return "-";
  return `${won.toLocaleString("ko-KR")}원`;
}

/**
 * 입찰가 만원 단위 절삭 utility (cycle 1-D-A-4-3 보강 1).
 * 천원 이하 단위 = 0 자동 강제 paradigm.
 * @param value 입력 숫자
 * @returns 만원 단위 단독 숫자 (천원 이하 = 0)
 */
export function truncateBidAmount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value / 10000) * 10000;
}

/**
 * "2026-04-13" 또는 "2026-04-13T13:50:32.306Z" 광역 → "2026.04.13" 회수 paradigm.
 * cycle 1-E-B-β — ISO raw 광역 광역 광역 paradigm (created_at 광역 timestamptz raw 광역 호출처 광역 일관 정합).
 */
export function formatKoreanDate(iso: string): string {
  if (!iso) return "";
  const datePart = iso.slice(0, 10);
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

/** 입찰일+시간 포맷: ("2026-04-27", "1000") → "2026-04-27 10:00" */
export function formatBidDateTime(
  date: string | null | undefined,
  time: string | null | undefined
): string {
  if (!date) return "";
  let formattedTime = "";
  if (time && time.length >= 4) {
    formattedTime = ` ${time.slice(0, 2)}:${time.slice(2, 4)}`;
  }
  return `${date}${formattedTime}`;
}
