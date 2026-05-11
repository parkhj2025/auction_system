import type { Metadata } from "next";
import { ShieldCheck, Building2, ArrowRight } from "lucide-react";
import {
  COMPANY,
  COURTS_ACTIVE,
  COURTS_COMING_SOON,
  DIFFERENTIATORS,
  COMPARISON_CARDS,
} from "@/lib/constants";
import { PageHero } from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: `${COMPANY.name} 대표 ${COMPANY.ceo}. 공인중개사 자격 보유, 서울보증보험 가입. 경매 입찰 대리라는 단일 업무에 집중해 합리적인 가격으로 서비스를 제공합니다.`,
};

/* cycle 1-G-β-β — /about 광역 재산출 paradigm:
 * - 5 섹션 단순화 (PageHero + 비교 + 차별화 3축 + Founder + Regions)
 * - Bottom CTA 영구 폐기 (TopNav "신청하기" 광역 중복 paradigm 회수)
 * - pastel bg 영구 폐기 (bg-white + bg surface-muted 광역 단독)
 * - /apply 카드 paradigm 일치 (bg-white + border border-gray-200 + rounded-2xl + p-6 sm:p-8)
 * - brand-green 단독 강조 paradigm (큰 숫자 + 우 카드 광역)
 * - 영구 룰 §13 일치 (바토너 직접 비용 비교 영역 0). */

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — PageHero 광역 (사업 차별화 정수 / 공인중개사 직접 입찰 paradigm). */}
      <PageHero
        eyebrow="서비스 소개"
        title={
          <>
            <span className="text-[var(--brand-green)]">공인중개사</span>가 직접 갑니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="5만원부터, 보증금 전용계좌 분리, D-1 할증 없이."
      />

      {/* 비교 섹션 — 일반 입찰 vs 우리 대리 paradigm (단계 + 시간 + 결과 / 비용 row 영구 폐기). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            어떻게 다른가요
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            법원 가는 길이 <span className="text-[var(--brand-green)]">사라집니다</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {COMPARISON_CARDS.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
              >
                <span className="inline-flex items-center rounded-full bg-[var(--color-ink-50)] px-3 py-1 text-xs font-bold text-[var(--color-ink-700)]">
                  {card.meta}
                </span>

                {/* 모바일 vertical stack (좌 위 + 화살표 + 우 아래) + 데스크탑 동일 paradigm. */}
                <div className="mt-5 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                      일반
                    </p>
                    <p className="mt-1 text-[40px] font-black leading-none tabular-nums text-[var(--color-ink-500)] sm:text-[64px]">
                      {card.leftValue}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                      {card.leftSubtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--color-ink-300)]">
                    <ArrowRight size={20} aria-hidden="true" />
                    <span className="h-px flex-1 bg-[var(--color-ink-200)]" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
                      경매퀵
                    </p>
                    <p className="mt-1 text-[40px] font-black leading-none tabular-nums text-[var(--brand-green)] sm:text-[64px]">
                      {card.rightValue}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
                      {card.rightSubtitle}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 차별화 3축 — 가격 + 안전 + 직접 paradigm (5축 → 3축 단순화 / pastel bg 영구 폐기). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            왜 경매퀵인가요
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            <span className="text-[var(--brand-green)]">세 가지</span>로 정리합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {DIFFERENTIATORS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
              >
                <p className="text-[40px] font-black leading-none tabular-nums text-[var(--brand-green)] sm:text-[64px]">
                  {item.bigNumber}
                </p>
                <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--color-ink-900)] sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-ink-700)] sm:text-base">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Founder profile — 시각 토큰 강화 영구 보존 (cycle 1-G-β 재시작 산출). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-col gap-8 rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)] sm:flex-row sm:p-12">
            <div className="flex shrink-0 flex-col items-center gap-2 sm:w-52">
              <div
                aria-hidden="true"
                className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-ink-900)] to-[var(--color-ink-700)] text-h1 font-black text-white"
              >
                {COMPANY.ceo.slice(0, 1)}
              </div>
              <p className="text-xs font-bold text-[var(--color-ink-500)]">
                대표 · 공인중개사
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
                {COMPANY.ceo}
              </h2>
              <ul className="mt-6 flex flex-col gap-3.5 text-base leading-7 text-[var(--color-ink-700)]">
                <li className="flex gap-2.5">
                  <ShieldCheck
                    size={18}
                    className="mt-1 shrink-0 text-[var(--color-ink-900)]"
                    aria-hidden="true"
                  />
                  공인중개사 자격 보유 (매수신청대리인 등록)
                </li>
                <li className="flex gap-2.5">
                  <ShieldCheck
                    size={18}
                    className="mt-1 shrink-0 text-[var(--color-ink-900)]"
                    aria-hidden="true"
                  />
                  서울보증보험 가입 — 사고 발생 시 고객 자산 보호
                </li>
                <li className="flex gap-2.5">
                  <Building2
                    size={18}
                    className="mt-1 shrink-0 text-[var(--color-ink-900)]"
                    aria-hidden="true"
                  />
                  {COMPANY.court} 관할 경매 물건 대리 입찰 수행
                </li>
              </ul>
              <p className="mt-7 text-base leading-7 text-[var(--color-ink-500)]">
                경매 입찰 대리라는 단일 업무에 집중합니다. 권리분석·투자자문 같은
                전문가 영역까지 확장하지 않는 이유는 범위를 좁혔을 때 가격을 낮출
                수 있고, 품질을 유지할 수 있기 때문입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions — 시각 토큰 강화 영구 보존 + 페이지 마무리 paradigm (Bottom CTA 영구 폐기 사후). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            서비스 지역
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            현재 인천에서 시작하고 있습니다
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--color-ink-500)]">
            서비스 지역은 계속 확대됩니다. 신규 지역 오픈 소식은 공지사항을
            통해 안내드립니다.
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {COURTS_ACTIVE.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-ink-900)] px-6 text-base font-bold text-white">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[var(--brand-green)]"
                  />
                  {c.label}
                  <span className="text-xs font-semibold text-white/85">
                    서비스 중
                  </span>
                </span>
              </li>
            ))}
            {COURTS_COMING_SOON.map((c) => (
              <li key={c.value}>
                <span className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 text-base font-semibold text-[var(--color-ink-700)]">
                  {c.label}
                  <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-ink-100)] px-2.5 text-[11px] font-bold text-[var(--color-ink-900)]">
                    오픈 예정
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
