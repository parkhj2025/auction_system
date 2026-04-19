/**
 * 서버 사이드 날짜/시간 유틸 — **모든 함수 Asia/Seoul 기준**.
 *
 * 사용 원칙:
 * - 서버 사이드(Vercel Edge/Node)에서 `new Date().toISOString()` 직접 호출 금지.
 *   기본 UTC라 한국 새벽 0~9시 KST 접수 시 전날 날짜로 기록되는 버그 발생.
 * - 모든 createdAt, 작성일, 시각 비교는 이 모듈의 함수만 사용.
 * - 입력 ISO의 타임존(UTC / +09:00 / 기타) 무관 항상 KST 기준 출력.
 *   호출자가 입력 포맷을 의식할 필요 없음 (단일 흐름 원칙).
 */

const KST_TZ = "Asia/Seoul";

function partsToMap(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of parts) out[p.type] = p.value;
  return out;
}

/**
 * 현재 시각 기준 Asia/Seoul 날짜를 YYYY-MM-DD로 반환.
 * 예: KST 2026-04-19 02:00 → "2026-04-19"
 */
export function getKSTDateIso(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const m = partsToMap(fmt.formatToParts(new Date()));
  return `${m.year}-${m.month}-${m.day}`;
}

/**
 * 현재 시각 기준 Asia/Seoul 일시를 ISO 유사 형식(+09:00 offset 명시)으로 반환.
 * 예: "2026-04-19T11:30:00+09:00"
 *
 * Date 객체 직렬화가 아닌 KST 벽시계 기준 문자열을 직접 구성하므로,
 * 다른 타임존 환경(UTC 서버 등)에서도 결과가 동일.
 */
export function getKSTDateTimeIso(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const m = partsToMap(fmt.formatToParts(new Date()));
  // hour가 "24"로 나올 수 있는 엣지 케이스 보정
  const hour = m.hour === "24" ? "00" : m.hour;
  return `${m.year}-${m.month}-${m.day}T${hour}:${m.minute}:${m.second}+09:00`;
}

/**
 * 입력 ISO 문자열을 Asia/Seoul 기준 한글 표기로 변환.
 * 입력이 UTC ("...Z"), +09:00, 무 타임존 무관 항상 KST 기준 출력.
 * 예:
 *   formatKSTDate("2026-04-19T17:00:00.000Z") → "2026년 04월 20일"
 *   formatKSTDate("2026-04-19T00:00:00+09:00") → "2026년 04월 19일"
 *   formatKSTDate("2026-04-19") → "2026년 04월 19일"
 *
 * 파싱 실패 시 입력값을 그대로 반환 (호출자가 비-ISO 문자열을 넘긴 경우 대비).
 */
export function formatKSTDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const m = partsToMap(fmt.formatToParts(d));
  return `${m.year}년 ${m.month}월 ${m.day}일`;
}
