"use client";

/**
 * 단계 5-4-2-fix-4 룰 13 — mdx 본문 P/Ul/Ol 스크롤 reveal 글로벌.
 *
 * 모션 표준 (룰 14-E):
 *  - duration 400ms (md default)
 *  - easing cubic-bezier(0.16, 1, 0.3, 1)
 *  - opacity 0 → 1 + translateY 8 → 0
 *  - amount 0.2 (20% 노출 시 발화)
 *  - once: false (룰 1 — 위·아래 스크롤 재실행)
 *
 * Typography (룰 14-B):
 *  - P default = body (16px) · ink-700 · leading-relaxed (1.6)
 *  - Ul/Ol = body · ink-700 · marker:ink-900
 */
import type { ComponentPropsWithoutRef } from "react";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

const REVEAL_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export function MdxP({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { id } = rest;
  return (
    <motion.p
      ref={ref}
      id={id}
      className="mt-5 text-[length:var(--text-body)] leading-[1.6] text-[var(--color-ink-700)]"
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={REVEAL_TRANSITION}
    >
      {children}
    </motion.p>
  );
}

export function MdxUl({ children, ...rest }: ComponentPropsWithoutRef<"ul">) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { id } = rest;
  return (
    <motion.ul
      ref={ref}
      id={id}
      className="mt-5 flex list-disc flex-col gap-2 pl-6 text-[length:var(--text-body)] leading-[1.6] text-[var(--color-ink-700)] marker:text-[var(--color-ink-900)]"
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={REVEAL_TRANSITION}
    >
      {children}
    </motion.ul>
  );
}

export function MdxOl({ children, ...rest }: ComponentPropsWithoutRef<"ol">) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { id } = rest;
  return (
    <motion.ol
      ref={ref}
      id={id}
      className="mt-5 flex list-decimal flex-col gap-2 pl-6 text-[length:var(--text-body)] leading-[1.6] text-[var(--color-ink-700)] marker:font-bold marker:text-[var(--color-ink-900)]"
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={REVEAL_TRANSITION}
    >
      {children}
    </motion.ol>
  );
}
