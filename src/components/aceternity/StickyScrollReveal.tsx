"use client";

import React, { useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

/* Aceternity UI — Sticky Scroll Reveal (https://ui.aceternity.com/components/sticky-scroll-reveal).
 * 좌측 sticky 텍스트 + 우측 카드 progress 활성. 본 사이트 (Features lg+ only).
 * import 변환: framer-motion → motion/react. */

export type StickyContent = {
  title: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
};

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyContent[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <motion.div
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + String(index)} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-[var(--text-h2)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--text-primary)]"
                style={{ fontWeight: 800 }}
              >
                {item.title}
              </motion.h2>
              {item.description ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="mt-6 max-w-md text-[18px] font-medium leading-[1.6] text-[var(--text-secondary)] lg:text-[20px]"
                >
                  {item.description}
                </motion.p>
              ) : null}
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        className={cn(
          "sticky top-10 hidden h-[24rem] w-96 overflow-hidden rounded-2xl bg-white lg:block",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
