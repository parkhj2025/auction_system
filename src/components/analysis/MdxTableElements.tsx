"use client";

/**
 * 단계 5-4-2-fix-2 Phase 1 — mdx 표 클라이언트 요소.
 *
 * mdx-components.tsx 가 server component 이므로 motion / useContext / useInView 활용 위해
 * Table / Thead / Tr 만 별도 client 모듈로 분리.
 *
 * 시각 위계 (단계 5-4-2-fix-2):
 *  - 진행 회차 / 말소기준 → bg-ink-50 + font-bold + text-ink-900 (strong)
 *  - 인수 → bg-ink-100 + font-bold (강조)
 *  - 유찰 / 매각 / 미납 (과거) → opacity-60 + text-ink-500 (weak)
 *  - hover → bg-ink-50 transition-colors duration-200
 *
 * 스크롤 reveal:
 *  - 헤더 행 (thead 자식 tr) 즉시 노출
 *  - 본문 행 (tbody 자식 tr) viewport 진입 시 fade-in (opacity 0→1, x: -8 → 0)
 */

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { motion, useInView } from "motion/react";

const TheadContext = createContext<boolean>(false);

function extractText(children: ReactNode): string {
  if (children == null || children === false || children === true) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children
  ) {
    const p = (children as { props?: { children?: ReactNode } }).props;
    return extractText(p?.children);
  }
  return "";
}

export function MdxTable({
  children,
  ...rest
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table
        className="w-full min-w-[36rem] border-collapse text-sm tabular-nums"
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

export function MdxThead({
  children,
  ...rest
}: ComponentPropsWithoutRef<"thead">) {
  return (
    <TheadContext.Provider value={true}>
      <thead className="bg-[var(--color-surface-muted)]" {...rest}>
        {children}
      </thead>
    </TheadContext.Provider>
  );
}

function detectRowToneClass(text: string): {
  bgCls: string;
  weightCls: string;
  textCls: string;
} {
  if (/말소기준/.test(text)) {
    return {
      bgCls: "bg-[var(--color-ink-50)]",
      weightCls: "font-bold",
      textCls: "text-[var(--color-ink-900)]",
    };
  }
  if (/\*\*\s*인수\s*\*\*|\b인수\s*\(|\b인수\s*,|\b인수\s*$/.test(text)) {
    return {
      bgCls: "bg-[var(--color-ink-100)]",
      weightCls: "font-bold",
      textCls: "text-[var(--color-ink-900)]",
    };
  }
  if (/\b진행\b/.test(text)) {
    return {
      bgCls: "bg-[var(--color-ink-50)]",
      weightCls: "font-bold",
      textCls: "text-[var(--color-ink-900)]",
    };
  }
  if (/유찰|미납|\*\*\s*매각\s*\*\*|\*\*\s*낙찰\s*\*\*/.test(text)) {
    return {
      bgCls: "",
      weightCls: "",
      textCls: "text-[var(--color-ink-500)] opacity-60",
    };
  }
  return { bgCls: "", weightCls: "", textCls: "" };
}

export function MdxTr({
  children,
  ...rest
}: ComponentPropsWithoutRef<"tr">) {
  const text = extractText(children);
  const tone = detectRowToneClass(text);
  const isHeader = useContext(TheadContext);
  const rowRef = useRef<HTMLTableRowElement>(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.3 });

  const cls = `${tone.bgCls} ${tone.weightCls} ${tone.textCls} transition-colors duration-200 hover:bg-[var(--color-ink-50)]`;

  if (isHeader) {
    return (
      <tr className={cls} {...rest}>
        {children}
      </tr>
    );
  }

  const { id } = rest;

  return (
    <motion.tr
      ref={rowRef}
      id={id}
      className={cls}
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.tr>
  );
}
