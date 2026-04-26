import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

/**
 * 7섹션 공통 헤더.
 * Phase 7 prototype 단계 3-1 baseline:
 *  - 섹션 번호(01~07) 라벨 + 제목
 *  - 사실 라벨 Badge (선택)
 *  - 섹션별 accent 컬러는 props로 분기
 *
 * 분류 어휘 금지(원칙 5): "위험·매력·교훈·함정" 등 사용 금지.
 *  - 사실 어휘만 사용 (예: "권리관계", "매각 통계", "체크포인트").
 */
export function SectionHeader({
  num,
  title,
  badge,
  badgeTone = "info",
  intro,
}: {
  num: string;
  title: string;
  badge?: string;
  badgeTone?: "info" | "neutral" | "warning" | "success" | "danger";
  intro?: ReactNode;
}) {
  const toneMap: Record<string, string> = {
    info: "border-[var(--color-info)] bg-[var(--color-info-soft)] text-[var(--color-info)]",
    neutral:
      "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]",
    warning:
      "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    success:
      "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
    danger:
      "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  };

  return (
    <header
      id={`section-${num}`}
      className="mt-20 scroll-mt-24 border-t border-[var(--color-border)] pt-10 first:mt-0 first:border-t-0 first:pt-0"
    >
      <div className="flex items-baseline gap-4">
        <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-600">
          {num}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {badge ? (
        <div className="mt-3">
          <Badge
            variant="outline"
            className={`${toneMap[badgeTone]} text-xs font-bold tracking-tight`}
          >
            {badge}
          </Badge>
        </div>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-500)]">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
