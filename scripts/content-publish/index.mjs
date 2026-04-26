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
  const a = { caseNumber: null, force: false, dryRun: false, verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--force") a.force = true;
    else if (v === "--dry-run") a.dryRun = true;
    else if (v === "--verbose" || v === "-v") a.verbose = true;
    else if (v === "--help" || v === "-h") { printHelp(); process.exit(0); }
    else if (!v.startsWith("--") && !a.caseNumber) a.caseNumber = v;
  }
  return a;
}
function printHelp() {
  console.log(`pnpm publish <caseNumber> [--force] [--dry-run] [--verbose]

규격: docs/content-source-v3.md (v3.2)
입력: raw-content/{caseNumber}/  (meta.json·post.md·data/·images/)
출력: content/analysis/{slug}.mdx  (slug = caseNumber.replace("타경","-"))

옵션:
  --force     기존 mdx 덮어쓰기 + updatedAt을 today로 갱신
  --dry-run   파일 쓰지 않음 (검증·매핑만)
  --verbose   상세 로그`);
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

/* ─── §2: slug ─── */
function deriveSlug(caseNumber) {
  const slug = caseNumber.replace("타경", "-");
  if (!/^[\x20-\x7e]+$/.test(slug)) {
    throw new Error(`slug must be ASCII-only, got "${slug}"`);
  }
  return slug;
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

/**
 * §10-X: 시나리오 정합성 검증 (v3.7 신규, 단계 3-5).
 *
 * 사유: v2.7.1 Cowork 동결 + 책임 분리 — Cowork(LLM·주관) vs Code(검증·객관).
 *      LLM 비결정성은 patch 로 차단 0, post-processing 검증이 본질 해결책.
 *
 * 알고리즘:
 *   1) "### 시나리오 " 헤더로 본문 분할 (4개: A·B·C-1·C-2 등)
 *   2) 각 섹션에서 한 줄 요약 추출 — 헤더 다음 첫 비공백 줄.
 *      `|` `-` `*` 시작이면 한 줄 요약 없음 (스킵, WARN)
 *   3) 한 줄 요약에서 숫자+단위 추출 (만원/억/%/년)
 *   4) 동일 섹션의 마크다운 표(헤더 행 다음) 안 모든 셀에서 동일 정규식
 *   5) 한 줄 요약 각 숫자에 대해, 같은 단위 그룹에서 가장 가까운 표 숫자 매칭.
 *      차이비율 = abs(요약값 - 표값) / max(요약값, 표값). 5% 초과 시 FAIL.
 *
 * 단위 정규화: 만원/억은 만원 단위 통일 (1억=10000만). %·년은 그대로.
 *
 * 반환: { ok: boolean, results: Array<{ scenario, status, summaries: [{value, unit, nearest, diff, pass}] }> }
 */

const NUMBER_UNIT_RE = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(만원|억|%|년)/g;

function parseNumber(rawDigits) {
  return parseFloat(String(rawDigits).replace(/,/g, ""));
}

/** 단위별 정규화: 만원/억은 "만" 단위 정수, %·년은 원본 값. 단위 그룹 키는 "money" 또는 unit 자체 */
function normalizeNumberUnit(value, unit) {
  if (unit === "억") return { group: "money", value: value * 10000 };
  if (unit === "만원") return { group: "money", value };
  if (unit === "%") return { group: "%", value };
  if (unit === "년") return { group: "년", value };
  return { group: unit, value };
}

function extractNumbersFromText(text) {
  const out = [];
  if (!text) return out;
  let m;
  NUMBER_UNIT_RE.lastIndex = 0;
  while ((m = NUMBER_UNIT_RE.exec(text)) !== null) {
    const raw = m[1];
    const unit = m[2];
    const value = parseNumber(raw);
    if (Number.isFinite(value)) {
      const norm = normalizeNumberUnit(value, unit);
      out.push({ raw, unit, value, group: norm.group, normValue: norm.value });
    }
  }
  return out;
}

/** 마크다운 표 데이터 행 (헤더 + 구분자 다음) 셀 텍스트 추출 */
function extractTableCells(blockLines) {
  // blockLines 안 `|` 시작 라인 모음. 첫 두 라인(헤더 + ---)을 건너뛰고 데이터 행 셀 추출
  const tableLines = blockLines.filter((l) => /^\s*\|/.test(l));
  if (tableLines.length < 3) return [];
  const sepIdx = tableLines.findIndex((l) => /^\s*\|[\s|:.\-]+\|/.test(l));
  if (sepIdx < 1) return [];
  const dataRows = tableLines.slice(sepIdx + 1);
  const cells = [];
  for (const row of dataRows) {
    const inner = row.trim().replace(/^\|/, "").replace(/\|$/, "");
    for (const cell of inner.split("|")) {
      cells.push(cell.trim());
    }
  }
  return cells;
}

function validateScenarioConsistency(postMdContent) {
  // post.md 본문에서 frontmatter 제거
  const parsed = matter(postMdContent);
  const body = parsed.content;
  const lines = body.split(/\r?\n/);

  // ### 시나리오 ... 섹션 분할
  const sections = [];
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const headerMatch = /^###\s+시나리오\s+([A-Z](?:-\d+)?)\s*[—\-–]\s*(.+?)\s*$/.exec(l);
    if (headerMatch) {
      if (current) sections.push(current);
      current = { key: headerMatch[1], title: l.trim(), startLine: i, lines: [] };
      continue;
    }
    // 다음 ### 또는 ## 만나면 섹션 종료
    if (current && /^(?:##|###)\s+/.test(l)) {
      sections.push(current);
      current = null;
    }
    if (current) current.lines.push(l);
  }
  if (current) sections.push(current);

  // 비교 요약 섹션은 제외 — 4 시나리오만
  const scenarios = sections.filter(
    (s) => /^[A-Z](-\d+)?$/.test(s.key) && s.key !== "비교"
  );

  const results = [];
  let failCount = 0;

  for (const sec of scenarios) {
    const result = {
      scenario: sec.key,
      title: sec.title,
      status: "pass",
      summaryLine: "",
      summaries: [],
      tableCellCount: 0,
    };

    // 한 줄 요약: 헤더 직후 첫 비공백 줄
    let summaryLine = "";
    for (const l of sec.lines) {
      const t = l.trim();
      if (!t) continue;
      if (/^[|*\-]/.test(t)) {
        // 표 / 리스트 시작 — 한 줄 요약 없음
        result.status = "skip";
        break;
      }
      summaryLine = t;
      break;
    }
    result.summaryLine = summaryLine;

    if (result.status === "skip") {
      results.push(result);
      continue;
    }

    if (!summaryLine) {
      result.status = "skip";
      results.push(result);
      continue;
    }

    const summaryNums = extractNumbersFromText(summaryLine);
    if (summaryNums.length === 0) {
      // 한 줄 요약은 있으나 숫자+단위 0건 — 비교 대상 0
      result.status = "no-numbers";
      results.push(result);
      continue;
    }

    const tableCells = extractTableCells(sec.lines);
    result.tableCellCount = tableCells.length;
    const tableNums = [];
    for (const c of tableCells) {
      tableNums.push(...extractNumbersFromText(c));
    }

    // 한 줄 요약 각 숫자 → 같은 group 안 가장 가까운 표 숫자 매칭
    for (const sn of summaryNums) {
      const sameGroup = tableNums.filter((tn) => tn.group === sn.group);
      if (sameGroup.length === 0) {
        result.summaries.push({
          summary: `${sn.raw}${sn.unit}`,
          group: sn.group,
          nearest: null,
          diff: null,
          pass: false,
          reason: "표 안 동일 단위 숫자 0건",
        });
        result.status = "fail";
        continue;
      }
      let best = sameGroup[0];
      let bestDiff =
        Math.abs(sn.normValue - best.normValue) /
        Math.max(sn.normValue, best.normValue, 1);
      for (const tn of sameGroup.slice(1)) {
        const d =
          Math.abs(sn.normValue - tn.normValue) /
          Math.max(sn.normValue, tn.normValue, 1);
        if (d < bestDiff) {
          best = tn;
          bestDiff = d;
        }
      }
      const pass = bestDiff <= 0.05;
      result.summaries.push({
        summary: `${sn.raw}${sn.unit}`,
        group: sn.group,
        nearest: `${best.raw}${best.unit}`,
        diff: bestDiff,
        pass,
        reason: null,
      });
      if (!pass) result.status = "fail";
    }

    if (result.status === "fail") failCount++;
    results.push(result);
  }

  const passCount = results.filter((r) => r.status === "pass").length;
  const total = scenarios.length;
  return { ok: failCount === 0, total, passCount, failCount, results };
}

function reportConsistency(report) {
  const { ok, total, passCount, failCount, results } = report;
  if (ok) {
    console.log(
      `=== 정합성 검증 PASS (시나리오 ${passCount}/${total}) ===`
    );
  } else {
    console.error(
      `=== 정합성 검증 FAIL (시나리오 ${passCount}/${total}, 실패 ${failCount}) ===`
    );
  }
  for (const r of results) {
    if (r.status === "skip") {
      console.warn(
        `  · 시나리오 ${r.scenario} — 한 줄 요약 없음 (표/리스트 시작) → 스킵`
      );
      continue;
    }
    if (r.status === "no-numbers") {
      console.warn(
        `  · 시나리오 ${r.scenario} — 한 줄 요약에서 숫자+단위 0건 추출 (스킵)`
      );
      continue;
    }
    if (r.status === "fail") {
      console.error(
        `  ✗ 시나리오 ${r.scenario} — 한 줄 요약과 표 숫자 불일치 (표 ${r.tableCellCount}셀)`
      );
      for (const s of r.summaries) {
        if (s.pass) {
          const dPct = (s.diff * 100).toFixed(1);
          console.error(
            `      · "${s.summary}" ↔ 가장 가까운 표 값 ${s.nearest}, 차이 ${dPct}% [PASS — 5% 이내]`
          );
        } else if (s.nearest) {
          const dPct = (s.diff * 100).toFixed(1);
          console.error(
            `      · "${s.summary}" ↔ 가장 가까운 표 값 ${s.nearest}, 차이 ${dPct}% [FAIL]`
          );
        } else {
          console.error(
            `      · "${s.summary}" ↔ ${s.reason} [FAIL]`
          );
        }
      }
    } else if (r.status === "pass") {
      const cnt = r.summaries.length;
      console.log(
        `  ✓ 시나리오 ${r.scenario} — 한 줄 요약 ${cnt}개 모두 표 숫자와 5% 이내 일치`
      );
    }
  }
  if (!ok) {
    console.error(
      `\n수정 후 재시도하시거나 --force 플래그로 강행하실 수 있습니다.`
    );
  }
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
function buildPublishedMeta(meta, photosMeta, slug) {
  const out = { slug };

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

/* ─── main ─── */
async function main() {
  const args = parseArgs(process.argv);
  if (!args.caseNumber) {
    printHelp();
    process.exit(1);
  }

  const rawDir = path.join(RAW_ROOT, args.caseNumber);
  if (!fs.existsSync(rawDir)) {
    console.error(`raw-content/${args.caseNumber}/ 폴더 없음`);
    process.exit(1);
  }
  console.log(`[1] 입력 검증: ${path.relative(REPO_ROOT, rawDir)}`);
  const v = validateInput(rawDir);
  if (!v.ok) {
    console.error(`  ✗ 누락 (필수): ${v.missing.join(", ")}`);
    process.exit(1);
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

  const slug = deriveSlug(args.caseNumber);
  console.log(`[2] slug: ${slug}`);

  console.log(`[3] 콘텐츠 룰 검증`);
  const matterParsed = matter(postRaw);
  const checkErrors = runContentChecks(meta, matterParsed.content);
  if (checkErrors.length > 0) {
    console.error(`  ✗ ${checkErrors.length}개 위반:`);
    for (const e of checkErrors) console.error(`    - ${e}`);
    process.exit(2);
  }
  if (args.verbose) console.log(`  ✓ §7 + §10-2 통과`);

  // [3.5] 시나리오 정합성 검증 (v3.7 신규, 단계 3-5)
  console.log(`[3.5] 시나리오 정합성 검증 (한 줄 요약 ↔ 표 숫자, 5% 임계)`);
  const consistency = validateScenarioConsistency(postRaw);
  reportConsistency(consistency);
  if (!consistency.ok) {
    if (!args.force) {
      process.exit(1);
    }
    console.warn(
      `  ⚠ --force 플래그로 정합성 위반을 무시하고 진행합니다.`
    );
  }

  const title = meta.card?.title ?? meta.hero?.headline ?? "";
  console.log(`[4] 본문 처리 + 이미지 매핑 (url_map / used) — post.md frontmatter 무시`);
  const body = transformBody(postRaw, photosMeta, title);

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
    // 멱등 비교용 — 기존 mdx의 updatedAt을 그대로 유지하면 byte-identical 가능
    const existingFm = matter(fs.readFileSync(outPath, "utf8")).data;
    updatedAt = normalizeDate(
      existingFm.updatedAt ?? meta.published_at ?? today
    );
  }

  console.log(`[5] frontmatter 매핑 (updatedAt=${updatedAt})`);
  const frontmatter = buildFrontmatter(meta, slug, { updatedAt });
  const mdxContent = serializeMdx(frontmatter, body);

  // dry-run: 멱등 검사보다 우선. 차이가 있어도 미리보기 후 정상 종료.
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
    process.exit(0);
  }

  // §7 멱등성 — mdx 부분만. meta.json 은 §9 에서 별도 처리.
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
      process.exit(3);
    }
  }

  if (!mdxNoop) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    try {
      fs.writeFileSync(outPath, mdxContent, "utf8");
    } catch (e) {
      console.error(`[8] mdx 쓰기 실패: ${e.message}`);
      process.exit(4);
    }
    console.log(
      `[8] mdx 쓰기 완료: ${path.relative(REPO_ROOT, outPath)}  ${mdxContent.length}B  updatedAt=${updatedAt}`
    );
  }

  // [9] meta.json 동행 출력 (v3.6 신규) — 컴포넌트 어댑터용 평탄화 데이터
  const photosMetaRaw = (() => {
    const p = path.join(rawDir, "data/photos_meta.json");
    if (!fs.existsSync(p)) return {};
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch {
      return {};
    }
  })();
  const publishedMeta = buildPublishedMeta(meta, photosMetaRaw, slug);
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
      process.exit(4);
    }
    console.log(
      `[9] meta.json 동행: ${path.relative(REPO_ROOT, metaOutPath)}  ${metaJson.length}B`
    );
  }
}

main().catch((e) => {
  console.error("치명적 오류:", e);
  process.exit(1);
});
