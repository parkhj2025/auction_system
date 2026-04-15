/**
 * 대법원 경매정보 사이트 세션 관리.
 *
 * 확인된 사실 (2026-04-15 PoC):
 * - 단일 GET /pgj/index.on?w2xPath=... 호출로 WMONID 쿠키 획득 가능
 * - 이 WMONID + 요청 시 필요한 헤더 조합만으로 searchControllerMain.on POST 성공
 * - captured cookies 없이 fresh session에서 WAF ipcheck: true 통과 확인
 *
 * 이 모듈은 자체 쿠키 jar를 메모리에 유지하며 필요 시 재초기화한다.
 */

import { SEARCH_API_CONSTANTS } from "./codes.mjs";

const { BASE_URL, INIT_ENDPOINT, USER_AGENT } = SEARCH_API_CONSTANTS;

/**
 * Set-Cookie 헤더 배열을 파싱해 key=value 조합으로 반환.
 * 단순 파싱 — path/expires/samesite 같은 attribute는 무시.
 */
function parseSetCookies(setCookieHeaders) {
  const jar = new Map();
  for (const raw of setCookieHeaders) {
    // 첫 번째 ;까지가 name=value, 그 뒤는 attribute
    const firstSemi = raw.indexOf(";");
    const pair = firstSemi >= 0 ? raw.slice(0, firstSemi) : raw;
    const eq = pair.indexOf("=");
    if (eq < 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (name) jar.set(name, value);
  }
  return jar;
}

/**
 * Map → "key1=value1; key2=value2" 문자열
 */
function serializeCookies(jar) {
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

/**
 * 세션 객체를 생성·관리하는 팩토리.
 * 반환된 객체는 `cookieHeader()` 메서드로 현재 쿠키 문자열을 제공.
 */
export function createSession() {
  let jar = new Map();
  let initializedAt = null;

  async function init() {
    const res = await fetch(`${BASE_URL}${INIT_ENDPOINT}`, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Session init failed: HTTP ${res.status} ${res.statusText}`
      );
    }

    // Node fetch는 set-cookie를 배열로 getSetCookie()로 제공 (Node 18.14+)
    const setCookieHeaders = res.headers.getSetCookie
      ? res.headers.getSetCookie()
      : res.headers.raw?.()?.["set-cookie"] ?? [];

    jar = parseSetCookies(setCookieHeaders);
    initializedAt = Date.now();

    return {
      status: res.status,
      cookies: Object.fromEntries(jar),
    };
  }

  function cookieHeader() {
    if (jar.size === 0) {
      throw new Error("Session not initialized. Call init() first.");
    }
    return serializeCookies(jar);
  }

  function age() {
    if (!initializedAt) return Infinity;
    return Date.now() - initializedAt;
  }

  /**
   * 세션이 너무 오래되면 재초기화. 기본 15분 TTL (JSESSIONID 기본값과 유사).
   */
  async function ensureFresh(ttlMs = 15 * 60 * 1000) {
    if (jar.size === 0 || age() > ttlMs) {
      await init();
    }
  }

  /**
   * Set-Cookie 응답을 쿠키 jar에 병합 (POST 응답에서 WMONID 갱신 등).
   */
  function mergeResponseCookies(response) {
    const newCookies = response.headers.getSetCookie
      ? response.headers.getSetCookie()
      : [];
    if (newCookies.length === 0) return;
    const parsed = parseSetCookies(newCookies);
    for (const [k, v] of parsed.entries()) {
      jar.set(k, v);
    }
  }

  return {
    init,
    cookieHeader,
    age,
    ensureFresh,
    mergeResponseCookies,
    hasCookies: () => jar.size > 0,
  };
}
