import type { LucideIcon } from "lucide-react";

/* Phase 1.2 (A-1-2) v13 — FeatureCard (모노톤 + green 단독 / yellow / blob / 색감 그림자 영구 폐기).
 * 정정:
 * - 배경 = white 단독 (radial-gradient blob 영구 폐기)
 * - 그림자 = shadow-lg gray 무채색 (rgba green/yellow tint 영구 폐기)
 * - border = 0 (border-left 영구 폐기 / 카드 border 0)
 * - 아이콘 + 큰 숫자 = green primary 단독 (모든 카드 동일)
 * - yellow 적용 영역 0 (Features 광역 폐기) */

export type FeatureCardProps = {
  Icon: LucideIcon;
  value: string;
  title: string;
  desc: string;
};

export function FeatureCard({ Icon, value, title, desc }: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-lg lg:p-12">
      <Icon
        size={56}
        strokeWidth={2}
        className="text-[var(--brand-green)]"
      />
      <div className="space-y-2">
        <div
          className="text-[56px] font-extrabold leading-none tracking-[-0.015em] text-[var(--brand-green)] lg:text-[64px]"
          style={{ fontWeight: 800 }}
        >
          {value}
        </div>
        <div className="text-[18px] font-bold text-[var(--text-primary)] lg:text-[22px]">
          {title}
        </div>
      </div>
      <div className="text-[14px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:text-[16px]">
        {desc}
      </div>
    </div>
  );
}
