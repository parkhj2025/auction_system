"use client";

import { AboutHero } from "./AboutHero";
import { AboutValues } from "./AboutValues";
import { AboutCredentials } from "./AboutCredentials";
import { AboutCompany } from "./AboutCompany";
import { AboutOffice } from "./AboutOffice";
import { AboutRegions } from "./AboutRegions";

/* cycle 1-G-β-γ-β — /about 광역 client wrapper (motion v12 광역 사용 paradigm). */

export function AboutPageClient() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutHero />
      <AboutValues />
      <AboutCredentials />
      <AboutCompany />
      <AboutOffice />
      <AboutRegions />
    </main>
  );
}
