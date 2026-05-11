import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Building2 } from "lucide-react";
import {
  COMPANY,
  COURTS_ACTIVE,
  COURTS_COMING_SOON,
  DIFFERENTIATORS,
  type DifferentiatorTone,
} from "@/lib/constants";
import { PageHero } from "@/components/common/PageHero";

export const metadata: Metadata = {
  title: "서비스",
  description: `${COMPANY.name} 대표 ${COMPANY.ceo}. 공인중개사 자격 보유, 서울보증보험 가입. 경매 입찰 대리라는 단일 업무에 집중해 합리적인 가격으로 서비스를 제공합니다.`,
};

/* cycle 1-G-β 재시작 — /about 광역 paradigm:
 * - PageHero (영구 보존) + 차별화 5축 신규 + Founder (시각 토큰 강화) + Regions (강화) + Bottom CTA (강화).
 * - Hero 일러스트 + What 섹션 = cycle 1-G-β (af247c8) 산출 영구 회수.
 * - "큼직 + 루즈" paradigm = max-w-5xl 광역 + py-20 sm:py-28 + text-base leading-7 + 카드 rounded-2xl + p-6 sm:p-8.
 * - 앱 스타일 paradigm = colored pastel bg + 큰 숫자 강조 + lucide 아이콘 단독 (일러스트 0). */

const TONE_BG: Record<DifferentiatorTone, string> = {
  green: "bg-[var(--brand-green-soft)]",
  yellow: "bg-[var(--accent-yellow-soft)]",
  ink: "bg-[var(--color-ink-50)]",
};

const TONE_ACCENT: Record<DifferentiatorTone, string> = {
  green: "text-[var(--brand-green)]",
  yellow: "text-[var(--accent-yellow)]",
  ink: "text-[var(--color-ink-900)]",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — PageHero 광역 (사업 차별화 정수 / 공인중개사 직접 입찰 paradigm). */}
      <PageHero
        eyebrow="서비스"
        title={
          <>
            <span className="text-[var(--brand-green)]">공인중개사</span>가 직접 갑니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="5만원부터, 보증금 전용계좌 분리, D-1 할증 없이."
      />

      {/* 차별화 5축 — 가격·보증금·D-1·공인중개사·카카오톡 광역 (Values 변형 paradigm). */}
      <section className="border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)]">
            왜 경매퀵인가요
          </p>
          <h2 className="mt-3 text-h2 font-black leading-tight tracking-tight text-[var(--color-ink-900)] sm:text-display">
            <span className="text-[var(--brand-green)]">다섯 가지</span>로 정리합니다
            <span style={{ color: "#FFD43B" }}>.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {DIFFERENTIATORS.map((item) => (
              <article
                key={item.id}
                className={`rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-8 ${TONE_BG[item.tone]}`}
              >
                <p
                  className={`text-[40px] font-black leading-none tabular-nums sm:text-[56px] ${TONE_ACCENT[item.tone]}`}
                >
                  {item.bigNumber}
                </p>
                <h3 className="mt-4 text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-ink-700)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Founder profile — 시각 토큰 강화 (max-w-5xl + py-20 sm:py-28 + 큼직·루즈 paradigm). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
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

      {/* Regions — 시각 토큰 강화 (max-w-5xl + py-20 sm:py-28 + pill h-12). */}
      <section className="border-t border-[var(--color-border)] bg-white">
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

      {/* Bottom CTA — 시각 토큰 강화 (max-w-5xl + py-20 sm:py-28 + h2 큼직 + button min-h-14). */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-ink-950)] text-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-5 py-20 sm:px-8 sm:py-28 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-h2 font-black leading-tight tracking-tight sm:text-display">
              준비된 대리인에게 맡기세요
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85">
              패찰 시 보증금은 당일 즉시 반환됩니다. 결과와 무관하게 투명합니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white px-6 text-base font-black text-[var(--color-ink-900)] shadow-[var(--shadow-lift)] hover:bg-[var(--color-ink-50)]"
            >
              입찰 대리 신청
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-14 items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-6 text-base font-bold text-white hover:bg-white/20"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
