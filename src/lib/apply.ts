import { FEES } from "./constants";
import type { FeeComputation, FeeTier } from "@/types/apply";

/** YYYY-MM-DD → Date (KST 가정) */
function parseDate(iso: string): Date {
  return new Date(`${iso}T00:00:00+09:00`);
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 두 날짜 사이 일수 차이. to - from. */
function daysBetween(fromIso: string, toIso: string): number {
  const from = parseDate(fromIso);
  const to = parseDate(toIso);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 신청 시점(오늘) vs 입찰일 기준 수수료 구간 계산.
 * - 입찰 7일 이상 전: 얼리버드 5만원
 * - 입찰 2~7일 전: 일반 7만원
 * - 입찰 2일 이내: 급건 10만원
 * - 과거(이미 지난 입찰): 급건으로 표시 (클라이언트에서 경고)
 */
export function computeFee(bidDateIso: string): FeeComputation {
  const days = daysBetween(todayIso(), bidDateIso);

  let tier: FeeTier;
  if (days >= 7) tier = "earlybird";
  else if (days >= 2) tier = "standard";
  else tier = "rush";

  const tierMeta: Record<FeeTier, { label: string; description: string }> = {
    earlybird: {
      label: "사전 신청가",
      description: "입찰일 7일 이상 전 신청",
    },
    standard: {
      label: "일반",
      description: "입찰일 2~7일 전 신청",
    },
    rush: {
      label: "급건",
      description: "입찰일 2일 이내 신청",
    },
  };

  return {
    tier,
    tierLabel: tierMeta[tier].label,
    baseFee: FEES[tier],
    successBonus: FEES.successBonus,
    daysUntilBid: days,
    description: tierMeta[tier].description,
  };
}

/**
 * 보증금 금액 = 감정가의 10% (재경매 대금미납 이력 시 20%).
 * Phase 1은 재경매 플래그를 받지 않으므로 기본 10%로 안내하고,
 * 재경매 여부는 Step 5 안내문에서 별도 언급한다.
 */
export function computeDeposit(appraisal: number, rebid = false): number {
  return Math.round(appraisal * (rebid ? 0.2 : 0.1));
}

/** 접수번호 생성 (클라이언트 미리보기용). 서버가 최종 id 발급. */
export function generateApplicationId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `GQ-${y}${m}${day}-${rand}`;
}

/** 전화번호 자동 포맷: 01012345678 → 010-1234-5678 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 파일 크기 제한 (10MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function isAcceptableFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) return false;
  const ok = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  return ok.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
