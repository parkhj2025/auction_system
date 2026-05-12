"use client";

import { AboutHero } from "./AboutHero";
import { AboutProblems } from "./AboutProblems";
import { AboutValues } from "./AboutValues";
import { AboutTrust } from "./AboutTrust";
import { AboutCompany } from "./AboutCompany";

/* cycle 1-G-β-γ-γ — /about 광역 client wrapper (5 섹션 paradigm).
 * paradigm: Hero (charcoal) + Problems (white) + Why us (brand-green) + Trust System (surface-muted) + About (charcoal).
 * Office + Regions + Credentials 영구 폐기 / 부분 보존 (Hero·Values·Company SVG). */

export function AboutPageClient() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutHero />
      <AboutProblems />
      <AboutValues />
      <AboutTrust />
      <AboutCompany />
    </main>
  );
}
