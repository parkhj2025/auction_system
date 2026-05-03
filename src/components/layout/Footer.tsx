import Link from "next/link";
import { FOOTER_SECTIONS } from "@/lib/navigation";
import { COMPANY, COMPLIANCE_ITEMS } from "@/lib/constants";
import { Brand } from "@/components/Brand";

/* Phase 1.2 (A-1-2) v5 — Footer (형준님 #9 광역 적용).
 * Brand sm + 사업자 정보 conditional (NEXT_PUBLIC_BUSINESS_REGISTERED 분기) +
 * 메뉴 4 link + padding 24 mobile/64 desktop + 좌측 정렬 + Phase 0 토큰 폐기.
 * 지역 명기 X (확장 paradigm 정합 / 시안 정합). */

const BUSINESS_REGISTERED =
  process.env.NEXT_PUBLIC_BUSINESS_REGISTERED === "true";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-1)] bg-[var(--bg-secondary)]">
      <div className="container-app px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Brand size="sm" mode="light" />
            <p className="mt-5 text-[13px] leading-[1.7] text-[var(--text-secondary)]">
              빠르고 안전한 부동산 경매 입찰 대리 서비스.
              <br />
              대표 {COMPANY.ceo} · 공인중개사 · 매수신청대리인.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="text-[13px] font-bold tracking-[-0.005em] text-[var(--text-primary)]">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* 사업자 정보 conditional (NEXT_PUBLIC_BUSINESS_REGISTERED=true 시 표시). */}
        {BUSINESS_REGISTERED && (
          <div className="mt-10 border-t border-[var(--divider)] pt-6 text-[12px] leading-[1.7] text-[var(--text-tertiary)]">
            <p>
              {process.env.NEXT_PUBLIC_BUSINESS_NAME ?? COMPANY.name} · 대표{" "}
              {process.env.NEXT_PUBLIC_BUSINESS_CEO ?? COMPANY.ceo}
              {process.env.NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER &&
                ` · 사업자등록번호 ${process.env.NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER}`}
            </p>
            {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS && (
              <p className="mt-1">
                {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS} · 매수신청대리인 등록 · 공인중개사
              </p>
            )}
          </div>
        )}

        <div className="mt-10 border-t border-[var(--divider)] pt-8">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            안내 및 면책
          </h4>
          <ol className="mt-4 flex flex-col gap-2.5 text-[12px] leading-[1.6] text-[var(--text-tertiary)]">
            {COMPLIANCE_ITEMS.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-bold text-[var(--text-secondary)]">
                  {i + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[12px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p>서울보증보험 가입 · 전자본인서명확인서 비대면 처리</p>
        </div>
      </div>
    </footer>
  );
}
