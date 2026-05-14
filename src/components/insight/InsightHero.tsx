import {
  categoryLabel,
  formatDate,
  type InsightMockPost,
} from "@/lib/insightMock";
import { Thumbnail } from "@/components/insight/Thumbnail";
import { ArrowRightIcon } from "@/components/insight/icons";

/* work-012 정정 5 — /insight Hero 영역.
 * 정정 4 paradigm 보존 (green primary bg + 좌우 분기 + 우측 카드).
 * 정정 5: Hero 높이 절반 축소 + 좌측 = 칩 2건 + 메인타이틀 + 서브타이틀 + 마침표 yellow.
 * 칩 = §A-24 권한 = Hero eyebrow 칩 단독 예외 (콘텐츠 list + 카드 안 chip 영구 폐기 일관). */

const ACCENT_YELLOW = "#FFD43B";

export function InsightHero({
  editorsPick,
  onCardClick,
}: {
  editorsPick: InsightMockPost;
  onCardClick: () => void;
}) {
  return (
    <section className="bg-[var(--brand-green)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 lg:py-8">
        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* 좌측 = 칩 2건 + 메인타이틀 + 서브타이틀 (white / CTA 0). */}
          <div className="flex max-w-xl flex-col gap-3.5 lg:gap-4">
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-[#111418]"
                style={{ backgroundColor: ACCENT_YELLOW }}
              >
                Editor&apos;s Pick
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-[#111418]"
                style={{ backgroundColor: ACCENT_YELLOW }}
              >
                매주 업데이트
              </span>
            </div>

            <h1 className="text-[28px] font-extrabold leading-[1.25] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[44px]">
              분석 자료까지,{" "}
              <span style={{ color: ACCENT_YELLOW }}>무료로 드립니다.</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-white lg:text-[18px]">
              경매 입찰 전 알아야 할 모든 자료를 한 곳에 모았습니다.
            </p>
          </div>

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
