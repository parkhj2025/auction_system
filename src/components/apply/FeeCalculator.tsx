import { Wallet, ShieldCheck, Info } from "lucide-react";
import { computeFee, computeDeposit } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import type { AnalysisFrontmatter } from "@/types/content";

/**
 * 신청 시점 기준 수수료 + 보증금 안내 카드.
 * Step 2, Step 4, Step 5에서 재사용.
 */
export function FeeCalculator({
  fm,
  bidAmount,
}: {
  fm: AnalysisFrontmatter | null;
  bidAmount?: number;
}) {
  // 매칭된 물건이 없으면 얼리버드 가격을 기본 안내로 표시 (대리 입찰 신청 가이드 용도)
  const fee = fm
    ? computeFee(fm.bidDate)
    : {
        tier: "earlybird" as const,
        tierLabel: "얼리버드",
        baseFee: 50000,
        successBonus: 50000,
        daysUntilBid: 7,
        description: "입찰일 7일 이상 전 신청",
      };

  const deposit = fm ? computeDeposit(fm.appraisal) : null;
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
            {fm && !isPastBid && (
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
