#!/usr/bin/env node
/**
 * Phase 7 — Cowork raw-content/{caseNumber}/ → content/analysis/{slug}.mdx 변환 CLI.
 * ----------------------------------------------------------------------------
 * 규격: docs/content-source-v3.md (v3.2)
 * 1차 원소스: meta.json
 * 2차 원소스: post.md (본문)
 *
 * 사용:
 *   pnpm publish 2024타경505827           # default (멱등 no-op or 신규)
 *   pnpm publish 2024타경505827 --force   # 기존 mdx 덮어쓰기 + updatedAt 갱신(today)
 *   pnpm publish 2024타경505827 --dry-run # 출력만, 파일 안 씀
 *   pnpm publish 2024타경505827 --verbose
 *
 * 종료 코드:
 *   0  성공 / dry-run / 멱등 no-op
 *   1  입력 검증 실패 (필수 파일 누락, slug 비-ASCII 등)
 *   2  콘텐츠 규칙 위반 (분류어, 내부분류필드, 네이버 리터럴, title 패턴 등)
 *   3  기존 mdx와 차이 발생, --force 없음
 *   4  파일 쓰기 실패
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import matter from "gray-matter";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const RAW_ROOT = path.join(REPO_ROOT, "raw-content");
const OUT_DIR = path.join(REPO_ROOT, "content/analysis");

/* ─── α: 시·도 → region 매핑 (CLI 내부 const) ─── */
const SIDO_TO_REGION = {
  "인천광역시": "incheon",
  "서울특별시": "seoul",
  "경기도": "gyeonggi",
  "부산광역시": "busan",
  "대구광역시": "daegu",
  "대전광역시": "daejeon",
  "광주광역시": "gwangju",
  "울산광역시": "ulsan",
  "세종특별자치시": "sejong",
  "강원특별자치도": "gangwon",
  "강원도": "gangwon",
  "충청북도": "chungbuk",
  "충청남도": "chungnam",
  "전북특별자치도": "jeonbuk",
  "전라북도": "jeonbuk",
  "전라남도": "jeonnam",
  "경상북도": "gyeongbuk",
  "경상남도": "gyeongnam",
  "제주특별자치도": "jeju",
};

/* ─── PropertyType / AuctionType 정규화 (AnalysisFrontmatter enum 호환) ─── */
const PROPERTY_TYPE_NORMALIZE = {
  "오피스텔(주거)": "오피스텔",
  "오피스텔(업무)": "오피스텔",
  "도시형생활주택": "오피스텔",
  "주상복합": "아파트",
};
const PROPERTY_TYPE_VALID = new Set([
  "아파트", "다세대주택", "빌라", "오피스텔",
  "단독주택", "토지", "상가", "공장", "기타",
]);

const AUCTION_TYPE_NORMALIZE = {
  "임의경매": "임의경매",
  "강제경매": "강제경매",
  "청산을위한형식적경매": "임의경매",
  "공유물분할을위한경매": "임의경매",
  "유치권에의한경매": "임의경매",
};

/* ─── 콘텐츠 검증 룰 (v3 §7 / §10-2) ─── */
const FORBIDDEN_WORDS = [
  "학습용", "교육 사례", "안전 사례", "위험 물건", "투자 매력", "적합한",
  "실습용", "추천", "주의 물건", "초보 추천", "교훈", "배울 수 있는",
];

/**
 * v3.4 §10-7 — published_at / updatedAt ISO timestamp 정규화.
 *  - "YYYY-MM-DD" → 그대로
 *  - "YYYY-MM-DD..." (ISO timestamp 등) → slice(0, 10)
 *  - 그 외(예외) → 그대로 통과 (위반은 내용 검증으로 후속 처리)
 */
function normalizeDate(v) {
  if (typeof v !== "string") return v;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/^\d{4}-\d{2}-\d{2}.+$/.test(v)) return v.slice(0, 10);
  return v;
}

/* ─── argv ─── */
function parseArgs(argv) {
  const a = {
    caseNumber: null,
    all: false,
    force: false,
    dryRun: false,
    verbose: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--force") a.force = true;
    else if (v === "--all") a.all = true;
    else if (v === "--dry-run") a.dryRun = true;
    else if (v === "--verbose" || v === "-v") a.verbose = true;
    else if (v === "--help" || v === "-h") { printHelp(); process.exit(0); }
    else if (!v.startsWith("--") && !a.caseNumber) a.caseNumber = v;
  }
  return a;
}
function printHelp() {
  console.log(`pnpm run publish <caseNumber> [--force] [--dry-run] [--verbose]
pnpm run publish --all      # raw-content/ 하위 사건 디렉토리 전체 일괄

slug = raw-content 디렉토리명 그대로 (단계 3-5-fix). 분류 부호 가정 0.
입력: raw-content/{caseNumber}/  (meta.json · post.md · data/)
출력: content/analysis/{slug}.mdx + {slug}.meta.json

콘텐츠 2차 감시 (단계 4-2):
  Gemini 3.1 Pro 자체 판단으로 5 책임 통합 (1회 호출):
    1) 정합성 (한 줄 요약 ↔ 표 ↔ 산문)
    2) 데이터 누락 보강 (frontmatter 빈 필드 본문에서 추출)
    3) 어휘 순화 (비표준 전문용어 → 일반어)
    4) 표·산문·frontmatter 일관성
    5) 금지 어휘 검증 (분류·판정 어휘 + 데이터 처리 어휘)
  GEMINI_API_KEY 환경변수 필수 (.env.local).
  thinking_level=high + responseSchema 강제 JSON.
  LLM 호출 실패 시 종료 코드 1 (재시도 0).

옵션:
  --all       raw-content 하위 사건 디렉토리 전부 일괄 publish
  --force     기존 mdx 덮어쓰기 + updatedAt today (정합성과 무관)
  --dry-run   파일 쓰지 않음 (검증·매핑만)
  --verbose   상세 로그`);
}

/* ─── §2-2: raw-content 하위 사건 디렉토리 스캔 (단계 3-5-fix) ─── */
function scanCaseDirs() {
  if (!fs.existsSync(RAW_ROOT)) return [];
  return fs
    .readdirSync(RAW_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

/* ─── §1: 입력 검증 (v3.3 — pdf_text·images/photos 선택) ─── */
function validateInput(rawDir) {
  const required = [
    "meta.json",
    "post.md",
    "data/crawler_summary.json",
    "data/photos_meta.json",
  ];
  const optional = ["data/pdf_text.txt", "images/photos"];
  const missing = required.filter((p) => !fs.existsSync(path.join(rawDir, p)));
  const optionalMissing = optional.filter(
    (p) => !fs.existsSync(path.join(rawDir, p))
  );
  return { ok: missing.length === 0, missing, optionalMissing };
}

/* ─── §2: slug — raw-content 디렉토리명 그대로 (단계 3-5-fix)
 *  사건 분류 부호("타경"/"타기" 등) 가정 0. 정규식 매칭 0.
 *  Next.js dynamic route 가 한글·숫자·특수문자 자동 처리 (URL 인코딩은 브라우저가 담당). */
function deriveSlug(caseNumber) {
  return caseNumber;
}

/* ─── §3: frontmatter (meta.json → AnalysisFrontmatter) ─── */
function buildFrontmatter(meta, slug, opts) {
  const property = meta.property ?? {};
  const price = meta.price ?? {};
  const md = meta.market_data ?? {};
  const seo = meta.seo ?? {};
  const card = meta.card ?? {};
  const hero = meta.hero ?? {};

  const rawType = property.type ?? "";
  const propertyType = PROPERTY_TYPE_NORMALIZE[rawType] ?? rawType;
  if (!PROPERTY_TYPE_VALID.has(propertyType)) {
    throw new Error(`Unsupported propertyType: "${rawType}" → "${propertyType}"`);
  }
  // v2.6.2 schema 호환: auction_type 누락 시 "임의경매" 기본값 (Cowork 영역 영향 0)
  const rawAuction = property.auction_type ?? "";
  let auctionType = AUCTION_TYPE_NORMALIZE[rawAuction];
  if (!auctionType) {
    if (!rawAuction) {
      console.warn(`  · property.auction_type 누락 — "임의경매" 기본값 적용`);
      auctionType = "임의경매";
    } else {
      throw new Error(`Unsupported auctionType: "${rawAuction}"`);
    }
  }
  const sido = property.sido ?? "";
  const region = SIDO_TO_REGION[sido];
  if (!region) {
    throw new Error(`Unknown sido for region mapping: "${sido}"`);
  }

  const buildingName = property.building
    ? `${property.name ?? ""} ${property.building}`.trim()
    : property.name ?? undefined;

  const tags = (card.tags ?? seo.tags ?? []).filter(Boolean);
  const seoTags = (seo.seo_tags ?? card.seo_tags ?? []).filter(Boolean);
  const coverImage = hero.image_url ?? card.cover_image ?? "";

  // v3.3 표준 우선, 베타 1호 패턴(avg_*) fallback
  const marketData = {
    avgSalePrice: md.sale_avg ?? md.avg_sale_price,
    saleCount: md.sale_count,
    avgLeasePrice: md.lease_avg ?? md.avg_lease_deposit,
    leaseCount: md.lease_count,
    avgRentDeposit: md.rent_deposit_avg ?? md.avg_rent_deposit,
    avgRentMonthly: md.rent_avg ?? md.avg_rent_monthly,
    rentCount: md.rent_count,
    source: "네○○ 부동산",
  };
  // undefined 값 제거 (matter.stringify가 null로 직렬화하는 것을 회피)
  for (const k of Object.keys(marketData)) {
    if (marketData[k] === undefined) delete marketData[k];
  }

  // v3.4 §10-7: title 우선순위 — hero.headline ?? card.title ?? ""
  // (hero.headline이 v2.5 카피 표준 위치. card.title은 archive 패턴일 수 있음)
  const title = hero.headline ?? card.title ?? "";

  // v3.4 §10-7: archive_* 필드 명시 폐기 — hero.archive_headline,
  // hero.archive_sub_headline, frontmatter archive_title은 매핑에 포함하지 않음.
  // (post.md frontmatter는 §4-3로 이미 무시. 여기서는 hero.archive_* 명시 제외.)

  // v3.4 §10-7: published_at ISO normalize
  const publishedAt = normalizeDate(meta.published_at ?? "");

  // undefined 필드는 직렬화 시 제외되도록 명시적으로 빼기
  const fm = {
    type: "analysis",
    slug,
    title,
    summary: card.summary ?? "",
    region,
    court: meta.court ?? "",
    ...(meta.court_division ? { courtDivision: meta.court_division } : {}),
    caseNumber: meta.case_number ?? "",
    appraisal: price.appraisal ?? 0,
    minPrice: price.min_price ?? 0,
    // v2.6.2 schema 호환: round/rate (567436) || bid_round/min_rate (legacy)
    round: price.round ?? price.bid_round ?? 0,
    percent: price.rate ?? price.min_rate ?? 0,
    bidDate: meta.bid_date ?? "",
    ...(meta.bid_time ? { bidTime: meta.bid_time } : {}),
    address: property.address ?? "",
    ...(property.sido ? { sido: property.sido } : {}),
    ...(property.sigungu ? { sigungu: property.sigungu } : {}),
    ...(property.dong ? { dong: property.dong } : {}),
    ...(buildingName ? { buildingName } : {}),
    ...(property.ho ? { ho: property.ho } : {}),
    propertyType,
    auctionType,
    // v2.6.2 schema 호환: area_m2/pyeong (567436) || building_area_m2/pyeong (legacy)
    areaM2: property.area_m2 ?? property.building_area_m2 ?? 0,
    areaPyeong: property.area_pyeong ?? property.building_area_pyeong ?? 0,
    ...(property.land_area_m2 != null ? { landAreaM2: property.land_area_m2 } : {}),
    ...(property.land_area_pyeong != null ? { landAreaPyeong: property.land_area_pyeong } : {}),
    ...(price.appraisal_display ? { appraisalDisplay: price.appraisal_display } : {}),
    ...(price.min_price_display ? { minPriceDisplay: price.min_price_display } : {}),
    tags,
    seoTags,
    coverImage,
    publishedAt,
    updatedAt: normalizeDate(opts.updatedAt),
    status: "published",
    marketData,
  };
  return fm;
}

/* ─── §4: 본문 처리 (v3.3 — post.md frontmatter 무시, 절대 URL 통과, used fallback) ─── */
function transformBody(postRaw, photosMeta, title) {
  // v3.3 §4-3: post.md frontmatter는 무시, 본문만 사용
  const parsed = matter(postRaw);
  let body = parsed.content;

  // 단계 4-1: 시나리오 C 라벨 정규화 (in-memory, raw-content 무수정).
  // "### 시나리오 C\n1 — 전세 갭투자" → "### 시나리오 C-1 전세 갭투자"
  // "### 시나리오 C\n2 — 월세 운용"   → "### 시나리오 C-2 월세 운용"
  body = body.replace(
    /^###\s+시나리오\s+C\s*\r?\n([12])\s*[—\-–]\s*(.+?)\s*$/gm,
    (_m, num, label) => `### 시나리오 C-${num} ${label.trim()}`
  );

  // H1 자동 주입 (없을 때만)
  const head = body.trimStart();
  const hasH1 = /^#\s+/.test(head);
  if (!hasH1 && title) {
    body = `# ${title}\n\n${head}`;
  }

  const urlMap = photosMeta?.url_map ?? {};
  const used = Array.isArray(photosMeta?.used) ? photosMeta.used : [];

  // used 배열에서 파일명 → URL 매핑을 보조 룩업으로 구성 (베타 2호 호환)
  // used 항목이 객체({filename, url}) 또는 URL 문자열, 파일명 문자열 등 다양할 수 있음.
  const usedLookup = {};
  for (const u of used) {
    if (typeof u === "string") {
      // URL 문자열이면 파일명 추출 (마지막 segment)
      const slash = u.lastIndexOf("/");
      const fname = slash >= 0 ? u.slice(slash + 1) : u;
      usedLookup[fname] = u;
    } else if (u && typeof u === "object") {
      const fname = u.filename ?? u.name ?? u.file;
      const url = u.url ?? u.public_url ?? u.src;
      if (fname && url) usedLookup[fname] = url;
    }
  }

  // 상대경로 치환: ![alt](images/photos/{filename}) → 절대 URL
  // v3.3: 본문이 이미 절대 URL이면 정규식 매칭 0건이라 no-op (의도된 통과)
  let missingCount = 0;
  body = body.replace(
    /!\[([^\]]*)\]\(images\/photos\/([^)]+)\)/g,
    (m, alt, filename) => {
      const u = urlMap[filename] ?? usedLookup[filename];
      if (!u) {
        missingCount++;
        console.warn(
          `  ⚠ photos 매핑 누락: images/photos/${filename} → 원본 경로 유지`
        );
        return m;
      }
      return `![${alt}](${u})`;
    }
  );
  if (missingCount > 0) {
    console.warn(`  ⚠ 총 ${missingCount}건의 photos 매핑 누락 (원본 유지)`);
  }

  // v3.5 §7-3: "네이버" 리터럴 자동 마스킹.
  // abort 정책 폐기. /네이버/g → "네○○" 전역 치환.
  // 이미 마스킹된 "네○○"·"네ㅇㅇ"는 영향 없음.
  let maskedCount = 0;
  body = body.replace(/네이버/g, () => {
    maskedCount++;
    return "네○○";
  });
  if (maskedCount > 0) {
    console.log(`  · "네이버" 리터럴 ${maskedCount}건 자동 마스킹 → "네○○"`);
  }

  return body;
}

/* ─── §6: 콘텐츠 룰 검증 ─── */
function runContentChecks(meta, body) {
  const errors = [];

  const stringsToCheck = [
    meta.card?.title,
    meta.card?.summary,
    meta.hero?.headline,
    meta.hero?.sub_headline,
    ...Object.values(meta.sections ?? {}).flatMap((s) => [s?.title, s?.summary]),
    body,
  ].filter((s) => typeof s === "string");

  for (const s of stringsToCheck) {
    for (const w of FORBIDDEN_WORDS) {
      if (s.includes(w)) errors.push(`forbidden word "${w}"`);
    }
    // v3.5 §7-3: "네이버" 리터럴 abort 폐기. transformBody에서 자동 마스킹.
  }

  if ("category" in meta) errors.push("forbidden field: meta.category");
  if ("riskLevel" in meta) errors.push("forbidden field: meta.riskLevel");

  for (const t of (meta.card?.tags ?? [])) {
    if (typeof t !== "string") errors.push(`card.tags must be string[], got ${typeof t}`);
  }
  for (const t of (meta.seo?.tags ?? [])) {
    if (typeof t !== "string") errors.push(`seo.tags must be string[], got ${typeof t}`);
  }

  const title = meta.card?.title ?? meta.hero?.headline ?? "";
  if (title.startsWith("[오늘의 무료 물건분석]")) {
    errors.push("forbidden title prefix");
  }
  if (meta.case_number && title.endsWith(`· ${meta.case_number}`)) {
    errors.push(`forbidden title suffix "· ${meta.case_number}"`);
  }

  return [...new Set(errors)];
}

/* ─── 직렬화 ─── */
function serializeMdx(frontmatter, body) {
  return matter.stringify(body, frontmatter);
}

/* ─── §10-X: 콘텐츠 2차 감시자 — Gemini 3.1 Pro (v4.0, 단계 4-2)
 *
 *  배경: 단계 3-5-fix-4 의 시나리오별 4회 호출 폐기. Gemini 책임을 "콘텐츠 2차 감시자"
 *       로 확장 — 본문 전체 1회 호출로 5 책임 통합.
 *  책임 5건: 정합성 / 데이터 누락 보강 / 어휘 순화 / 표·산문·frontmatter 일관성 / 금지 어휘 검증
 *  raw-content/post.md 무수정 — 치환은 publishOne 의 mdx 생성 시점 in-memory 만.
 */

const GEMINI_MODEL = "gemini-3.1-pro-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CONTENT_SUPERVISOR_SYSTEM_PROMPT = `당신은 부동산 경매 분석 콘텐츠의 2차 감시자입니다.

입력으로 콘텐츠 본문 전체 + frontmatter (YAML→JSON) + 라우트 컨텍스트가 주어집니다.

판단 책임 5건 (모두 통합 수행):

[책임 1 — 정합성]
- 시나리오 섹션 (### 시나리오 X) 의 한 줄 요약 ↔ 표 ↔ 산문 숫자 일관성 점검
- 표가 우선 진실값. 한 줄 요약·산문이 어긋나면 표 값으로 통일
- 표 ↔ 산문 자체 어긋남이 발견되면 표 우선 + 산문 맥락 고려해 추론

[책임 2 — 데이터 누락 보강]
- frontmatter 의 빈 필드 (값 없음·null·빈 문자열) 를 본문에서 추출 가능한지 확인
- 본문에 명시된 정보로 빈 필드 채움 (예: 02 입찰 경과 표에서 "2차 2026-05-28" → frontmatter biddingDate 채움)
- 본문에 정보 부재 시 보강 금지 (허위 채움 절대 금지)
- 채움 가능 필드: 입찰일·전용면적·감정가·최저가·법원 정보·사건번호·소재지·물건종류·매각회차

[책임 3 — 어휘 순화]
- 부동산 일반 투자자가 잘 사용하지 않는 비표준 전문용어 식별
- 일반어로 치환 또는 자연스럽게 삭제
- 차단 예시: "양 스프레드" → "월 순현금흐름" 또는 표현 삭제 / "역마진" → "월세보다 이자가 큰 구조" / "역레버리지" → "수익률 마이너스 구조"
- 허용 어휘 (변경 금지): LTV, DSR, 갭투자, 매각가율, 근저당권, 말소기준등기, 임의경매, 강제경매, 공유자 우선매수권, 가처분, 임차인 대항력, 권리분석

[책임 4 — 표·산문·frontmatter 일관성]
- 동일 지표가 표·산문·frontmatter 에서 동일 값을 가져야 함
- 불일치 발견 시 표 우선 → 산문·frontmatter 에 정합화

[책임 5 — 금지 어휘 검증]
- 분류·판정 어휘 (위험·매력·함정·교훈·안전·적합한·교보재·투자매력) 본문 잔존 시 자연스럽게 삭제 또는 사실 기반 표현으로 교체
- 데이터 처리 어휘 (PDF 첨부·두인옥션·추출한·파싱한·원천 자료·data 폴더·백엔드·파이프라인) 잔존 시 삭제
- 위 어휘 신규 도입 절대 금지

산문 톤·문장 구조 유지. 단어·숫자·필드 값만 교체.

반환 형식 (JSON 단일 객체. 다른 텍스트·코드블록 0):
{
  "status": "pass" | "adjusted",
  "adjustedBody": "전체 본문 (수정 반영, status=adjusted 일 때만. status=pass 시 빈 문자열)",
  "adjustedFrontmatter": { ... } | null,
  "adjustments": [
    {
      "category": "consistency" | "missing_data" | "vocabulary" | "alignment" | "forbidden_term",
      "before": "...",
      "after": "...",
      "reason": "..."
    }
  ]
}

조정 0 건이면 status=pass, adjustedBody="", adjustedFrontmatter=null, adjustments=[].`;

const SUPERVISOR_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["pass", "adjusted"] },
    adjustedBody: { type: "string" },
    adjustedFrontmatter: {
      type: "object",
      properties: {},
      nullable: true,
    },
    adjustments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: [
              "consistency",
              "missing_data",
              "vocabulary",
              "alignment",
              "forbidden_term",
            ],
          },
          before: { type: "string" },
          after: { type: "string" },
          reason: { type: "string" },
        },
        required: ["category", "before", "after", "reason"],
      },
    },
  },
  required: ["status", "adjustedBody", "adjustments"],
};

/**
 * Gemini 호출 1회 — 본문 전체 + frontmatter 통합 감시.
 *  실패 시 throw — publishOne 이 fail-supervisor 로 종료.
 *  반환: { status, adjustedBody, adjustedFrontmatter, adjustments }
 */
async function supervisorContent({ body, frontmatter, slug, caseNumber }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY 환경변수가 설정되지 않았습니다. .env.local 에 추가하세요."
    );
  }

  const userMessage =
    `라우트 컨텍스트:\n` +
    `  caseNumber: ${caseNumber}\n` +
    `  slug: ${slug}\n\n` +
    `frontmatter (JSON):\n` +
    `${JSON.stringify(frontmatter, null, 2)}\n\n` +
    `본문 (post.md body):\n` +
    `${body}`;

  const reqBody = {
    systemInstruction: {
      parts: [{ text: CONTENT_SUPERVISOR_SYSTEM_PROMPT }],
    },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: {
      thinkingConfig: { thinkingLevel: "high" },
      responseMimeType: "application/json",
      responseSchema: SUPERVISOR_RESPONSE_SCHEMA,
    },
  };

  let res;
  try {
    res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
  } catch (e) {
    throw new Error(`Gemini supervisor 네트워크 오류: ${e.message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Gemini supervisor 호출 실패 (HTTP ${res.status}): ${text.slice(0, 500)}`
    );
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error(
      `Gemini supervisor 응답 형식 비정상: candidates[0].content.parts[0].text 누락`
    );
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `Gemini supervisor 응답에서 JSON 블록 0건: ${text.slice(0, 300)}`
    );
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(
      `Gemini supervisor JSON 파싱 실패 (${e.message}): ${jsonMatch[0].slice(0, 300)}`
    );
  }

  const status = parsed.status === "adjusted" ? "adjusted" : "pass";
  const adjustedBody =
    typeof parsed.adjustedBody === "string" ? parsed.adjustedBody : "";
  const adjustedFrontmatter =
    parsed.adjustedFrontmatter && typeof parsed.adjustedFrontmatter === "object"
      ? parsed.adjustedFrontmatter
      : null;
  const adjustments = Array.isArray(parsed.adjustments)
    ? parsed.adjustments
        .filter((a) => a && typeof a === "object")
        .map((a) => ({
          category: String(a.category ?? ""),
          before: String(a.before ?? ""),
          after: String(a.after ?? ""),
          reason: String(a.reason ?? ""),
        }))
    : [];

  return { status, adjustedBody, adjustedFrontmatter, adjustments };
}

/**
 * §3-3-7: content/analysis/{slug}.meta.json 동행 출력 (v3.6 신규).
 *
 * 컴포넌트(Timeline / RightsCallout / MarketCompare / ScenarioCards / PhotoGalleryStrip)가
 * 빌드 시 사용하는 구조화 데이터. raw-content/{caseNumber}/meta.json 에서 평탄화.
 *
 * Cowork schema 정합:
 *  - sections.bidding.history (v2.6.2+) — TimelineSection
 *  - sections.rights | registry (legacy) — RightsCallout
 *  - sections.market | market_data (legacy) — MarketCompareCard
 *  - sections.investment — ScenarioCards
 *  - photos.used[] | photos[] (photos_meta.json) — PhotoGalleryStrip
 *  - highlights[] — DetailSidebar 보강 (선택)
 *
 * 모든 섹션 optional. 누락 시 페이지 컴포넌트는 mdx body fallback (단계 3-1 baseline).
 */
function buildPublishedMeta(meta, photosMeta, slug, adjustments) {
  const out = { slug };

  // 단계 4-2: Gemini 콘텐츠 2차 감시자 통합 결과 기록 (count>0 일 때만 노출)
  // adjustments 항목 = { category, before, after, reason }
  if (Array.isArray(adjustments) && adjustments.length > 0) {
    out.supervisorAdjustments = {
      count: adjustments.length,
      items: adjustments.map((a) => ({
        category: a.category,
        before: a.before,
        after: a.after,
        reason: a.reason,
      })),
    };
  }

  // highlights — top-level 그대로
  if (Array.isArray(meta.highlights) && meta.highlights.length > 0) {
    out.highlights = meta.highlights.map((h) => ({
      label: String(h.label ?? ""),
      value: String(h.value ?? ""),
    }));
  }

  const sections = meta.sections ?? {};

  // bidding (v2.6.2+ — sections.bidding.history)
  const bh = sections.bidding?.history;
  if (Array.isArray(bh) && bh.length > 0) {
    out.bidding = {
      history: bh.map((e) => ({
        round: e.round ?? null,
        date: e.date ?? "",
        minimum: e.minimum ?? null,
        rate: e.rate ?? null,
        result: e.result ?? "",
      })),
    };
  }

  // rights (v2.6.2+ — sections.rights || legacy registry)
  const rights = sections.rights ?? meta.registry;
  if (rights && typeof rights === "object") {
    out.rights = {
      basis_date: rights.basis_date ?? "",
      basis_type: rights.basis_type ?? "",
      basis_holder: rights.basis_holder ?? "",
      total_claims: rights.total_claims ?? rights.claim_amount ?? null,
      tenants: Array.isArray(rights.tenants) ? rights.tenants.map((t) => ({
        name: t.name ?? "",
        move_in_date: t.move_in_date ?? "",
        deposit: t.deposit ?? null,
        opposing_power: t.opposing_power ?? null,
        analysis: t.analysis ?? "",
      })) : [],
    };
  }

  // market (v2.6.2+ — sections.market || legacy market_data)
  const market = sections.market ?? meta.market_data;
  if (market && typeof market === "object") {
    out.market = {
      sale_avg: market["매매_평균"] ?? market.sale_avg ?? market.avg_sale_price ?? null,
      sale_median: market["매매_중위"] ?? market.sale_median ?? null,
      sale_count: market["매매_건수"] ?? market.sale_count ?? null,
      lease_avg: market["전세_평균"] ?? market.lease_avg ?? market.avg_lease_price ?? null,
      lease_count: market["전세_건수"] ?? market.lease_count ?? null,
      rent_count: market["월세_건수"] ?? market.rent_count ?? null,
    };
    // null 만으로 가득 찬 객체는 제외
    const hasAnyValue = Object.values(out.market).some((v) => v != null);
    if (!hasAnyValue) delete out.market;
  }

  // investment scenarios
  const inv = sections.investment;
  if (inv && typeof inv === "object") {
    out.investment = {
      real_acquisition_cost: inv.real_acquisition_cost ?? null,
      scenario_a: inv.scenario_a ?? null,
      scenario_b: inv.scenario_b ?? null,
      scenario_c1: inv.scenario_c1 ?? null,
      scenario_c2: inv.scenario_c2 ?? null,
    };
  }

  // photos — meta.photos.used[] 우선 / photos_meta.json 의 photos[].url fallback
  // 상대 경로 (예: "B000240-535385-1/0.webp") → Supabase 공개 URL 으로 정규화
  const SUPABASE_PHOTO_BASE =
    "https://wyoanhtsrnoxijufawze.supabase.co/storage/v1/object/public/court-photos";
  function normalizePhotoUrl(s) {
    if (typeof s !== "string" || !s) return "";
    if (/^https?:\/\//.test(s)) return s;
    // "B000240-NNNNNN-1/N.webp" 형태 → "{base}/B000240/B000240-NNNNNN-1/N.webp"
    const m = s.match(/^(B\d{6})-(\d+-\d+)\//);
    if (m) {
      const courtCode = m[1]; // B000240
      return `${SUPABASE_PHOTO_BASE}/${courtCode}/${s}`;
    }
    return s;
  }
  let photoUrls = [];
  const usedFromMeta = meta.photos?.used;
  if (Array.isArray(usedFromMeta) && usedFromMeta.length > 0) {
    photoUrls = usedFromMeta
      .map((u) => (typeof u === "string" ? u : u?.url ?? ""))
      .map(normalizePhotoUrl)
      .filter(Boolean);
  } else if (Array.isArray(photosMeta?.photos)) {
    photoUrls = photosMeta.photos
      .map((p) => p?.url ?? "")
      .map(normalizePhotoUrl)
      .filter(Boolean);
  }
  if (photoUrls.length > 0) out.photos = photoUrls;

  return out;
}

/**
 * 단건 publish — args.caseNumber 1건 처리.
 * 반환: { status, code, slug, message? }
 *   status: success | skipped | fail-input | fail-rules | fail-consistency | fail-conflict | fail-write
 *   code: 0 = success, >0 = exit code
 *
 * 일괄 모드(--all)에서는 process.exit 호출 0 — main dispatcher 가 결과 종합 후 종료.
 */
async function publishOne(caseNumber, args) {
  const rawDir = path.join(RAW_ROOT, caseNumber);
  if (!fs.existsSync(rawDir)) {
    console.error(`  ✗ raw-content/${caseNumber}/ 폴더 없음`);
    return { status: "fail-input", code: 1, slug: caseNumber };
  }
  console.log(`[1] 입력 검증: ${path.relative(REPO_ROOT, rawDir)}`);
  const v = validateInput(rawDir);
  if (!v.ok) {
    console.error(`  ✗ 누락 (필수): ${v.missing.join(", ")}`);
    return { status: "fail-input", code: 1, slug: caseNumber };
  }
  if (v.optionalMissing?.length > 0 && args.verbose) {
    console.log(
      `  · 선택 항목 누락 (v3.3 허용): ${v.optionalMissing.join(", ")}`
    );
  }
  if (args.verbose) console.log(`  ✓ 4개 필수 항목 존재`);

  const meta = JSON.parse(fs.readFileSync(path.join(rawDir, "meta.json"), "utf8"));
  const postRaw = fs.readFileSync(path.join(rawDir, "post.md"), "utf8");
  const photosMeta = meta.photos ?? {};

  const slug = deriveSlug(caseNumber);
  console.log(`[2] slug: ${slug}`);

  console.log(`[3] 콘텐츠 룰 검증`);
  const matterParsed = matter(postRaw);
  const checkErrors = runContentChecks(meta, matterParsed.content);
  if (checkErrors.length > 0) {
    console.error(`  ✗ ${checkErrors.length}개 위반:`);
    for (const e of checkErrors) console.error(`    - ${e}`);
    return { status: "fail-rules", code: 2, slug };
  }
  if (args.verbose) console.log(`  ✓ §7 + §10-2 통과`);

  // [3.5] 콘텐츠 2차 감시 — Gemini 3.1 Pro (v4.0, 단계 4-2)
  // 정합성 + 데이터 누락 + 어휘 순화 + 일관성 + 금지 어휘 통합 1회 호출
  console.log(`[3.5] 콘텐츠 2차 감시 (Gemini 3.1 Pro)`);
  const originalBody = matterParsed.content;
  const originalFm = matterParsed.data ?? {};
  let adjustments = [];
  let postContentForBody = originalBody;
  let postFrontmatterForBody = originalFm;
  try {
    const r = await supervisorContent({
      body: originalBody,
      frontmatter: originalFm,
      slug,
      caseNumber: args.caseNumber ?? caseNumber,
    });
    if (r.status === "adjusted") {
      if (r.adjustedBody && r.adjustedBody.length > 0) {
        postContentForBody = r.adjustedBody;
      }
      if (r.adjustedFrontmatter) {
        // 부분 병합 — Gemini 가 변경한 키만 덮어쓰기 (안전)
        postFrontmatterForBody = { ...originalFm, ...r.adjustedFrontmatter };
      }
    }
    adjustments = r.adjustments;
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    return { status: "fail-supervisor", code: 1, slug };
  }
  // 카테고리별 카운트 + 상세 출력
  const byCat = {
    consistency: 0,
    missing_data: 0,
    vocabulary: 0,
    alignment: 0,
    forbidden_term: 0,
  };
  for (const a of adjustments) {
    if (a.category in byCat) byCat[a.category]++;
  }
  if (adjustments.length === 0) {
    console.log(`  · PASS (조정 없음)`);
  } else {
    console.log(
      `  · 정합성 ${byCat.consistency}건 / 데이터 누락 ${byCat.missing_data}건 / 어휘 순화 ${byCat.vocabulary}건 / 일관성 ${byCat.alignment}건 / 금지 어휘 ${byCat.forbidden_term}건`
    );
    for (const a of adjustments) {
      const before = a.before.length > 60 ? a.before.slice(0, 57) + "..." : a.before;
      const after = a.after.length > 60 ? a.after.slice(0, 57) + "..." : a.after;
      console.log(
        `    - [${a.category}] "${before}" → "${after}" (${a.reason})`
      );
    }
  }
  const adjustedCount = adjustments.length;

  const title = meta.card?.title ?? meta.hero?.headline ?? "";
  console.log(`[4] 본문 처리 + 이미지 매핑 (url_map / used) — post.md frontmatter 무시`);
  // postContentForBody (supervisor 적용된 본문) + postFrontmatterForBody 재구성
  const matterFmText = matter.stringify(postContentForBody, postFrontmatterForBody);
  const body = transformBody(matterFmText, photosMeta, title);

  // updatedAt 결정 (v3.4 §10-7: ISO normalize 적용)
  const outPath = path.join(OUT_DIR, `${slug}.mdx`);
  const outExists = fs.existsSync(outPath);
  const today = new Date().toISOString().slice(0, 10);
  let updatedAt;
  if (!outExists) {
    updatedAt = normalizeDate(meta.published_at ?? today);
  } else if (args.force) {
    updatedAt = today;
  } else {
    const existingFm = matter(fs.readFileSync(outPath, "utf8")).data;
    updatedAt = normalizeDate(
      existingFm.updatedAt ?? meta.published_at ?? today
    );
  }

  console.log(`[5] frontmatter 매핑 (updatedAt=${updatedAt})`);
  const frontmatter = buildFrontmatter(meta, slug, { updatedAt });
  const mdxContent = serializeMdx(frontmatter, body);

  if (args.dryRun) {
    if (outExists) {
      const existing = fs.readFileSync(outPath, "utf8");
      if (existing === mdxContent) {
        console.log(`[6] dry-run — 기존 파일과 byte-identical (no-op 예상)`);
      } else {
        console.log(
          `[6] dry-run — 기존과 차이: 기존 ${existing.length}B / 신규 ${mdxContent.length}B`
        );
      }
    } else {
      console.log(`[6] dry-run — 신규 파일 (${mdxContent.length}B)`);
    }
    if (args.verbose) {
      console.log("\n--- frontmatter preview ---");
      console.log(matter.stringify("", frontmatter));
    }
    return { status: "success", code: 0, slug, dryRun: true, adjustedCount };
  }

  let mdxNoop = false;
  if (outExists) {
    const existing = fs.readFileSync(outPath, "utf8");
    if (existing === mdxContent) {
      console.log(`[6] mdx — 기존 파일과 byte-identical → no-op`);
      mdxNoop = true;
    } else if (!args.force) {
      console.error(
        `[6] 기존 ${path.relative(REPO_ROOT, outPath)}과 차이 발생.\n   --force로 덮어쓰기 또는 --dry-run으로 검토.`
      );
      console.error(`   기존 ${existing.length}B / 신규 ${mdxContent.length}B`);
      return { status: "fail-conflict", code: 3, slug };
    }
  }

  if (!mdxNoop) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    try {
      fs.writeFileSync(outPath, mdxContent, "utf8");
    } catch (e) {
      console.error(`[8] mdx 쓰기 실패: ${e.message}`);
      return { status: "fail-write", code: 4, slug };
    }
    console.log(
      `[8] mdx 쓰기 완료: ${path.relative(REPO_ROOT, outPath)}  ${mdxContent.length}B  updatedAt=${updatedAt}`
    );
  }

  // [9] meta.json 동행 출력
  const photosMetaRaw = (() => {
    const p = path.join(rawDir, "data/photos_meta.json");
    if (!fs.existsSync(p)) return {};
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch {
      return {};
    }
  })();
  const publishedMeta = buildPublishedMeta(meta, photosMetaRaw, slug, adjustments);
  const metaOutPath = path.join(OUT_DIR, `${slug}.meta.json`);
  const metaJson = JSON.stringify(publishedMeta, null, 2) + "\n";
  let metaNoop = false;
  if (fs.existsSync(metaOutPath)) {
    const existing = fs.readFileSync(metaOutPath, "utf8");
    if (existing === metaJson) {
      console.log(`[9] meta.json — 기존 파일과 byte-identical → no-op`);
      metaNoop = true;
    }
  }
  if (!metaNoop) {
    fs.mkdirSync(path.dirname(metaOutPath), { recursive: true });
    try {
      fs.writeFileSync(metaOutPath, metaJson, "utf8");
    } catch (e) {
      console.error(`[9] meta.json 쓰기 실패: ${e.message}`);
      return { status: "fail-write", code: 4, slug };
    }
    console.log(
      `[9] meta.json 동행: ${path.relative(REPO_ROOT, metaOutPath)}  ${metaJson.length}B`
    );
  }

  return { status: "success", code: 0, slug, adjustedCount };
}

/* ─── main dispatcher ─── */
async function main() {
  const args = parseArgs(process.argv);

  // --all 모드 — raw-content/ 하위 사건 디렉토리 전체 일괄 publish
  if (args.all) {
    const cases = scanCaseDirs();
    if (cases.length === 0) {
      console.error("raw-content/ 하위에 사건 디렉토리가 없습니다.");
      process.exit(1);
    }
    console.log(
      `=== --all 모드: ${cases.length}건 발견 — ${cases.join(", ")} ===\n`
    );
    const results = [];
    for (const c of cases) {
      console.log(`\n──────────── [${c}] 시작 ────────────`);
      const r = await publishOne(c, args);
      results.push({ caseNumber: c, ...r });
    }
    const ok = results.filter((r) => r.status === "success").length;
    const fail = results.length - ok;
    const adjusted = results.filter(
      (r) => r.status === "success" && (r.adjustedCount ?? 0) > 0
    ).length;
    console.log(
      `\n=== --all 결과 요약: PASS ${ok}건 (ADJUSTED ${adjusted}건) / FAIL ${fail}건 ===`
    );
    for (const r of results) {
      if (r.status === "success") {
        const adj = r.adjustedCount ?? 0;
        const tag = adj > 0 ? "✓ ADJUSTED" : "✓";
        console.log(`  ${tag} ${r.caseNumber}${adj > 0 ? ` (한 줄 요약 ${adj}건 조정)` : ""}`);
      } else {
        console.log(`  ✗ ${r.caseNumber} — ${r.status}`);
      }
    }
    process.exit(fail > 0 ? 1 : 0);
  }

  // 단건 모드
  if (!args.caseNumber) {
    printHelp();
    process.exit(1);
  }
  const r = await publishOne(args.caseNumber, args);
  process.exit(r.code);
}

main().catch((e) => {
  console.error("치명적 오류:", e);
  process.exit(1);
});
