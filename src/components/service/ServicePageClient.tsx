"use client";

import { ServiceHero } from "./ServiceHero";
import { ServiceScope } from "./ServiceScope";
import { ServiceProcess } from "./ServiceProcess";
import { ServicePricing } from "./ServicePricing";
import { ServiceCTA } from "./ServiceCTA";

/* cycle 1-G-γ — /service 광역 client wrapper (5 섹션 paradigm).
 * paradigm: Hero (charcoal) + Scope (white) + Process (brand-green) + Pricing (surface-muted) + CTA (charcoal). */

export function ServicePageClient() {
  return (
    <main className="flex flex-1 flex-col">
      <ServiceHero />
      <ServiceScope />
      <ServiceProcess />
      <ServicePricing />
      <ServiceCTA />
    </main>
  );
}
