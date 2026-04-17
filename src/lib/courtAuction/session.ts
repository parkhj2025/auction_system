/**
 * 대법원 경매정보 사이트 세션 관리 (TypeScript 포팅).
 *
 * 원본: scripts/crawler/session.mjs (2026-04-15, Stage 1 검증 완료)
 * 로직 100% 동일, 타입만 추가.
 */

import { COURT_AUCTION } from "./codes";

/** Set-Cookie 헤더 → key=value Map. attribute(path/expires 등)는 무시. */
function parseSetCookies(headers: string[]): Map<string, string> {
  const jar = new Map<string, string>();
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

function serializeCookies(jar: Map<string, string>): string {
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export interface SessionInitResult {
  status: number;
  cookies: Record<string, string>;
}

export function createSession() {
  const jar = new Map<string, string>();

  async function init(): Promise<SessionInitResult> {
    const commonHeaders = {
      "User-Agent": COURT_AUCTION.USER_AGENT,
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua":
        '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Upgrade-Insecure-Requests": "1",
    };

    // Step 1: GET / (메인 페이지)
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
    for (const [k, v] of parseSetCookies(sc0).entries()) {
      jar.set(k, v);
    }

    await new Promise((r) => setTimeout(r, 2000));

    // Step 2: GET /pgj/index.on (WebSquare 초기화)
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

    if (!res.ok) {
      throw new Error(
        `Session init failed: HTTP ${res.status} ${res.statusText}`
      );
    }

    const setCookieHeaders = res.headers.getSetCookie
      ? res.headers.getSetCookie()
      : [];
    for (const [k, v] of parseSetCookies(setCookieHeaders).entries()) {
      jar.set(k, v);
    }

    return {
      status: res.status,
      cookies: Object.fromEntries(jar),
    };
  }

  function cookieHeader(): string {
    if (jar.size === 0) {
      throw new Error("Session not initialized. Call init() first.");
    }
    return serializeCookies(jar);
  }

  function mergeResponseCookies(response: Response): void {
    const newCookies = response.headers.getSetCookie
      ? response.headers.getSetCookie()
      : [];
    if (newCookies.length === 0) return;
    const parsed = parseSetCookies(newCookies);
    for (const [k, v] of parsed.entries()) {
      jar.set(k, v);
    }
  }

  return { init, cookieHeader, mergeResponseCookies };
}
