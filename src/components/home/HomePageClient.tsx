"use client";

import { HomeHero } from "./HomeHero";
import { HomeScope } from "./HomeScope";
import { HomeCompare } from "./HomeCompare";
import { HomeProcess } from "./HomeProcess";
import { HomePricing } from "./HomePricing";
import { HomeReviews } from "./HomeReviews";
import { HomeInsight } from "./HomeInsight";
import { HomeCTA } from "./HomeCTA";

/* cycle 1-G-γ-α — 메인 광역 client wrapper (8 섹션 paradigm).
 * paradigm: Hero (charcoal + 사건번호 폼) + Scope (white) + Compare (surface-muted)
 *         + Process (brand-green) + Pricing (white) + Reviews (charcoal)
 *         + Insight (white) + CTA (charcoal). */

export function HomePageClient({ caseNumbers }: { caseNumbers: string[] }) {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHero caseNumbers={caseNumbers} />
      <HomeScope />
      <HomeCompare />
      <HomeProcess />
      <HomePricing />
      <HomeReviews />
      <HomeInsight />
      <HomeCTA />
    </main>
  );
}
