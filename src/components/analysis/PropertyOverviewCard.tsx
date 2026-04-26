"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { AnalysisFrontmatter, AnalysisMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";
import { Modal } from "./Modal";

/**
 * 01 물건 개요 — 압축 8필드 카드 + "전체 정보 보기" 모달.
 *  - 카드: frontmatter + meta 에서 추출한 8필드만
 *  - 모달: children = mdx body 의 첫 table (remark plugin 이 wrap)
 *
 * 데이터 출처:
 *  - 8필드: AnalysisFrontmatter (caseNumber/address/propertyType/appraisal/minPrice/round/percent/bidDate/areaM2/areaPyeong)
 *  - 권리상태 한 줄 요약: meta.rights.basis_date + tenants[] 기반
 *  - 14필드 (모달): mdx body 의 첫 table (children) 그대로
 *
 * 단계 3-1 G1 보존 — 본문 표는 별도 노출 0 (remark plugin 이 차단·wrap).
 */
export function PropertyOverviewCard({
  fm,
  meta,
  children,
}: {
  fm: AnalysisFrontmatter;
  meta: AnalysisMeta | null | undefined;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const rightsSummary = buildRightsSummary(meta);

  return (
    <>
      <section
        aria-label="물건 개요"
        className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      >
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field label="사건번호" value={fm.caseNumber} mono />
          <Field label="소재지" value={fm.address} />
          <Field label="물건종류" value={fm.propertyType} />
          <Field
            label="감정가"
            value={fm.appraisalDisplay ?? formatKoreanWon(fm.appraisal)}
            mono
          />
          <Field
            label={`${fm.round}차 최저가`}
            value={`${fm.minPriceDisplay ?? formatKoreanWon(fm.minPrice)} · 감정가 ${fm.percent}%`}
            mono
          />
          <Field
            label="입찰일"
            value={`${fm.bidDate}${fm.bidTime ? ` ${fm.bidTime}` : ""}`}
            mono
          />
          <Field
            label="전용면적"
            value={`${fm.areaM2.toLocaleString("ko-KR")}㎡ (${fm.areaPyeong.toLocaleString("ko-KR")}평)`}
            mono
          />
          <Field label="권리관계" value={rightsSummary} />
        </dl>

        {children ? (
          <div className="mt-5 flex justify-end border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-bold text-[var(--color-ink-700)] transition hover:bg-[var(--color-ink-100)]"
            >
              전체 정보 보기
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="물건 전체 정보"
        size="lg"
      >
        <div className="[&>*:first-child]:mt-0">{children}</div>
      </Modal>
    </>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-bold text-[var(--color-ink-900)] ${mono ? "tabular-nums" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * 권리상태 한 줄 요약 — meta.rights 기반.
 *  - 인수 임차인 있음 → "인수 부담 있음 · 말소기준 {date}"
 *  - 임차인 없음 → "인수 부담 없음 · 등기 전부 소멸"
 *  - meta 누락 → "본문 권리분석 참조"
 */
function buildRightsSummary(meta: AnalysisMeta | null | undefined): string {
  if (!meta?.rights) return "본문 권리분석 참조";
  const r = meta.rights;
  const tenants = Array.isArray(r.tenants) ? r.tenants : [];
  const hasOpposing = tenants.some((t) => t.opposing_power === true);
  const basisDate = r.basis_date || "";

  if (hasOpposing) {
    return `인수 부담 있음${basisDate ? ` · 말소기준 ${basisDate}` : ""}`;
  }
  if (tenants.length === 0) {
    return `인수 부담 없음 · 등기 전부 소멸${basisDate ? ` (${basisDate})` : ""}`;
  }
  return `임차인 ${tenants.length}명 · 대항력 없음${basisDate ? ` · 말소기준 ${basisDate}` : ""}`;
}
