"use client";

/**
 * 단계 5-4-2-fix-5 룰 17 — mdx 표 mobile card stack 패턴.
 *
 * 외부 영감: UXmatters·Hoverify·Bootcamp Card stack 표준.
 *
 * Mobile (< 768px):
 *  - Table: block (table 폐기)
 *  - Thead: hidden (sr-only 보존)
 *  - Tr: card layout (border + rounded + padding + mb-3)
 *  - Td: block + 한 줄씩 표시
 *
 * Desktop (>= 768px):
 *  - Table: 정상 table 형식
 *  - Thead: 정상 표 헤더
 *  - Tr: table-row
 *  - Td: table-cell
 *
 * 룰 4 보존 — CSS nth-child stagger (globals.css `.mdx-table-revealed tbody tr:nth-child(N)`).
 * 룰 1 once: false — viewport 재진입 시 stagger 재발동.
 */

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useRef } from "react";
import { useInView } from "motion/react";

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  return (
    <div
      ref={ref}
      className={`mt-6 overflow-x-auto mdx-table-wrapper ${isInView ? "mdx-table-revealed" : ""}`}
    >
      <table
        className="w-full border-collapse text-[length:var(--text-caption)] tabular-nums md:min-w-[36rem] md:text-[length:var(--text-body-sm)]"
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
    <thead className="bg-[var(--color-surface-muted)]" {...rest}>
      {children}
    </thead>
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

/**
 * 룰 19 (단계 5-4-2-fix-6) — Tr mobile + desktop 모두 table-row default.
 * card stack 패턴 폐기 (border-rounded-mb-p 폐기). 표 형태 보존.
 */
export function MdxTr({
  children,
  ...rest
}: ComponentPropsWithoutRef<"tr">) {
  const text = extractText(children);
  const tone = detectRowToneClass(text);
  const cls = `border-b border-[var(--color-border)] ${tone.bgCls} ${tone.weightCls} ${tone.textCls} transition-colors duration-200 hover:bg-[var(--color-ink-50)]`;
  return (
    <tr className={cls} {...rest}>
      {children}
    </tr>
  );
}
