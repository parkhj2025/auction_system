"use client";

/**
 * 03 권리분석 — 단계 5-4-2-fix Phase 2: 등기 관계도 폐기 + 4 STEP narrative 단순 정적.
 *
 * 변경:
 *  - 단계 5-4-2 SideBySideSticky + RightsNodeDiagram (등기 관계도) 폐기
 *  - 4 STEP narrative 정적 nubmered list (말소기준 식별 → 임차보증금 인수 → HUG 효과 → 점유 변수)
 *  - 등기부 표·임차인 표·기타 인수 부담 산문은 mdx 본문에서 처리
 *
 * 의도: 03 다이어그램 단순화 (형준님 본질 통찰) — 다이어그램 적재적소 분배 (04·05·06 강화 / 03 단순화).
 */
import type { RightsMeta } from "@/types/content";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { formatKoreanWon } from "@/lib/utils";

export function RightsAnalysisSection({ rights }: { rights: RightsMeta }) {
  const ref = useRef<HTMLOListElement>(null);
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 시 stagger 재실행 의무
  const inView = useInView(ref, { once: false, amount: 0.2 });

  if (!rights) return null;

  const tenant = rights.tenants?.[0];
  const hasTenant = !!tenant;
  const tenantHasOpposingPower = tenant?.opposing_power === true;
  const tenantDeposit = tenant?.deposit ?? null;
  const isHugCase =
    tenant?.analysis?.includes("HUG") || tenant?.analysis?.includes("말소동의");

  const steps: Array<{ title: string; body: React.ReactNode }> = [
    {
      title: "말소기준등기 식별",
      body: (
        <>
          {rights.basis_date} 접수된{" "}
          <span className="font-bold">{rights.basis_type}</span>이 말소기준등기입니다.
          이 등기 이후 모든 후순위 등기는 매각 시 소멸합니다.
        </>
      ),
    },
  ];

  if (hasTenant) {
    steps.push({
      title: "임차보증금 인수",
      body: (
        <>
          {tenantHasOpposingPower ? "대항력 있는 임차인" : "임차인"} (
          {tenant!.move_in_date} 전입) 이 점유 중이며, 보증금{" "}
          <span className="font-bold tabular-nums">
            {tenantDeposit != null ? formatKoreanWon(tenantDeposit) : "미공개"}
          </span>
          은 낙찰자 인수 대상입니다.
        </>
      ),
    });
  }

  if (isHugCase) {
    steps.push({
      title: "HUG 말소동의 효과",
      body: (
        <>
          주택도시보증공사(HUG)가 말소동의 확약서를 제출하면 임차보증금이 인수에서
          소멸로 전환됩니다. 낙찰자의 실질 인수 부담이 0으로 변동.
        </>
      ),
    });
  }

  if (tenant?.analysis) {
    steps.push({
      title: "점유 변수 검토",
      body: <>{tenant.analysis}</>,
    });
  }

  if (steps.length === 0) return null;

  return (
    <ol
      ref={ref}
      className="mt-6 grid gap-4 sm:grid-cols-2"
      aria-label="권리분석 단계"
    >
      {steps.map((step, idx) => (
        <motion.li
          key={`rights-step-${idx}`}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{
            duration: 0.5,
            delay: 0.1 + idx * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ y: -2, transition: { duration: 0.2, ease: "easeOut" } }}
          className="rounded-[var(--radius-xl)] border border-[var(--color-ink-200)] bg-white p-5 transition-colors duration-200 ease-out hover:border-[var(--color-ink-900)] hover:bg-[var(--color-ink-50)] hover:shadow-[var(--shadow-card)]"
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-black uppercase tracking-[0.18em] tabular-nums text-[var(--color-ink-500)]">
              Step {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[length:var(--text-body)] font-black tracking-tight text-[var(--color-ink-900)]">
              {step.title}
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">
            {step.body}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
