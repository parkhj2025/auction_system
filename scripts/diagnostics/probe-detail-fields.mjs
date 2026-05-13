#!/usr/bin/env node
/**
 * DETAIL_ENDPOINT 응답 nested object 의 field 상세 dump.
 * 사용: node scripts/diagnostics/probe-detail-fields.mjs
 */

const COURT_AUCTION = {
  BASE_URL: "https://www.courtauction.go.kr",
  INIT_ENDPOINT: "/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",
  DETAIL_ENDPOINT: "/pgj/pgj15B/selectAuctnCsSrchRslt.on",
  DETAIL_SUBMISSION_ID: "mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo",
  DETAIL_PGM_ID: "PGJ15BM01",
  SC_USERID: "NONUSER",
  USER_AGENT:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
};

function parseSetCookies(headers) {
  const jar = new Map();
  for (const raw of headers) {
    const firstSemi = raw.indexOf(";");
    const pair = firstSemi >= 0 ? raw.slice(0, firstSemi) : raw;
    const eq = pair.indexOf("=");
    if (eq < 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (name && value) jar.set(name, value);
  }
  return jar;
}
function serializeCookies(jar) {
  return Array.from(jar.entries()).map(([k, v]) => `${k}=${v}`).join("; ");
}

async function initSession() {
  const jar = new Map();
  const commonHeaders = {
    "User-Agent": COURT_AUCTION.USER_AGENT,
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua":
      '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
  };
  const r0 = await fetch(`${COURT_AUCTION.BASE_URL}/`, {
    method: "GET",
    headers: {
      ...commonHeaders,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
  });
  for (const [k, v] of parseSetCookies(
    r0.headers.getSetCookie?.() ?? []
  ).entries())
    jar.set(k, v);
  await new Promise((r) => setTimeout(r, 2000));
  const res = await fetch(
    `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
    {
      method: "GET",
      headers: {
        ...commonHeaders,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: `${COURT_AUCTION.BASE_URL}/`,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        Cookie: serializeCookies(jar),
      },
    }
  );
  for (const [k, v] of parseSetCookies(
    res.headers.getSetCookie?.() ?? []
  ).entries())
    jar.set(k, v);
  return jar;
}

async function callDetail(jar, caseNumber, courtCode, itemSequence) {
  const res = await fetch(
    `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.DETAIL_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "User-Agent": COURT_AUCTION.USER_AGENT,
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        Origin: COURT_AUCTION.BASE_URL,
        Referer: `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
        "SC-Userid": COURT_AUCTION.SC_USERID,
        "SC-Pgmid": COURT_AUCTION.DETAIL_PGM_ID,
        submissionid: COURT_AUCTION.DETAIL_SUBMISSION_ID,
        "sec-ch-ua":
          '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Cookie: serializeCookies(jar),
      },
      body: JSON.stringify({
        dma_srchGdsDtlSrch: {
          csNo: caseNumber,
          cortOfcCd: courtCode,
          dspslGdsSeq: String(itemSequence),
          pgmId: COURT_AUCTION.DETAIL_PGM_ID,
          srchInfo: {},
        },
      }),
    }
  );
  return res.json();
}

function dumpObject(label, obj, opts = {}) {
  const { truncate = 200 } = opts;
  console.log(`\n=== ${label} ===`);
  if (!obj) {
    console.log("(null/undefined)");
    return;
  }
  if (Array.isArray(obj)) {
    console.log(`[array of ${obj.length} items]`);
    if (obj.length > 0) {
      console.log("first item full dump:");
      console.log(JSON.stringify(obj[0], null, 2).slice(0, truncate * 5));
    }
    return;
  }
  if (typeof obj !== "object") {
    console.log(JSON.stringify(obj));
    return;
  }
  // shallow object - dump all keys + truncated values
  for (const [k, v] of Object.entries(obj)) {
    let display;
    if (v === null || v === undefined) display = "null";
    else if (typeof v === "string")
      display = v.length > truncate ? `"${v.slice(0, truncate)}..."` : `"${v}"`;
    else if (typeof v === "object") {
      const s = JSON.stringify(v);
      display = s.length > truncate ? `${s.slice(0, truncate)}...` : s;
    } else display = JSON.stringify(v);
    console.log(`  ${k}: ${display}`);
  }
}

async function main() {
  const jar = await initSession();
  console.log("[session] cookies=", [...jar.keys()].join(","));

  // 532249 단독 detailed dump (윈도우 밖 사건)
  const json = await callDetail(jar, "2024타경532249", "B000240", 1);
  const result = json?.data?.dma_result;
  if (!result) {
    console.log("dma_result NG");
    return;
  }

  dumpObject("csBaseInfo", result.csBaseInfo);
  dumpObject("dstrtDemnInfo[0]", result.dstrtDemnInfo?.[0]);
  dumpObject("dspslGdsDxdyInfo", result.dspslGdsDxdyInfo);
  dumpObject(
    "gdsDspslDxdyLst (전체 회차 list)",
    result.gdsDspslDxdyLst,
    { truncate: 600 }
  );
  dumpObject(
    "gdsDspslObjctLst[0] (매각 대상 첫 항목)",
    result.gdsDspslObjctLst?.[0]
  );
  dumpObject(
    "aeeWevlMnpntLst[0] (감정평가 명세 첫 항목)",
    result.aeeWevlMnpntLst?.[0]
  );
  dumpObject("picDvsIndvdCnt", result.picDvsIndvdCnt);

  // 전체 매각 회차 정보 (모든 항목 full dump)
  console.log("\n\n=== gdsDspslDxdyLst 전체 회차 ===");
  for (let i = 0; i < (result.gdsDspslDxdyLst?.length ?? 0); i++) {
    console.log(`\n[회차 ${i + 1}]`);
    console.log(JSON.stringify(result.gdsDspslDxdyLst[i], null, 2));
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
