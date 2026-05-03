import Link from "next/link";
import { COMPANY } from "@/lib/constants";
import { Brand } from "@/components/Brand";

/* v7 SNS inline SVG paradigm (lucide-react Instagram·Youtube 미export 본질 회피). */
function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconYoutube({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 8.5a2.5 2.5 0 0 0-1.8-1.8C18.5 6 12 6 12 6s-6.5 0-8.2.7A2.5 2.5 0 0 0 2 8.5C1.5 10.2 1.5 12 1.5 12s0 1.8.5 3.5a2.5 2.5 0 0 0 1.8 1.8C5.5 18 12 18 12 18s6.5 0 8.2-.7a2.5 2.5 0 0 0 1.8-1.8c.5-1.7.5-3.5.5-3.5s0-1.8-.5-3.5z" />
      <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
    </svg>
  );
}
function IconChat({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}
function IconRss({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

/* Phase 1.2 (A-1-2) v9 — Footer (Top CTA section 영구 폐기 → Trust 통합 paradigm).
 * Brand + tagline + 4 column + 원형 SNS + copyright + 사업자 conditional 보존.
 * CTA section = TrustCTA로 영구 흡수 (CTA 광역 2건 = Hero + Trust paradigm 정합).
 * 사업자 정보 env conditional 보존. */

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

const SNS_LINKS = [
  { href: "#", label: "Instagram", icon: IconInstagram },
  { href: "#", label: "카카오톡 채널", icon: IconChat },
  { href: "#", label: "블로그", icon: IconRss },
  { href: "#", label: "YouTube", icon: IconYoutube },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-1)] bg-[var(--bg-secondary)]">
      <div className="container-app px-5 py-14 lg:px-8 lg:py-20">
        {/* Brand + tagline + 4 column (Top CTA section = TrustCTA 영구 흡수). */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr] lg:gap-12">
          <div>
            <Brand size="sm" mode="light" />
            <p className="mt-5 text-[14px] leading-[1.7] text-[var(--text-secondary)] lg:text-[15px]">
              빠르고 안전한 부동산 경매 입찰 대리 서비스.
              <br />
              대표 {COMPANY.ceo} · 공인중개사 · 매수신청대리인.
            </p>
          </div>

          {/* 4 column. */}
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

        {/* 원형 SNS green (Manako 차용 본질). */}
        <div className="mt-12 flex items-center gap-3">
          {SNS_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-green)] text-white shadow-[var(--shadow-glow-green-soft)] transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
            >
              <Icon size={18} />
            </Link>
          ))}
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

        {/* copyright. */}
        <div className="mt-10 flex items-center justify-between border-t border-[var(--divider)] pt-6 text-[13px] text-[var(--text-tertiary)] lg:mt-12 lg:text-[14px]">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>서울보증보험 가입</p>
        </div>
      </div>
    </footer>
  );
}
