import { Wallet, ShieldCheck, Info } from "lucide-react";
import { computeFee, computeDeposit } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";

/**
 * 신청 시점 기준 수수료 + 보증금 안내 카드.
 * cycle 1-D-A-4: matchedPost props 광역 폐기 → bidDate + appraisal 직접 props.
 *
 * - 기본 (FeeCalculator): 수수료 + 성공보수 + 보증금 (감정가 입력 시).
 * - Inline (FeeCalculatorInline): Step2 본 박스 마지막 inner box 광역.
 * - Hero (FeeCalculatorHero): 본 박스 정합 독립 박스 (cycle 1-D-A-2 영역 / 현 mount 0).
 */

const DEFAULT_FEE = {
  tier: "earlybird" as const,
  tierLabel: "사전 신청가",
  baseFee: 50000,
  successBonus: 50000,
  daysUntilBid: 7,
  description: "입찰일 7일 이상 전 신청",
};

function resolveFee(bidDate?: string | null) {
  if (bidDate) return computeFee(bidDate);
  return DEFAULT_FEE;
}

export function FeeCalculator({
  bidDate,
  appraisal,
  bidAmount,
}: {
  bidDate?: string | null;
  appraisal?: number | null;
  bidAmount?: number;
}) {
  const fee = resolveFee(bidDate);
  const deposit =
    appraisal != null ? computeDeposit(appraisal) : null;
  const isPastBid = fee.daysUntilBid < 0;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      {/* 수수료 */}
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
          <Wallet size={22} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--color-ink-900)]">
              {fee.tierLabel}
            </p>
            {bidDate && !isPastBid && (
              <span className="text-[11px] text-[var(--color-ink-500)]">
                입찰일까지 {fee.daysUntilBid}일
              </span>
            )}
          </div>
          <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
            {formatKoreanWon(fee.baseFee)}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-500)]">
            {fee.description} · 신청 시점에 확정
          </p>
        </div>
      </div>

      {/* 성공보수 주석 */}
      <div className="mt-5 flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs">
        <Info
          size={14}
          className="mt-0.5 shrink-0 text-[var(--color-ink-500)]"
          aria-hidden="true"
        />
        <p className="leading-5 text-[var(--color-ink-700)]">
          낙찰 성공보수{" "}
          <strong className="text-[var(--color-ink-900)]">
            +{formatKoreanWon(fee.successBonus)}
          </strong>
          은 낙찰된 경우에만 청구됩니다. 패찰 시에는 기본 수수료만 받고{" "}
          <strong className="text-[var(--color-ink-900)]">
            보증금은 당일 즉시 반환
          </strong>
          됩니다.
        </p>
      </div>

      {/* 보증금 */}
      {deposit !== null && (
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">
          <div className="flex items-start gap-2">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-[var(--color-ink-500)]"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-[var(--color-ink-500)]">
                입찰 보증금 (참고)
              </p>
              <p className="mt-1 text-xl font-black tabular-nums text-[var(--color-ink-900)]">
                {formatKoreanWon(deposit)}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                감정가의 10% 기준입니다. 대금미납 이력이 있는 재경매 사건은
                20%로 상향되며, 이 경우 별도 안내드립니다.
              </p>
              {bidAmount && bidAmount > 0 && (
                <p className="mt-2 text-xs text-[var(--color-ink-700)]">
                  입력하신 입찰 희망 금액:{" "}
                  <strong className="tabular-nums text-[var(--color-ink-900)]">
                    {formatKoreanWon(bidAmount)}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline variant — Step2 본 박스 안 마지막 inner box (재경매·공동입찰 paradigm 정합).
 * paradigm: rounded-md + bg-surface-muted + p-4 + 가격 = text-base font-bold (본 입력 흐름 우선).
 * cycle 1-D-A-4: bidDate 직접 props.
 */
export function FeeCalculatorInline({
  bidDate,
}: {
  bidDate?: string | null;
}) {
  const fee = resolveFee(bidDate);
  const isPastBid = fee.daysUntilBid < 0;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
      <div className="flex items-start gap-3">
        <Wallet
          size={18}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--color-ink-700)]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#00C853]">
              {fee.tierLabel}
            </p>
            <p className="text-base font-bold tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(fee.baseFee)}
            </p>
            {bidDate && !isPastBid && (
              <span className="text-xs text-[var(--color-ink-500)]">
                입찰일까지 {fee.daysUntilBid}일
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
            {fee.description} · 신청 시점에 확정. 낙찰 성공보수{" "}
            <strong className="text-[var(--color-ink-900)]">
              +{formatKoreanWon(fee.successBonus)}
            </strong>
            은 낙찰 시에만 청구되며, 패찰 시 보증금은 당일 즉시 반환됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero variant — 본 박스 정합 독립 박스 (cycle 1-D-A-2 영역 / 현 mount 0).
 * paradigm: rounded-2xl border-gray-200 p-5 lg:p-8 flat.
 * cycle 1-D-A-4: bidDate 직접 props.
 */
export function FeeCalculatorHero({
  bidDate,
}: {
  bidDate?: string | null;
}) {
  const fee = resolveFee(bidDate);
  const isPastBid = fee.daysUntilBid < 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-start gap-4 sm:flex-1">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
            <Wallet size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#00C853]">
                {fee.tierLabel}
              </p>
              {bidDate && !isPastBid && (
                <span className="text-[11px] text-[var(--color-ink-500)]">
                  입찰일까지 {fee.daysUntilBid}일
                </span>
              )}
            </div>
            <p className="mt-1 text-h2 font-black tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(fee.baseFee)}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-500)]">
              {fee.description} · 신청 시점에 확정
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs sm:max-w-xs sm:shrink-0">
          <Info
            size={14}
            className="mt-0.5 shrink-0 text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
          <p className="leading-5 text-[var(--color-ink-700)]">
            낙찰 성공보수{" "}
            <strong className="text-[var(--color-ink-900)]">
              +{formatKoreanWon(fee.successBonus)}
            </strong>
            은 낙찰 시에만 청구됩니다. 패찰 시{" "}
            <strong className="text-[var(--color-ink-900)]">
              보증금 당일 즉시 반환
            </strong>
            됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
