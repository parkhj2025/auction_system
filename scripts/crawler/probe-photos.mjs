/**
 * probe-photos.mjs — selectPicInf.on API PoC
 *
 * 목적: 사진 API의 정확한 페이로드 구조와 응답 형식을 확정한다.
 * Stage 2A 작업 0. 성공하면 작업 1(사진 페처 TS 포팅)으로 진행.
 *
 * 사용법:
 *   node --env-file=.env.local scripts/crawler/probe-photos.mjs
 *
 * 선행 조건:
 *   - court_listings 테이블에 데이터 존재
 *   - .env.local에 NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import { createSession } from "./session.mjs";
import { callSearch } from "./api.mjs";
import { SEARCH_API_CONSTANTS } from "./codes.mjs";

const { BASE_URL, USER_AGENT } = SEARCH_API_CONSTANTS;

// 사진 API 엔드포인트 (2026-04-15 리버스 엔지니어링)
const PHOTO_ENDPOINT = "/pgj/pgj15B/selectPicInf.on";

// 테스트 대상: 2026-04-20 입찰일 실제 활성 사건
const TEST_DOCID = "B0002402023013054705311";
const TEST_INTERNAL_CASE_NO = "20230130547053";
const TEST_CASE_DISPLAY = "2023타경547053";
const TEST_COURT_CODE = "B000240";

async function probePhotos() {
  console.log("=== selectPicInf.on PoC 시작 ===\n");

  // 1. 세션 획득
  console.log("[1] 세션 초기화...");
  const session = createSession();
  const initResult = await session.init();
  console.log(`    쿠키: ${Object.keys(initResult.cookies).join(", ")}`);
  console.log(`    상태: HTTP ${initResult.status}\n`);

  // 2. 검색 API로 사건 조회 (세션 컨텍스트 활성화)
  console.log("[2] 검색 API로 사건 컨텍스트 활성화...");
  try {
    const today = new Date();
    const bidStart = today.toISOString().slice(0, 10).replace(/-/g, "");
    const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const bidEnd = futureDate.toISOString().slice(0, 10).replace(/-/g, "");

    const searchResult = await callSearch(session, {
      courtCode: TEST_COURT_CODE,
      bidStart,
      bidEnd,
      pageNo: 1,
      pageSize: 1,
      caseNumber: TEST_CASE_DISPLAY,
    });
    const hits = searchResult.data?.dlt_srchResult?.length ?? 0;
    console.log(`    검색 결과: ${hits}건`);
    if (hits > 0) {
      const first = searchResult.data.dlt_srchResult[0];
      console.log(`    첫 건 docid: ${first.docid}`);
      console.log(`    첫 건 saNo: ${first.saNo}`);
    }
  } catch (err) {
    console.log(`    검색 실패 (무시하고 진행): ${err.message}`);
  }

  await new Promise((r) => setTimeout(r, 2000));

  // 3. 사진 API 호출 — 페이로드 구조 탐색
  // Round 3: 검색 API 호출 후 세션 컨텍스트가 활성화된 상태에서 시도
  const payloads = [
    {
      name: "시도 H: 검색 후 cortOfcCd + saNo",
      body: {
        dma_srchPicInf: {
          cortOfcCd: TEST_COURT_CODE,
          saNo: TEST_INTERNAL_CASE_NO,
        },
      },
    },
    {
      name: "시도 I: 검색 후 saNo만",
      body: {
        dma_srchPicInf: {
          saNo: TEST_INTERNAL_CASE_NO,
        },
      },
    },
    {
      name: "시도 J: 검색 후 srnSaNo + cortOfcCd",
      body: {
        dma_srchPicInf: {
          cortOfcCd: TEST_COURT_CODE,
          saNo: TEST_CASE_DISPLAY,
        },
      },
    },
    {
      name: "시도 K: 상세보기 Referer + cortOfcCd + saNo",
      referer: `${BASE_URL}/pgj/index.on?w2xPath=/pgj/ui/pgj150/PGJ151F01.xml`,
      body: {
        dma_srchPicInf: {
          cortOfcCd: TEST_COURT_CODE,
          saNo: TEST_INTERNAL_CASE_NO,
        },
      },
    },
    {
      name: "시도 L: cortOfcCd + saNo + maemulSer + mokmulSer + docid",
      body: {
        dma_srchPicInf: {
          cortOfcCd: TEST_COURT_CODE,
          saNo: TEST_INTERNAL_CASE_NO,
          maemulSer: "1",
          mokmulSer: "1",
          docid: TEST_DOCID,
        },
      },
    },
    {
      name: "시도 M: pgmId 추가",
      body: {
        dma_srchPicInf: {
          cortOfcCd: TEST_COURT_CODE,
          saNo: TEST_INTERNAL_CASE_NO,
          pgmId: "PGJ151F01",
        },
      },
    },
  ];

  const submissionIds = [
    "mf_wfm_mainFrame_sbm_selectPicInf",
  ];

  for (const payload of payloads) {
    for (const subId of submissionIds) {
      console.log(`[2] ${payload.name} / submissionid="${subId || "(없음)"}"...`);

      try {
        const referer = payload.referer || `${BASE_URL}/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ151F00.xml`;
        const headers = {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          Origin: BASE_URL,
          Referer: referer,
          "SC-Userid": "SYSTEM",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Cookie: session.cookieHeader(),
        };

        if (subId) {
          headers.submissionid = subId;
        }

        const res = await fetch(`${BASE_URL}${PHOTO_ENDPOINT}`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload.body),
        });

        session.mergeResponseCookies(res);

        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          console.log(`    HTTP ${res.status} — JSON 파싱 실패`);
          console.log(`    응답 첫 300자: ${text.slice(0, 300)}`);
          console.log();
          continue;
        }

        console.log(`    HTTP ${res.status}`);
        console.log(`    status: ${json.status}`);
        console.log(`    message: ${json.message}`);
        console.log(`    errors: ${JSON.stringify(json.errors)}`);

        if (json.data) {
          const dataKeys = Object.keys(json.data);
          console.log(`    data keys: [${dataKeys.join(", ")}]`);

          // 사진 배열 찾기
          for (const key of dataKeys) {
            const val = json.data[key];
            if (Array.isArray(val)) {
              console.log(`    ${key}: Array(${val.length})`);
              if (val.length > 0) {
                const firstItem = val[0];
                const itemKeys = Object.keys(firstItem);
                console.log(`      첫 번째 항목 keys: [${itemKeys.join(", ")}]`);
                // base64 데이터가 있으면 길이만 표시
                for (const ik of itemKeys) {
                  const iv = firstItem[ik];
                  if (typeof iv === "string" && iv.length > 200) {
                    console.log(`      ${ik}: (string, ${iv.length} chars — base64?)`);
                  } else {
                    console.log(`      ${ik}: ${JSON.stringify(iv)}`);
                  }
                }

                // 성공! 첫 번째 사진을 파일로 저장
                const base64Field = itemKeys.find(
                  (k) => typeof firstItem[k] === "string" && firstItem[k].length > 1000
                );
                if (base64Field) {
                  const fs = await import("node:fs");
                  const buffer = Buffer.from(firstItem[base64Field], "base64");
                  const outPath = "scripts/crawler/probe-photo-sample.jpg";
                  fs.writeFileSync(outPath, buffer);
                  console.log(`\n    ✅ 사진 저장 성공: ${outPath} (${buffer.length} bytes)`);
                }

                console.log("\n=== PoC 성공! 페이로드 구조 확정 ===");
                console.log(`페이로드: ${JSON.stringify(payload.body, null, 2)}`);
                console.log(`submissionid: "${subId}"`);
                console.log(`사진 배열 키: ${key}`);
                console.log(`사진 수: ${val.length}`);
                console.log(`항목 필드: [${itemKeys.join(", ")}]`);
                return;
              }
            } else if (val && typeof val === "object" && !Array.isArray(val)) {
              console.log(`    ${key}: Object { ${Object.keys(val).join(", ")} }`);
            } else {
              console.log(`    ${key}: ${JSON.stringify(val)}`);
            }
          }
        }
        console.log();
      } catch (err) {
        console.log(`    에러: ${err.message}\n`);
      }

      // WAF 대비 1.5초 대기
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\n=== 모든 시도 실패. 추가 분석 필요. ===");
  process.exit(1);
}

probePhotos().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
