"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* Phase 1.2 (A-1-2) v9 — FeatureCard (bento + scroll reveal + hover lift).
 * isLarge = true → bento 큰 카드 (col-span-2 row-span-2 / aspect 16:10 일러스트)
 * isLarge = false → bento 작은 카드 (col-span-1 row-span-1 / aspect-square 일러스트) */

export type FeatureCardProps = {
  img: string;
  alt: string;
  title: string;
  desc: string;
  className?: string;
  isLarge?: boolean;
  delay?: number;
};

export function FeatureCard({
  img,
  alt,
  title,
  desc,
  className = "",
  isLarge = false,
  delay = 0,
}: FeatureCardProps) {
  const { ref: revealRef, className: revealClass, style: revealStyle } =
    useScrollReveal<HTMLLIElement>({ delay });
  const size = isLarge ? 720 : 400;

  return (
    <li
      ref={revealRef}
      className={`${revealClass} group flex flex-col rounded-3xl border border-[var(--border-1)] bg-white p-6 transition-[transform,box-shadow,border-color] duration-[250ms] ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[var(--brand-green)]/30 hover:shadow-[var(--shadow-card-hover)] lg:p-8 ${className}`}
      style={revealStyle}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#E6FAEE] to-white ${
          isLarge ? "aspect-[16/10]" : "aspect-square"
        }`}
      >
        <Image
          src={img}
          alt={alt}
          width={size}
          height={isLarge ? Math.round((size * 10) / 16) : size}
          sizes={
            isLarge
              ? "(max-width: 1024px) 90vw, 60vw"
              : "(max-width: 1024px) 90vw, 33vw"
          }
          className="h-full w-full object-contain"
        />
      </div>

      <h3
        className={`mt-6 font-bold leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)] ${
          isLarge
            ? "text-[26px] lg:text-[36px]"
            : "text-[22px] lg:text-[28px]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 font-medium leading-[1.6] text-[var(--text-secondary)] ${
          isLarge ? "text-[17px] lg:text-[19px]" : "text-[16px] lg:text-[17px]"
        }`}
      >
        {desc}
      </p>
    </li>
  );
}
