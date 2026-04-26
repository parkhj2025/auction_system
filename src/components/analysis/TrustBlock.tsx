import { Landmark, FileText, ShieldCheck, Signature } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Trust 4-grid — 본문 끝 ApplyCTA 직전.
 *  - 대법원 경매정보 (Landmark) — 공공데이터 기초
 *  - 공인중개사 자격 (FileText) — 대표 박형준 보유
 *  - 서울보증보험 (ShieldCheck) — 대리업무 가입
 *  - 전자서명 접수 (Signature) — 비대면 100%
 *
 * 면책 고지를 하단에 1줄 inline 으로 함께 노출 (preview prototype 패턴).
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
      <p className="mt-6 border-t border-[var(--color-border)] pt-5 text-[11px] leading-5 text-[var(--color-ink-500)]">
        본 콘텐츠는 대법원 경매정보 및 공공데이터를 기초로 작성된 참고 자료이며,
        투자 권유가 아닙니다. 경매퀵은 공인중개사법에 따른 매수신청 대리(입찰
        대리) 업무만을 수행하며, 권리분석·투자자문·명도 등은 포함되지
        않습니다. 주변 시세는 네○○ 부동산, 국토부 실거래가 공개시스템 등 외부
        데이터를 참조했으며 실시간 시세와 차이가 있을 수 있습니다.
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
