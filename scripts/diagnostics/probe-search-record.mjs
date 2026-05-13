#!/usr/bin/env node
/**
 * search API 호출 + docid 형식 + raw record 광역 dump.
 * 사용: node scripts/diagnostics/probe-search-record.mjs
 *
 * 목적: detail API 안 동등한 docid 생성 paradigm 검수 의무.
 */

const BASE = "https://www.courtauction.go.kr";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

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
    "User-Agent": UA,
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua":
      '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
  };
  const r0 = await fetch(`${BASE}/`, {
    method: "GET",
    headers: {
      ...common,
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
  const r1 = await fetch(
    `${BASE}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
    {
      headers: {
        ...common,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: `${BASE}/`,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
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

async function callSearch(jar, caseNumber, courtCode) {
  const body = {
    dma_pageInfo: {
      pageNo: 1,
      pageSize: 50,
      bfPageNo: "",
      startRowNo: "",
      totalCnt: "",
      totalYn: "Y",
      groupTotalCount: "",
    },
    dma_srchGdsDtlSrchInfo: {
      rletDspslSpcCondCd: "",
      bidDvsCd: "000331",
      mvprpRletDvsCd: "00031R",
      cortAuctnSrchCondCd: "0004601",
      rprsAdongSdCd: "",
      rprsAdongSggCd: "",
      rprsAdongEmdCd: "",
      rdnmSdCd: "",
      rdnmSggCd: "",
      rdnmNo: "",
      mvprpDspslPlcAdongSdCd: "",
      mvprpDspslPlcAdongSggCd: "",
      mvprpDspslPlcAdongEmdCd: "",
      rdDspslPlcAdongSdCd: "",
      rdDspslPlcAdongSggCd: "",
      rdDspslPlcAdongEmdCd: "",
      cortOfcCd: courtCode,
      jdbnCd: "",
      execrOfcDvsCd: "",
      lclDspslGdsLstUsgCd: "",
      mclDspslGdsLstUsgCd: "",
      sclDspslGdsLstUsgCd: "",
      cortAuctnMbrsId: "",
      aeeEvlAmtMin: "",
      aeeEvlAmtMax: "",
      lwsDspslPrcRateMin: "",
      lwsDspslPrcRateMax: "",
      flbdNcntMin: "",
      flbdNcntMax: "",
      objctArDtsMin: "",
      objctArDtsMax: "",
      mvprpArtclKndCd: "",
      mvprpArtclNm: "",
      mvprpAtchmPlcTypCd: "",
      notifyLoc: "off",
      lafjOrderBy: "",
      pgmId: "PGJ151F01",
      csNo: caseNumber,
      cortStDvs: "1",
      statNum: 1,
      bidBgngYmd: "20200101",
      bidEndYmd: "20301231",
      dspslDxdyYmd: "",
      fstDspslHm: "",
      scndDspslHm: "",
      thrdDspslHm: "",
      fothDspslHm: "",
      dspslPlcNm: "",
      lwsDspslPrcMin: "",
      lwsDspslPrcMax: "",
      grbxTypCd: "",
      gdsVendNm: "",
      fuelKndCd: "",
      carMdyrMax: "",
      carMdyrMin: "",
      carMdlNm: "",
      sideDvsCd: "",
    },
  };
  const res = await fetch(
    `${BASE}/pgj/pgjsearch/searchControllerMain.on`,
    {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        Origin: BASE,
        Referer: `${BASE}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`,
        "SC-Userid": "NONUSER",
        "SC-Pgmid": "PGJ151F01",
        submissionid: "mf_wfm_mainFrame_sbm_selectGdsDtlSrch",
        "sec-ch-ua":
          '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Cookie: serializeCookies(jar),
      },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

async function main() {
  const jar = await initSession();
  console.log("session cookies:", [...jar.keys()].join(","));
  // 윈도우 안 사건 search 1회 시도 (532249 = 윈도우 밖 → records 0)
  // 임의 사건번호 시도 — 광역 search 결과 회수 가능 paradigm 광역 결과 후 docid 형식 확인.
  for (const cs of ["2024타경559336", "2024타경540431", "2024타경532249"]) {
    console.log(`\n=== search ${cs} ===`);
    const res = await callSearch(jar, cs, "B000240");
    const records = res?.data?.dlt_srchResult ?? [];
    console.log(`records: ${records.length}`);
    if (records.length > 0) {
      const r = records[0];
      console.log(`docid sample: "${r.docid}"`);
      console.log(`docid 길이: ${r.docid?.length ?? 0}`);
      console.log(`docid 형식 ASCII only: ${/^[\x20-\x7e]+$/.test(r.docid ?? "")}`);
      console.log(`boCd: "${r.boCd}"`);
      console.log(`srnSaNo: "${r.srnSaNo}"`);
      console.log(`saNo: "${r.saNo}"`);
      console.log(`maemulSer: ${r.maemulSer}`);
      console.log(`mokmulSer: ${r.mokmulSer}`);
      console.log(`groupmaemulser: "${r.groupmaemulser}"`);
      console.log(`dspslUsgNm: "${r.dspslUsgNm}"`);
      console.log(`mulJinYn: "${r.mulJinYn}"`);
      console.log(`mulStatcd: "${r.mulStatcd}"`);
      console.log(`maxArea: ${r.maxArea} / minArea: ${r.minArea}`);
      console.log(`wgs84Xcordi: ${r.wgs84Xcordi} / wgs84Ycordi: ${r.wgs84Ycordi}`);
      // 광역 field 광역 list 보기
      console.log(`record key 개수: ${Object.keys(r).length}`);
    }
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
