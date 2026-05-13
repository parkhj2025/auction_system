#!/usr/bin/env node
/**
 * fetchCaseDetail (TS) 동작 검수 — dev IP 직접 호출 + row schema dump.
 *
 * 사용: pnpm dlx tsx scripts/diagnostics/probe-fetchCaseDetail.mjs
 *
 * 검수 사건 3건:
 *   1. 2024타경532249 (윈도우 밖 / 매각일 2026-06-29 = 47일 후)
 *   2. 2024타경559336 (윈도우 안 후보)
 *   3. 2024타경540431 (윈도우 안 후보)
 */

import { fetchCaseDetail } from "../../src/lib/courtAuction/detail";

async function probe(caseNumber: string, label: string) {
  console.log(`\n========== ${label} (${caseNumber}) ==========`);
  try {
    const rows = await fetchCaseDetail({
      courtCode: "B000240",
      caseNumber,
      courtNameFallback: "인천지방법원",
    });
    console.log(`rows.length: ${rows.length}`);
    if (rows.length === 0) return;
    const r = rows[0];
    console.log(`\n--- row[0] schema ---`);
    for (const [k, v] of Object.entries(r)) {
      if (k === "raw_snapshot") {
        const keyCount =
          v && typeof v === "object" ? Object.keys(v as object).length : 0;
        console.log(`  ${k}: <Object ${keyCount} keys>`);
        continue;
      }
      let display: string;
      if (v === null || v === undefined) display = "null";
      else if (typeof v === "string")
        display = v.length > 80 ? `"${v.slice(0, 80)}..."` : `"${v}"`;
      else if (typeof v === "object") display = JSON.stringify(v).slice(0, 80);
      else display = JSON.stringify(v);
      console.log(`  ${k}: ${display}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`ERROR: ${msg}`);
  }
}

async function main() {
  await probe("2024타경532249", "윈도우 밖 사건 (47일 후)");
  await probe("2024타경559336", "윈도우 안 후보 A");
  await probe("2024타경540431", "윈도우 안 후보 B");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
