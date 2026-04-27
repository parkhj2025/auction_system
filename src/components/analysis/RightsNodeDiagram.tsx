"use client";

/**
 * 단계 5-4-2: 03 권리분석 우측 sticky graphic — node-link + HUG morph (Animated Transition).
 *
 * 좌측 step active idx 별 다이어그램 state:
 *  - Step 0 (말소기준 식별): 말소기준 노드만 active (ink-900 fill, scale 1.15). 다른 노드 ink-300 outline
 *  - Step 1 (인수 등기): 인수 분기 노드 (위쪽, 임차보증금 1.88억) fade-in + line draw
 *  - Step 2 (HUG 말소동의 효과): 임차보증금 노드 인수→소멸 morph (translate 위→아래, fill solid → outline)
 *  - Step 3 (외국인 임차인 변수): 점유 callout fade-in
 *
 * 모노톤: ink-50/100/300/500/700/900 + ink-900 단일 강조 (말소기준).
 * 인수/소멸 = fill 패턴 (solid / outline / dashed) — 색상 0.
 *
 * case study 인용: scrollytelling "Side-by-Side Sticky" + "Animated Transition" + Distill "interactive node" + chart-visualization "network-graph".
 */
import { motion, AnimatePresence } from "motion/react";
import type { RightsMeta } from "@/types/content";
import { formatKoreanWon } from "@/lib/utils";

type Tenant = NonNullable<RightsMeta["tenants"]>[number];

export function RightsNodeDiagram({
  rights,
  activeIdx,
}: {
  rights: RightsMeta;
  activeIdx: number;
}) {
  const tenant: Tenant | undefined = rights.tenants?.[0];

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
        등기 관계도
      </p>

      <div className="relative mt-6 flex flex-col items-center gap-12">
        {/* 인수 영역 (위쪽 분기) */}
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            인수
          </p>
          <AnimatePresence mode="wait">
            {activeIdx >= 1 && tenant && activeIdx < 2 ? (
              <RightsNode
                key="tenant-inherit"
                label={tenant.name}
                amount={tenant.deposit ?? null}
                state="inherit"
                hint="대항력 있음 + HUG 보증"
                size="lg"
              />
            ) : null}
          </AnimatePresence>
          {activeIdx < 1 ? (
            <div className="h-[88px] w-[200px] opacity-30">
              <div className="h-full w-full rounded-[var(--radius-md)] border border-dashed border-[var(--color-ink-300)]" />
            </div>
          ) : null}
        </div>

        {/* 인수 → 말소기준 line draw */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[88px] h-12 w-px origin-top -translate-x-1/2 bg-[var(--color-ink-300)]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: activeIdx >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 중앙: 말소기준 노드 (Step 0 부터 active) */}
        <RightsNode
          label={`말소기준 — ${rights.basis_type ?? "근저당권"}`}
          amount={null}
          state="basis"
          hint={`${rights.basis_date ?? ""}${rights.basis_holder ? ` · ${rights.basis_holder}` : ""}`}
          size="xl"
          activeIdx={activeIdx}
        />

        {/* 말소기준 → 소멸 line draw */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 bottom-[88px] h-12 w-px origin-top -translate-x-1/2 bg-[var(--color-ink-300)]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: activeIdx >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 소멸 영역 (아래쪽 분기) */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {/* HUG 말소동의 morph — Step 2 시 임차보증금 노드가 인수에서 소멸로 이동 */}
            {activeIdx >= 2 && tenant ? (
              <motion.div
                key="tenant-extinguish"
                layout
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <RightsNode
                  label={tenant.name}
                  amount={tenant.deposit ?? null}
                  state="extinguish-via-hug"
                  hint="HUG 말소동의 → 소멸 처리"
                  size="lg"
                />
              </motion.div>
            ) : null}
            {/* 일반 후순위 등기 */}
            {activeIdx >= 1 ? (
              <motion.div
                key="other-extinguish"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-3"
              >
                <RightsNode
                  label="후순위 등기 (압류·근저당)"
                  amount={null}
                  state="extinguish"
                  hint="말소"
                  size="sm"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {activeIdx < 1 ? (
            <div className="h-[88px] w-[200px] opacity-30">
              <div className="h-full w-full rounded-[var(--radius-md)] border border-dashed border-[var(--color-ink-300)]" />
            </div>
          ) : null}
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            소멸
          </p>
        </div>
      </div>

      {/* 외국인 임차인 callout — Step 3 active */}
      <AnimatePresence>
        {activeIdx >= 3 && tenant?.analysis ? (
          <motion.div
            key="foreign-callout"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mt-6 rounded-[var(--radius-md)] border-l-4 border-[var(--color-ink-700)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs leading-5 text-[var(--color-ink-700)]"
          >
            <p className="font-bold uppercase tracking-wide text-[var(--color-ink-500)]">
              점유 변수
            </p>
            <p className="mt-1">{tenant.analysis}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type RightsState = "basis" | "inherit" | "extinguish" | "extinguish-via-hug";
type RightsSize = "sm" | "lg" | "xl";

function RightsNode({
  label,
  amount,
  state,
  hint,
  size,
  activeIdx,
}: {
  label: string;
  amount: number | null;
  state: RightsState;
  hint?: string;
  size: RightsSize;
  activeIdx?: number;
}) {
  const sizeCls =
    size === "xl"
      ? "w-[240px] py-4 px-5"
      : size === "lg"
        ? "w-[220px] py-3 px-4"
        : "w-[200px] py-2 px-3";
  const fillCls = resolveFillCls(state);
  const isActive = state === "basis" && activeIdx === 0;

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.05 : 1,
      }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-[var(--radius-md)] text-center ${sizeCls} ${fillCls}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]">{label}</p>
      {amount != null ? (
        <p className="mt-1 text-base font-black tabular-nums">
          {formatKoreanWon(amount)}
        </p>
      ) : null}
      {hint ? <p className="mt-0.5 text-[10px] opacity-75">{hint}</p> : null}
    </motion.div>
  );
}

function resolveFillCls(state: RightsState): string {
  switch (state) {
    case "basis":
      return "bg-[var(--color-ink-900)] text-white";
    case "inherit":
      return "border-2 border-[var(--color-ink-700)] bg-white text-[var(--color-ink-900)]";
    case "extinguish":
      return "border border-dashed border-[var(--color-ink-300)] bg-[var(--color-surface-muted)] text-[var(--color-ink-500)]";
    case "extinguish-via-hug":
      return "border-2 border-[var(--color-ink-300)] bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]";
  }
}
