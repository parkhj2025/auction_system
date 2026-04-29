import Link from "next/link";
import { FOOTER_SECTIONS } from "@/lib/navigation";
import { COMPANY, COMPLIANCE_ITEMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]">
      <div className="mx-auto w-full max-w-[var(--c-base)] px-4 py-12 sm:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink-900)] text-sm font-black text-white">
                경
              </span>
              <span className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                {COMPANY.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--color-ink-500)]">
              법원 안 가는 부동산 경매 입찰 대리.
              <br />
              현재 {COMPANY.court} 서비스 중 · 서비스 지역은 확대됩니다.
              <br />
              대표 {COMPANY.ceo} · 공인중개사
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="text-sm font-bold text-[var(--color-ink-900)]">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--color-border)] pt-8">
          <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-500)]">
            안내 및 면책
          </h4>
          <ol className="mt-4 flex flex-col gap-2.5 text-xs leading-5 text-[var(--color-ink-500)]">
            {COMPLIANCE_ITEMS.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-bold text-[var(--color-ink-700)]">
                  {i + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-[var(--color-ink-500)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>서울보증보험 가입 · 전자본인서명확인서 비대면 처리</p>
        </div>
      </div>
    </footer>
  );
}
