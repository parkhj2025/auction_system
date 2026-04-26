import { Landmark, FileText, ShieldCheck, Signature } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Trust 4-grid (G1 보강).
 *  - 4 grid (대법원 / 자격 / 보증보험 / 전자서명) — 보존
 *  - 컴플라이언스 산문 단락 → footnote 1줄 압축 (자세한 고지는 ComplianceFooter 가 단독 노출)
 */
export function TrustBlock() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="mt-14 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 sm:p-8"
    >
      <h2
        id="trust-heading"
        className="text-xl font-black tracking-tight text-[var(--color-ink-900)]"
      >
        경매퀵이 보장하는 것
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <TrustItem
          icon={<Landmark size={18} aria-hidden="true" />}
          title="대법원 경매정보"
          body="공공데이터 기초"
        />
        <TrustItem
          icon={<FileText size={18} aria-hidden="true" />}
          title="공인중개사 자격"
          body="대표 박형준 보유"
        />
        <TrustItem
          icon={<ShieldCheck size={18} aria-hidden="true" />}
          title="서울보증보험"
          body="대리업무 가입"
        />
        <TrustItem
          icon={<Signature size={18} aria-hidden="true" />}
          title="전자서명 접수"
          body="비대면 100%"
        />
      </div>
      <p className="mt-5 text-[11px] leading-5 text-[var(--color-ink-500)]">
        본 콘텐츠는 참고 자료입니다. 자세한 고지는 페이지 하단 안내 참조.
      </p>
    </section>
  );
}

function TrustItem({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-white text-[var(--color-brand-600)] shadow-[var(--shadow-card)]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-black text-[var(--color-ink-900)]">{title}</p>
        <p className="text-xs text-[var(--color-ink-500)]">{body}</p>
      </div>
    </div>
  );
}
