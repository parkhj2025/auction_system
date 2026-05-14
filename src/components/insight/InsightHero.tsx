import {
  INSIGHT_HERO_COPY,
  categoryLabel,
  formatDate,
  type InsightMockPost,
} from "@/lib/insightMock";
import { Thumbnail } from "@/components/insight/Thumbnail";
import { ArrowRightIcon } from "@/components/insight/icons";

/* work-012 정정 3 — /insight Hero 고정 paradigm.
 * 자동 슬라이드 banner 폐기 (자동 전환 타이머 / 인디케이터 / 슬라이드 카피 3건 폐기).
 * 고정: 간단 설명 1줄 (Insight h2 SoT v42.4) + Editor's Pick 대표 article 큰 카드 + CTA.
 * Liquid Glass paradigm 보존 (단일 light variant) / max-w-7xl / 가운데 정렬. */

const GLASS_LIGHT = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.20))",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.7), 0 32px 80px -16px rgba(0,0,0,0.18)",
};

export function InsightHero({
  editorsPick,
  onCardClick,
}: {
  editorsPick: InsightMockPost;
  onCardClick: () => void;
}) {
  return (
    <section
      className="bg-[var(--color-surface-muted)]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 28% 16%, rgba(0,200,83,0.10), transparent 62%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:py-14">
        <div
          style={GLASS_LIGHT}
          className="flex flex-col items-center gap-8 rounded-[28px] px-6 py-10 text-center lg:gap-10 lg:px-12 lg:py-14"
        >
          <h1 className="max-w-2xl text-[28px] font-extrabold leading-[1.25] tracking-[-0.015em] text-[#111418] [text-wrap:balance] lg:text-[44px]">
            {INSIGHT_HERO_COPY}
          </h1>

          {/* Editor's Pick 대표 article 큰 카드 (featured:true 단독). */}
          <button
            type="button"
            onClick={onCardClick}
            className="group w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--brand-green)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2 lg:p-5"
          >
            <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-7">
              <Thumbnail category={editorsPick.category} large />
              <div className="flex flex-col gap-2.5 text-left">
                <span className="text-[12px] font-bold text-[var(--brand-green)] lg:text-[13px]">
                  {categoryLabel(editorsPick.category)}
                </span>
                <h2 className="text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[26px]">
                  {editorsPick.title}
                </h2>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink-500)] lg:text-[16px]">
                  {editorsPick.preview}
                </p>
                <span className="text-[12px] font-medium text-[var(--color-ink-500)] lg:text-[13px]">
                  {formatDate(editorsPick.publishedAt)}
                </span>
                <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--brand-green)] px-5 py-2.5 text-[14px] font-bold text-white transition-colors lg:text-[15px]">
                  지금 보러 가기
                  <ArrowRightIcon
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
