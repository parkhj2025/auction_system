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

/** "2026-04-13" → "2026.04.13" */
export function formatKoreanDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}
