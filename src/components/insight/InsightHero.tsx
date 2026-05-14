import {
  INSIGHT_HERO_COPY,
  categoryLabel,
  formatDate,
  type InsightMockPost,
} from "@/lib/insightMock";
import { Thumbnail } from "@/components/insight/Thumbnail";
import { ArrowRightIcon } from "@/components/insight/icons";

/* work-012 정정 4 — /insight Hero 영역.
 * Liquid Glass 박스 + 가운데 정렬 폐기 → green primary bg + 좌우 분기 paradigm.
 * bg = green primary 단독 (그라데이션 0) / 데스크탑 grid 2-col / 모바일 flex-col.
 * 좌 = Hero 문구 (white / Insight h2 SoT v42.4) / 우 = Editor's Pick 카드 (외관 보존). */

export function InsightHero({
  editorsPick,
  onCardClick,
}: {
  editorsPick: InsightMockPost;
  onCardClick: () => void;
}) {
  return (
    <section className="bg-[var(--brand-green)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:py-14">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* 좌측 = Hero 문구 (white / CTA 0). */}
          <h1 className="max-w-xl text-[28px] font-extrabold leading-[1.25] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[44px]">
            {INSIGHT_HERO_COPY}
          </h1>

          {/* 우측 = Editor's Pick 대표 article 카드 (featured:true 단독 / 외관 보존). */}
          <button
            type="button"
            onClick={onCardClick}
            className="group w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 text-left shadow-[0_20px_50px_-12px_rgba(0,0,0,0.30)] transition-colors hover:border-[var(--brand-green)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-green)] lg:p-5"
          >
            <div className="flex flex-col gap-4">
              <Thumbnail category={editorsPick.category} large />
              <div className="flex flex-col gap-2.5">
                <span className="text-[12px] font-bold text-[var(--brand-green)] lg:text-[13px]">
                  {categoryLabel(editorsPick.category)}
                </span>
                <h2 className="text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[24px]">
                  {editorsPick.title}
                </h2>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink-500)] lg:text-[15px]">
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
