"use client";

import { HomeHero } from "./HomeHero";
import { HomeProcess } from "./HomeProcess";
import { HomeCompare } from "./HomeCompare";
import { HomePricing } from "./HomePricing";
import { HomeScope } from "./HomeScope";
import { HomeReviews } from "./HomeReviews";
import { HomeInsight } from "./HomeInsight";
import { HomeCTA } from "./HomeCTA";

/* cycle 1-G-γ-α-α — 메인 광역 client wrapper (8 섹션 순서 정정).
 * paradigm: Hero (진입) → Process (어떻게) → Compare (왜) → Pricing (얼마)
 *         → Scope (정확 범위) → Reviews (실제) → Insight (자료) → CTA (시작).
 * bg 변주 = charcoal 3 + brand-green 1 + white 2 + surface-muted 2. */

export function HomePageClient({ caseNumbers }: { caseNumbers: string[] }) {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHero caseNumbers={caseNumbers} />
      <HomeProcess />
      <HomeCompare />
      <HomePricing />
      <HomeScope />
      <HomeReviews />
      <HomeInsight />
      <HomeCTA />
    </main>
  );
}
