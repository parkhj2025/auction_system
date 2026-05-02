import {
  Footprints,
  Smartphone,
  FileText,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldCheck,
} from "lucide-react";

/* Phase 1.2 (A-1-2) v2 — Why · 비교표 폐기 + Before/After 인포그래픽 + 효용 카드 lucide 48px.
 * 변경:
 *  - eyebrow 보존 ("경매퀵의 차별점")
 *  - h1 "법원에 가지 않아도, 입찰은 정확하게" → "법원 갈 시간을 줄입니다" (압축)
 *  - subtext 폐기 (h1으로 충분)
 *  - 비교표 3 row 폐기 → Before/After 인포그래픽 (mobile vertical / desktop horizontal)
 *  - 절차 3 step 폐기 (Before/After 본질 흡수)
 *  - 효용 카드 3건 보존 + 시각 본질 강화 (lucide 48px) */

const BEFORE_ITEMS = [
  { icon: Footprints, label: "법원 방문" },
  { icon: FileText, label: "서류 준비" },
  { icon: Clock, label: "반차 사용" },
] as const;

const AFTER_ITEMS = [
  { icon: Smartphone, label: "온라인 신청" },
  { icon: CheckCircle2, label: "결과 통보" },
  { icon: Clock, label: "0분" },
] as const;

const VALUE_CARDS = [
  {
    icon: Clock,
    label: "시간 효용",
    head: "오전 반차 1회",
    sub: "= 약 5만원 (월급 기준)",
  },
  {
    icon: Wallet,
    label: "비용 효용",
    head: "법무사 풀서비스 200만원",
    sub: "vs 경매퀵 5만원",
  },
  {
    icon: ShieldCheck,
    label: "안전 효용",
    head: "보증보험 + 전용계좌",
    sub: "= 사고율 0%",
  },
] as const;

export function WhyBlock() {
  return (
    <section
      aria-labelledby="why-heading"
      className="bg-[var(--bg-secondary)] border-b border-[var(--border-1)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">경매퀵의 차별점</p>
          <h2
            id="why-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            법원 갈 시간을 줄입니다
          </h2>
        </div>

        {/* Before / After 인포그래픽 — mobile vertical stack / desktop horizontal 2col. */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
          <BeforeAfterCard
            label="직접 입찰"
            tone="muted"
            items={BEFORE_ITEMS}
          />
          <BeforeAfterCard
            label="경매퀵"
            tone="primary"
            items={AFTER_ITEMS}
          />
        </div>

        {/* 효용 카드 3건 — lucide 48px. */}
        <div className="mt-12">
          <p className="section-eyebrow">효용</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3 lg:gap-6">
            {VALUE_CARDS.map(({ icon: Icon, label, head, sub }) => (
              <li
                key={label}
                className="flex flex-col rounded-2xl border border-[var(--border-1)] bg-[var(--bg-primary)] p-6 transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-sm lg:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                  <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-meta mt-5 font-[510] uppercase tracking-wider text-[var(--text-tertiary)]">
                  {label}
                </span>
                <p className="text-h3 mt-2 text-[var(--text-primary)]">
                  {head}
                </p>
                <p className="text-body-sm mt-1 text-[var(--text-secondary)]">
                  {sub}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterCard({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "muted" | "primary";
  items: ReadonlyArray<{ icon: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>; label: string }>;
}) {
  const isPrimary = tone === "primary";
  return (
    <article
      className={
        "rounded-2xl p-6 lg:p-8 " +
        (isPrimary
          ? "bg-[var(--button-bg)] text-white"
          : "border border-[var(--border-1)] bg-[var(--bg-primary)]")
      }
    >
      <p
        className={
          "text-meta font-[510] uppercase tracking-wider " +
          (isPrimary ? "text-white/70" : "text-[var(--text-tertiary)]")
        }
      >
        {label}
      </p>
      <ul className="mt-6 flex flex-col gap-5">
        {items.map(({ icon: Icon, label: itemLabel }) => (
          <li key={itemLabel} className="flex items-center gap-4">
            <span
              className={
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " +
                (isPrimary ? "bg-white/10" : "bg-[var(--bg-secondary)]")
              }
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                aria-hidden={true}
              />
            </span>
            <span className="text-body-lg">{itemLabel}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
