#!/usr/bin/env node
/**
 * work-007 reverse engineering probe — 대법원 DETAIL_ENDPOINT 직접 호출 + 응답 schema 회수.
 *
 * 가설: SEARCH_ENDPOINT = 매각일 2주 윈도우 제약 ↔ DETAIL_ENDPOINT = csNo + cortOfcCd + dspslGdsSeq 직접 호출이므로 윈도우 제약 무관.
 *
 * 사용:
 *   pnpm dlx tsx scripts/diagnostics/probe-detail-endpoint.mjs
 */

const COURT_AUCTION = {
  BASE_URL: "https://www.courtauction.go.kr",
  INIT_ENDPOINT: "/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml",
  SEARCH_ENDPOINT: "/pgj/pgjsearch/searchControllerMain.on",
  SEARCH_SUBMISSION_ID: "mf_wfm_mainFrame_sbm_selectGdsDtlSrch",
  SEARCH_PGM_ID: "PGJ151F01",
  DETAIL_ENDPOINT: "/pgj/pgj15B/selectAuctnCsSrchRslt.on",
  DETAIL_SUBMISSION_ID: "mf_wfm_mainFrame_sbm_selectGdsDtlSrchDtlInfo",
  DETAIL_PGM_ID: "PGJ15BM01",
  CORT_AUCTN_SRCH_COND_CD: "0004601",
  MVPRP_RLET_DVS_CD: "00031R",
  BID_DVS_CD: "000331",
  CORT_ST_DVS: "1",
  STAT_NUM: 1,
  NOTIFY_LOC: "off",
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

function createSession() {
  const jar = new Map();
  async function init() {
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
    const sc0 = r0.headers.getSetCookie ? r0.headers.getSetCookie() : [];
    for (const [k, v] of parseSetCookies(sc0).entries()) jar.set(k, v);
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
          Cookie: jar.size > 0 ? serializeCookies(jar) : "",
        },
      }
    );
    const sc1 = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const [k, v] of parseSetCookies(sc1).entries()) jar.set(k, v);
    return { status: res.status, cookies: Object.fromEntries(jar) };
  }
  function cookieHeader() {
    return serializeCookies(jar);
  }
  function mergeResponseCookies(response) {
    const newCookies = response.headers.getSetCookie
      ? response.headers.getSetCookie()
      : [];
    if (newCookies.length === 0) return;
    const parsed = parseSetCookies(newCookies);
    for (const [k, v] of parsed.entries()) jar.set(k, v);
  }
  return { init, cookieHeader, mergeResponseCookies };
}

async function callDetail(session, { caseNumber, courtCode, itemSequence }) {
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
        Cookie: session.cookieHeader(),
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
  session.mergeResponseCookies(res);
  const text = await res.text();
  return { status: res.status, ok: res.ok, body: text };
}

function summarizeKeys(obj, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return "...";
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[] (empty array)";
    return `[${obj.length} items, first: ${summarizeKeys(obj[0], depth + 1, maxDepth)}]`;
  }
  if (obj && typeof obj === "object") {
    const keys = Object.keys(obj);
    const out = {};
    for (const k of keys) {
      const v = obj[k];
      if (v === null) out[k] = "null";
      else if (typeof v === "string") {
        out[k] = v.length > 80 ? `"${v.slice(0, 80)}..."` : `"${v}"`;
      } else if (typeof v === "number" || typeof v === "boolean") {
        out[k] = String(v);
      } else if (Array.isArray(v)) {
        out[k] = summarizeKeys(v, depth + 1, maxDepth);
      } else if (typeof v === "object") {
        out[k] = summarizeKeys(v, depth + 1, maxDepth);
      }
    }
    return out;
  }
  return typeof obj;
}

async function probe(caseNumber, courtCode, label) {
  console.log(`\n========== ${label} (${caseNumber} @ ${courtCode}) ==========`);
  const session = createSession();
  const initResult = await session.init();
  console.log(`[session] init status=${initResult.status} cookies=${Object.keys(initResult.cookies).join(",")}`);

  // 사건 detail = item_sequence 1 + 2 시도 (멀티 물건 사건 검수)
  for (const seq of [1, 2]) {
    try {
      const { status, ok, body } = await callDetail(session, {
        caseNumber,
        courtCode,
        itemSequence: seq,
      });
      console.log(`\n--- detail itemSequence=${seq} HTTP ${status} ok=${ok} ---`);
      if (!ok) {
        console.log(`body preview: ${body.slice(0, 400)}`);
        continue;
      }
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        console.log(`JSON parse 실패: ${e.message}`);
        console.log(`body preview: ${body.slice(0, 400)}`);
        continue;
      }
      console.log(`response.status: ${json.status}`);
      console.log(`response.message: ${json.message ?? "(empty)"}`);
      console.log(`response.errors: ${JSON.stringify(json.errors ?? null)}`);
      console.log(`data top-level keys: ${json.data ? Object.keys(json.data).join(", ") : "(no data)"}`);
      if (json.data?.dma_result) {
        const dmaKeys = Object.keys(json.data.dma_result);
        console.log(`dma_result keys (${dmaKeys.length}): ${dmaKeys.join(", ")}`);
      }
      // 핵심 field 확인: 매각일 / 감정가 / 최저가 / 주소
      console.log(`\n[핵심 field 검수 paradigm]`);
      const result = json.data?.dma_result;
      if (result) {
        // 사진 list
        if (Array.isArray(result.csPicLst)) {
          console.log(`  csPicLst: ${result.csPicLst.length} 사진`);
        }
        // 텍스트 field 후보
        const candidates = [
          "csTit", "csTitNm", "caseHisNm", "dpslGdsCsNm",
          "csNo", "srnSaNo", "saNo",
          "maeGiil", "maeHh1", "maegyuljGiil",
          "gamevalAmt", "minmaePrice", "notifyMinmaePrice1", "notifyMinmaePriceRate1",
          "yuchalCnt", "flbdNcnt",
          "printSt", "hjguSido", "hjguSigu", "hjguDong", "daepyoLotno", "buldNm",
          "areaList", "maxArea", "minArea",
          "dspslUsgNm", "jimokList",
          "jpDeptNm", "tel", "maePlace",
          "mulStatcd", "jinstatCd", "mulJinYn",
          "wgs84Xcordi", "wgs84Ycordi",
        ];
        for (const key of candidates) {
          if (key in result) {
            const v = result[key];
            const display = typeof v === "string" && v.length > 50
              ? `"${v.slice(0, 50)}..."` : JSON.stringify(v);
            console.log(`  ${key}: ${display}`);
          }
        }
        // array field (사건 진행 / 매각 list / 임차권 등)
        for (const [k, v] of Object.entries(result)) {
          if (Array.isArray(v) && v.length > 0 && k !== "csPicLst") {
            console.log(`  [array] ${k}: ${v.length} items, first keys: ${typeof v[0] === "object" ? Object.keys(v[0]).slice(0, 10).join(",") : typeof v[0]}`);
          }
        }
      }
    } catch (e) {
      console.log(`probe seq=${seq} 예외: ${e.message}`);
    }
  }
}

async function main() {
  // 매각일 2주 윈도우 밖 (532249 / 매각일 2026-06-29)
  await probe("2024타경532249", "B000240", "2주 윈도우 밖 사건");

  // 다른 윈도우 밖 사건 (필요 시 추가)
  // 매각일 2주 윈도우 안 사건 (실제 진행 사건 1건 — 형준님 검수 의무)
  // (이미지 1 search 결과 안 등장 사건 = 559336 / 540431 가정 — 검증 필요)
  await probe("2024타경559336", "B000240", "윈도우 안 사건 후보 A");
  await probe("2024타경540431", "B000240", "윈도우 안 사건 후보 B");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
