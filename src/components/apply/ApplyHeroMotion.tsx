"use client";

import { Children, type ReactNode, useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";

/* Stage 2 cycle 1-A — /apply 헤더 motion wrapper.
 * paradigm: page.tsx server component 광역 보존 + motion 광역 client 추출.
 * 자식 요소 (PageHero + ApplyChecklist section) 광역 stagger 진입.
 * 메인 Pricing/Reviews/Insight 정수 정합 (y:20 / duration:0.6 / stagger:0.1 / delayChildren:0.2). */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ApplyHeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const childrenArray = Children.toArray(children);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {childrenArray.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
