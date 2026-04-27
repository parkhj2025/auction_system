"use client";

/**
 * 단계 5-4-2-fix-3 룰 4 — mdx 표 클라이언트 요소 (CSS nth-child stagger 패턴).
 *
 * mdx-components.tsx 가 server component 이므로 motion / useInView / context 활용 위해
 * Table / Thead / Tr 만 별도 client 모듈로 분리.
 *
 * 시각 위계 (단계 5-4-2-fix-2 룰 유지):
 *  - 진행 회차 / 말소기준 → bg-ink-50 + font-bold + text-ink-900 (strong)
 *  - 인수 → bg-ink-100 + font-bold (강조)
 *  - 유찰 / 매각 / 미납 (과거) → opacity-60 + text-ink-500 (weak)
 *  - hover → bg-ink-50 transition-colors duration-200
 *
 * 스크롤 reveal (룰 4 + 룰 1 once: false):
 *  - MdxTable 자체 useInView (once: false)
 *  - 진입 시 .mdx-table-revealed 클래스 토글 → CSS nth-child stagger 발동
 *  - tbody tr 들이 80~120ms 간격으로 fade-in (07 체크포인트 패턴 동등)
 *  - 위·아래 스크롤 재실행 — viewport 밖 → 들어옴 시 stagger 재발동
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
  // 룰 1 (단계 5-4-2-fix-3): once: false — 위·아래 스크롤 시 stagger 재실행
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  return (
    <div
      ref={ref}
      className={`mt-6 overflow-x-auto mdx-table-wrapper ${isInView ? "mdx-table-revealed" : ""}`}
    >
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

export function MdxTr({
  children,
  ...rest
}: ComponentPropsWithoutRef<"tr">) {
  const text = extractText(children);
  const tone = detectRowToneClass(text);
  const cls = `${tone.bgCls} ${tone.weightCls} ${tone.textCls} transition-colors duration-200 hover:bg-[var(--color-ink-50)]`;
  // 룰 4 — motion.tr 폐기. CSS nth-child stagger (globals.css `.mdx-table-revealed tbody tr:nth-child(N)`) 활용.
  return (
    <tr className={cls} {...rest}>
      {children}
    </tr>
  );
}
