import Link from "next/link";
import { COMPANY } from "@/lib/constants";
import { Brand } from "@/components/Brand";

/* Phase 1.2 (A-1-2) v6 — Footer (4 column 심플 / Stripe·Linear paradigm).
 * 면책 본문 광역 폐기 (이용약관 페이지 통합 paradigm).
 * 사업자 정보 conditional 보존 (NEXT_PUBLIC_BUSINESS_REGISTERED).
 * 4 column: 서비스 / 콘텐츠 / 회사 / 법적. */

const BUSINESS_REGISTERED =
  process.env.NEXT_PUBLIC_BUSINESS_REGISTERED === "true";

const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "서비스",
    links: [
      { href: "/apply", label: "입찰 대리 신청" },
      { href: "/service", label: "진행 절차" },
      { href: "/#pricing", label: "수수료" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "콘텐츠",
    links: [
      { href: "/analysis", label: "무료 물건분석" },
      { href: "/guide", label: "경매 가이드" },
      { href: "/news", label: "시장 인사이트" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/about", label: "대표 소개" },
      { href: "/notice", label: "공지사항" },
    ],
  },
  {
    title: "법적",
    links: [
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보처리방침" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-1)] bg-[var(--bg-secondary)]">
      <div className="container-app px-5 py-12 lg:px-8 lg:py-16">
        {/* Brand 좌상. */}
        <div className="mb-10 lg:mb-12">
          <Brand size="sm" mode="light" />
        </div>

        {/* 4 column 광역. */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-10">
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
                      className="text-[13px] text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)] lg:text-[14px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* 사업자 conditional. */}
        {BUSINESS_REGISTERED && (
          <div className="mt-12 border-t border-[var(--divider)] pt-6 text-[12px] leading-[1.7] text-[var(--text-tertiary)]">
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

        {/* 우하 copyright. */}
        <div className="mt-12 flex items-center justify-between border-t border-[var(--divider)] pt-6 text-[12px] text-[var(--text-tertiary)] lg:mt-16">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}
          </p>
          <p>서울보증보험 가입</p>
        </div>
      </div>
    </footer>
  );
}
