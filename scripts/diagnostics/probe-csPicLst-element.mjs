#!/usr/bin/env node
/**
 * work-008 사진 NG 사실 회수 — csPicLst element schema + URL paradigm 확인.
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
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function initSession() {
  const jar = new Map();
  const common = {
    "User-Agent": COURT_AUCTION.USER_AGENT,
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua":
      '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
  };
  const r0 = await fetch(`${COURT_AUCTION.BASE_URL}/`, {
    headers: { ...common, Accept: "text/html" },
  });
  for (const [k, v] of parseSetCookies(
    r0.headers.getSetCookie?.() ?? []
  ).entries())
    jar.set(k, v);
  await new Promise((r) => setTimeout(r, 2000));
  const r1 = await fetch(
    `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
    {
      headers: {
        ...common,
        Accept: "text/html",
        Referer: `${COURT_AUCTION.BASE_URL}/`,
        Cookie: serializeCookies(jar),
      },
    }
  );
  for (const [k, v] of parseSetCookies(
    r1.headers.getSetCookie?.() ?? []
  ).entries())
    jar.set(k, v);
  return jar;
}

async function main() {
  const jar = await initSession();
  const res = await fetch(
    `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.DETAIL_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "User-Agent": COURT_AUCTION.USER_AGENT,
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        Origin: COURT_AUCTION.BASE_URL,
        Referer: `${COURT_AUCTION.BASE_URL}${COURT_AUCTION.INIT_ENDPOINT}`,
        "SC-Userid": COURT_AUCTION.SC_USERID,
        "SC-Pgmid": COURT_AUCTION.DETAIL_PGM_ID,
        submissionid: COURT_AUCTION.DETAIL_SUBMISSION_ID,
        Cookie: serializeCookies(jar),
      },
      body: JSON.stringify({
        dma_srchGdsDtlSrch: {
          csNo: "2024타경532249",
          cortOfcCd: "B000240",
          dspslGdsSeq: "1",
          pgmId: COURT_AUCTION.DETAIL_PGM_ID,
          srchInfo: {},
        },
      }),
    }
  );
  const json = await res.json();
  const csPicLst = json?.data?.dma_result?.csPicLst ?? [];
  console.log(`csPicLst.length: ${csPicLst.length}`);
  if (csPicLst.length === 0) return;
  const first = csPicLst[0];
  console.log(`\n=== csPicLst[0] keys ===`);
  for (const [k, v] of Object.entries(first)) {
    let display;
    if (v === null || v === undefined) display = "null";
    else if (typeof v === "string") {
      if (k === "picFile") {
        display = `<base64 ${v.length} chars / starts: "${v.slice(0, 30)}...">`;
      } else if (v.length > 100) {
        display = `"${v.slice(0, 100)}..."`;
      } else {
        display = `"${v}"`;
      }
    } else display = JSON.stringify(v);
    console.log(`  ${k}: ${display}`);
  }
  // category 광역 sample 1건 dump
  const seen = new Set();
  console.log(`\n=== category 광역 1건 sample ===`);
  for (const pic of csPicLst) {
    const cat = pic.cortAuctnPicDvsCd;
    if (seen.has(cat)) continue;
    seen.add(cat);
    console.log(
      `  cat=${cat} title="${pic.picTitlNm}" picFileUrl="${pic.picFileUrl ?? "(null)"}" hasBase64=${!!pic.picFile}`
    );
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
