import Link from "next/link";
import { COMPANY } from "@/lib/constants";
import { Logo } from "@/components/Logo";

/* Phase 1.2 (A-1-2) v50 cycle 10 — Footer 광역 재구성.
 * 정정 (Cycle 10):
 * 1. 좌측 회사 정보 1줄 only ("대표 박형준 · 공인중개사 · 매수신청대리인." 광역 폐기)
 * 2. 카테고리 4건 → 3건 (회사 first / 서비스 / 인사이트) + 법적 fine line paradigm 정합
 * 3. SNS 4 inline SVG + SNS_LINKS + SNS rendering 광역 폐기
 * 4. "서울보증보험 가입" 광역 폐기
 * 5. Copyright + 약관 fine line (좌 © + 우 이용약관 · 개인정보처리방침)
 * 6. 인사이트 4 카테고리 광역 (analysis / guide / glossary / data)
 * 7. 어휘 정정: 콘텐츠 → 인사이트 / 대표 소개 → 회사 소개 / FAQ → 자주 묻는 질문 / 시장 인사이트 → 경매 빅데이터
 * 8. /partners 신규 link (Stage 2 placeholder 영역) */

const BUSINESS_REGISTERED =
  process.env.NEXT_PUBLIC_BUSINESS_REGISTERED === "true";

const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "회사",
    links: [
      { href: "/about", label: "회사 소개" },
      { href: "/notice", label: "공지사항" },
      { href: "/partners", label: "파트너 문의" },
    ],
  },
  {
    title: "서비스",
    links: [
      { href: "/apply", label: "입찰 대리 신청" },
      { href: "/#pricing", label: "수수료" },
      { href: "/faq", label: "자주 묻는 질문" },
    ],
  },
  {
    title: "인사이트",
    links: [
      { href: "/insight?cat=analysis", label: "무료 물건분석" },
      { href: "/insight?cat=guide", label: "경매 가이드" },
      { href: "/insight?cat=glossary", label: "경매 용어" },
      { href: "/insight?cat=data", label: "경매 빅데이터" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-1)] bg-[var(--bg-secondary)]">
      <div className="container-app px-5 py-14 lg:px-8 lg:py-20">
        {/* Brand + tagline + 3 column. */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-[14px] leading-[1.7] text-[var(--text-secondary)] lg:text-[15px]">
              빠르고 안전한 부동산 경매 입찰 대리 서비스.
            </p>
          </div>

          {/* 3 column (회사 first / 서비스 / 인사이트). */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:gap-10">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)] lg:text-[15px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* 사업자 conditional. */}
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
                {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS} · 매수신청대리인 등록
                · 공인중개사
              </p>
            )}
          </div>
        )}

        {/* Copyright 좌측 + 약관 fine line 우측. */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--divider)] pt-6 text-[13px] text-[var(--text-tertiary)] md:flex-row md:gap-0 lg:mt-12 lg:text-[14px]">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <Link
              href="/terms"
              className="transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              이용약관
            </Link>
            <span className="text-[var(--text-quaternary)]">·</span>
            <Link
              href="/privacy"
              className="transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
