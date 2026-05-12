import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  BRAND_NAME,
  COURTS_ACTIVE,
  COURTS_COMING_SOON,
  ABOUT_VALUES,
  ABOUT_PROOFS,
} from "@/lib/constants";
import { PageHero } from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: `${BRAND_NAME}은 투자자의 시간적·물리적 병목을 해소하는 입찰 대리 서비스입니다. 공인중개사가 직접 법원에 출석해 입찰을 수행합니다.`,
};

/* cycle 1-G-β-γ — /about 제로베이스 재설계 paradigm (사업 핵심 가치 v62):
 * - PageHero (subtitle 정정 / 가격 메인 NG → 투자자 시간 정수 paradigm)
 * - 가치 제안 3축 Bento Grid (Apple-style asymmetric / 신속 hero col-span-2 row-span-2)
 * - 신뢰 근거 proof 3 카드 (텍스트 단독 / 박형준 개인 색 영구 폐기)
 * - 회사 정보 (1인칭 + 차분 + 짧은 카피)
 * - 인천 사무실 mockup (오픈 사전 임시)
 * - Regions timeline (영구 보존 + 시각 강화)
 * - Bottom CTA 영구 폐기 (TopNav 중복) */

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — PageHero 광역 (subtitle 정정 / 가격 메인 NG paradigm 정합). */}
      <PageHero
        eyebrow="서비스 소개"
        title={
          <>
            <span className="text-[var(--brand-green)]">공인중개사</span>가 직접 갑니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="투자자의 시간을, 다시 투자에 돌립니다."
      />

      {/* 가치 제안 3축 — Bento Grid Apple-style (asymmetric / 신속 hero col-span-2 row-span-2). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            Why us
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            세 가지로, <span className="text-[var(--brand-green)]">새롭게</span> 갑니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-[minmax(220px,auto)]">
            {ABOUT_VALUES.map((item) => {
              const isHero = item.span === "hero";
              return (
                <article
                  key={item.id}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8",
                    isHero && "md:col-span-2 md:row-span-2"
                  )}
                >
                  <p
                    className={cn(
                      "font-black leading-none tabular-nums text-[var(--brand-green)]",
                      isHero
                        ? "text-[64px] sm:text-[120px]"
                        : "text-[40px] sm:text-[64px]"
                    )}
                  >
                    {item.bigCopy}
                  </p>
                  <p
                    className={cn(
                      "mt-6 leading-7 text-[var(--color-ink-700)]",
                      isHero ? "text-base sm:text-lg" : "text-sm sm:text-base"
                    )}
                  >
                    {item.subCopy}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 신뢰 근거 — proof 3 카드 (텍스트 단독 / 박형준 개인 색 영구 폐기 / 영구 룰 §39 정합). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            Credentials
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            법원이 인정한 자격으로, 직접 입찰합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {ABOUT_PROOFS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8"
              >
                <p className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-[28px]">
                  {item.line1}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
                  {item.line2}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 회사 정보 — 1인칭 + 차분 + 짧은 카피 (asymmetric 좌 카피 + 우 빈 공간). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            About {BRAND_NAME}
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            경매를 <span className="text-[var(--brand-green)]">다시</span> 정의합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-5">
            <div className="md:col-span-3">
              <p className="text-base leading-8 text-[var(--color-ink-700)] sm:text-lg sm:leading-9">
                경매는 시간과 거리가 모두 부담이었습니다.
              </p>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-700)] sm:text-lg sm:leading-9">
                법원까지의 거리, 입찰 당일의 휴가, 결과를 기다리는 시간.
              </p>
              <p className="mt-5 text-base leading-8 text-[var(--color-ink-700)] sm:text-lg sm:leading-9">
                우리는 그 모든 거품을 걷어내고, 투자자가 경매 자체에 집중할 수
                있도록 돕습니다.
              </p>
            </div>
            <div
              aria-hidden="true"
              className="hidden md:col-span-2 md:flex md:items-center md:justify-center"
            >
              <div className="h-32 w-32 rounded-full bg-[var(--color-ink-50)] sm:h-44 sm:w-44">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[40px] font-black text-[var(--brand-green)] sm:text-[56px]">
                    ↺
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 인천 사무실 mockup — 오픈 사전 임시 자산 (사진 영역 0). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            Office
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            인천에서, <span className="text-[var(--brand-green)]">시작</span>합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
            <span className="inline-flex items-center rounded-full bg-[var(--color-ink-100)] px-3 py-1 text-xs font-bold text-[var(--color-ink-700)]">
              2026년 상반기 오픈 예정
            </span>
            <p className="mt-5 text-base leading-7 text-[var(--color-ink-700)] sm:text-lg sm:leading-8">
              인천지방법원 인근에 사무소를 준비하고 있습니다.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
              정확한 주소와 영업 시간은 오픈 시점에 안내드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Regions timeline — 미래 계획 (인천 활성 + 4 지역 오픈 예정 / 페이지 마무리 paradigm). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
            Regions
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            전국으로, <span className="text-[var(--brand-green)]">차근차근</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

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
                    운영 중
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
