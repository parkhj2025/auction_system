#!/usr/bin/env node
/**
 * Phase 7 — Cowork 원천 자료 → 웹 콘텐츠 변환 CLI.
 * ----------------------------------------------------------------------------
 * 사용법:
 *   pnpm content:publish raw-content/{caseNumber}              # dry-run
 *   pnpm content:publish raw-content/{caseNumber} --execute    # 실행
 *   pnpm content:publish raw-content/{caseNumber} --execute --force
 *                                             # 기존 mdx 덮어쓰기
 *
 * 원천 자료 규격: docs/content-source-v1.md
 * 변환 결과:
 *   - content/analysis/{slug}.mdx  (slug = caseNumber.replace("타경","-"))
 *   - Supabase Storage content-photos/{slug}/{sha256(webp).slice(0,8)}.webp
 *
 * 처리 흐름:
 *   (a) 입력 검증 + 불변식 grep + source 마스킹 검증
 *   (b) post.md 파싱 (gray-matter)
 *   (c) slug 파생
 *   (d) frontmatter 매핑 (규격 v1 → AnalysisFrontmatter)
 *   (e) 이미지 수집
 *   (f) sharp 변환 + SHA-256 hash
 *   (g) Storage upload (멱등)
 *   (h) MDX 본문 이미지 경로 치환
 *   (i) frontmatter 후처리
 *   (j) content/analysis/{slug}.mdx 생성
 *   (k) 리포트
 *
 * 환경: node --env-file=.env.local 전제.
 * 필수 env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFile, readdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "content-photos";
const CONTENT_DIR = "content/analysis";

// ---------------------------------------------------------------------------
// CLI 인자 파싱
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { dir: null, execute: false, force: false };
  for (const a of argv.slice(2)) {
    if (a === "--execute") args.execute = true;
    else if (a === "--force") args.force = true;
    else if (!a.startsWith("--") && !args.dir) args.dir = a;
  }
  return args;
}

// ---------------------------------------------------------------------------
// 규격 v1 필수 frontmatter 필드
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS = [
  "caseNumber", "court", "courtDivision", "bidDate", "bidTime",
  "address", "sido", "sigungu", "dong", "propertyType", "auctionType",
  "areaM2", "areaPyeong", "appraisal", "minPrice", "percent", "round",
  "appraisalDisplay", "minPriceDisplay", "category", "riskLevel",
  "tags", "seoTags", "title", "summary", "coverImage", "publishedAt",
  "marketData",
];

const REQUIRED_MARKET_FIELDS = ["avgSalePrice", "saleCount", "avgLeasePrice", "leaseCount", "source"];

// ---------------------------------------------------------------------------
// Step (a) — 입력 검증 + 불변식 + source 마스킹
// ---------------------------------------------------------------------------

async function validateInput(dir) {
  const errors = [];

  // 폴더 존재
  if (!existsSync(dir)) errors.push(`폴더 없음: ${dir}`);
  const stats = existsSync(dir) ? await stat(dir) : null;
  if (stats && !stats.isDirectory()) errors.push(`폴더 아님: ${dir}`);

  // 필수 파일
  const required = [
    "post.md",
    "data/pdf_text.txt",
    "data/crawler.json",
    "data/photos_meta.json",
  ];
  for (const rel of required) {
    const full = path.join(dir, rel);
    if (!existsSync(full)) errors.push(`필수 파일 없음: ${rel}`);
  }

  // images/photos/ 디렉터리
  const imgDir = path.join(dir, "images/photos");
  if (!existsSync(imgDir)) errors.push(`이미지 디렉터리 없음: images/photos/`);

  if (errors.length) {
    throw new Error(`입력 검증 실패:\n  - ${errors.join("\n  - ")}`);
  }
}

function validateFrontmatter(fm, folderName) {
  const errors = [];

  // 필수 필드
  for (const key of REQUIRED_FIELDS) {
    if (fm[key] === undefined || fm[key] === null || fm[key] === "") {
      errors.push(`frontmatter 필수 필드 누락: ${key}`);
    }
  }

  // marketData 하위 필드
  if (fm.marketData && typeof fm.marketData === "object") {
    for (const key of REQUIRED_MARKET_FIELDS) {
      if (fm.marketData[key] === undefined || fm.marketData[key] === null || fm.marketData[key] === "") {
        errors.push(`marketData.${key} 누락`);
      }
    }
  }

  // 불변식 1: 폴더명 === caseNumber
  if (fm.caseNumber && folderName !== fm.caseNumber) {
    errors.push(`불변식 §6-1: 폴더명 "${folderName}" ≠ caseNumber "${fm.caseNumber}"`);
  }

  // source 마스킹 검증 (Plan v1.1 Step 6 (a))
  const source = fm.marketData?.source;
  if (typeof source === "string" && /네이버/.test(source)) {
    errors.push(
      `marketData.source 네이버 상표 미마스킹 감지: "${source}". ` +
      `원천 자료 post.md의 source 필드를 "네○○ 부동산"으로 수정 후 재발행 필요. ` +
      `자동 치환 금지 (원천 자료 무결성 보호).`
    );
  }

  if (errors.length) {
    throw new Error(`frontmatter 검증 실패:\n  - ${errors.join("\n  - ")}`);
  }
}

function validateBody(body, imageFiles) {
  const warnings = [];

  // 불변식 5: H1 1개 + H2 "## 01" ~ "## 07" + "## 면책 고지"
  const h1Count = (body.match(/^# /gm) || []).length;
  if (h1Count !== 1) warnings.push(`본문 H1 개수 ${h1Count} (기대 1)`);

  for (let n = 1; n <= 7; n++) {
    const pad = String(n).padStart(2, "0");
    const re = new RegExp(`^## ${pad} `, "m");
    if (!re.test(body)) warnings.push(`본문에 "## ${pad}" 섹션 없음`);
  }
  if (!/^## 면책 고지/m.test(body)) warnings.push(`본문에 "## 면책 고지" 섹션 없음`);

  // 불변식 6: 본문 참조 이미지 실존
  const imgRe = /!\[[^\]]*\]\(images\/photos\/([^)]+)\)/g;
  let match;
  while ((match = imgRe.exec(body)) !== null) {
    const file = match[1];
    if (!imageFiles.includes(file)) {
      warnings.push(`본문 참조 이미지 파일 없음: images/photos/${file}`);
    }
  }

  // 불변식 7: 네이버 마스킹 (본문에 "네이버" 리터럴 감지 시 경고)
  if (/네이버/.test(body)) {
    warnings.push(`본문에 "네이버" 리터럴 감지. "네○○ 부동산"으로 마스킹 필요.`);
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// Step (c) — slug 파생
// ---------------------------------------------------------------------------

function deriveSlug(caseNumber) {
  // "2024타경46918" → "2024-46918"
  const slug = caseNumber.replace("타경", "-");
  if (!/^\d{4}-\d+$/.test(slug)) {
    throw new Error(
      `slug 파생 실패: "${caseNumber}" → "${slug}". ` +
      `기대 형식: "YYYY타경NNNNN" (숫자만).`
    );
  }
  return slug;
}

// ---------------------------------------------------------------------------
// Step (d) — frontmatter 매핑
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  danger: "danger",
  safe: "safe",
  edu: "edu",
  caution: "danger",  // 규격 v1 "caution" → 기존 타입 "danger"
};

const RISK_MAP = {
  low: "low",
  mid: "mid",
  high: "high",
  medium: "mid",  // 규격 v1 "medium" → 기존 타입 "mid"
};

const REGION_MAP = [
  { match: (sido, sigungu) => /인천/.test(sido) || /인천/.test(sigungu), region: "incheon" },
  { match: (sido) => /경기/.test(sido), region: "gyeonggi" },
  { match: (sido) => /서울/.test(sido), region: "seoul" },
];

function deriveRegion(sido, sigungu) {
  for (const rule of REGION_MAP) {
    if (rule.match(sido, sigungu)) return rule.region;
  }
  return "etc";
}

function mapFrontmatter(sourceFm, slug) {
  const category = CATEGORY_MAP[sourceFm.category];
  const riskLevel = RISK_MAP[sourceFm.riskLevel];
  if (!category) throw new Error(`category "${sourceFm.category}" 매핑 불가. 허용: ${Object.keys(CATEGORY_MAP).join(", ")}`);
  if (!riskLevel) throw new Error(`riskLevel "${sourceFm.riskLevel}" 매핑 불가. 허용: ${Object.keys(RISK_MAP).join(", ")}`);

  const mapped = {
    ...sourceFm,
    type: "analysis",
    slug,
    status: "published",
    category,
    riskLevel,
    region: deriveRegion(sourceFm.sido, sourceFm.sigungu),
    updatedAt: sourceFm.publishedAt,  // 규격 v1엔 updatedAt 없음 → publishedAt 복사
  };

  return mapped;
}

// ---------------------------------------------------------------------------
// Step (f), (g) — 이미지 변환 + Storage 업로드
// ---------------------------------------------------------------------------

async function processImage(supabase, rawPath, slug, dryRun) {
  const input = await readFile(rawPath);

  const webp = await sharp(input)
    .rotate()                                           // EXIF Auto-Orient + 메타 strip
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const hash = crypto.createHash("sha256").update(webp).digest("hex").slice(0, 8);
  const key = `${slug}/${hash}.webp`;

  if (!dryRun) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(key, webp, { contentType: "image/webp", upsert: true });
    if (error) throw new Error(`Storage upload 실패 (${key}): ${error.message}`);
  }

  return { key, size: webp.length };
}

function publicUrl(supabaseUrl, slug, hash) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${slug}/${hash}.webp`;
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  if (!args.dir) {
    console.error("사용법: pnpm content:publish raw-content/{caseNumber} [--execute] [--force]");
    process.exit(1);
  }

  const dir = path.resolve(args.dir);
  const folderName = path.basename(dir);
  const dryRun = !args.execute;

  console.log(`[content-publish] ${dryRun ? "DRY-RUN" : "EXECUTE"} ${dir}`);

  // (a) 입력 검증
  await validateInput(dir);

  // (b) post.md 파싱
  const postRaw = await readFile(path.join(dir, "post.md"), "utf8");
  const parsed = matter(postRaw);
  const sourceFm = parsed.data;
  const body = parsed.content;

  // (a-2) frontmatter 검증
  validateFrontmatter(sourceFm, folderName);

  // 이미지 파일 수집
  const imgDir = path.join(dir, "images/photos");
  const imageFiles = (await readdir(imgDir)).filter((f) =>
    /\.(jpe?g|png|webp)$/i.test(f)
  );

  // 본문 검증 (경고 수준)
  const bodyWarnings = validateBody(body, imageFiles);
  if (bodyWarnings.length) {
    console.warn(`[content-publish] 본문 경고 ${bodyWarnings.length}건:`);
    for (const w of bodyWarnings) console.warn(`  - ${w}`);
  }

  // (c) slug 파생
  const slug = deriveSlug(sourceFm.caseNumber);

  // (d) frontmatter 매핑
  const targetFm = mapFrontmatter(sourceFm, slug);

  // 기존 mdx 중복 체크
  const mdxOut = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (existsSync(mdxOut) && !args.force && !dryRun) {
    throw new Error(`기존 파일 존재: ${mdxOut}. --force 지정 시 덮어쓰기.`);
  }

  // Supabase 클라이언트 (execute 시에만 필요하지만 dry-run에서도 env 확인)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 없음. node --env-file=.env.local 으로 실행.");
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // (e), (f), (g) — 이미지 처리
  const imageMap = {};  // { "000241_전경_01.jpg": "abc12345" }
  for (const file of imageFiles) {
    const rawPath = path.join(imgDir, file);
    const { key, size } = await processImage(supabase, rawPath, slug, dryRun);
    const hash = key.split("/").pop().replace(".webp", "");
    imageMap[file] = hash;
    console.log(`  [${dryRun ? "DRY" : "UP"}] ${file} → ${key} (${Math.round(size / 1024)}KB)`);
  }

  // (h) MDX 본문 이미지 경로 치환
  let transformedBody = body;
  for (const [origFile, hash] of Object.entries(imageMap)) {
    const url = publicUrl(supabaseUrl, slug, hash);
    const escapedOrig = origFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pathRe = new RegExp(`images/photos/${escapedOrig}`, "g");
    transformedBody = transformedBody.replace(pathRe, url);
  }

  // (i) frontmatter coverImage 치환
  if (typeof targetFm.coverImage === "string") {
    const coverFile = path.basename(targetFm.coverImage);
    const coverHash = imageMap[coverFile];
    if (coverHash) {
      targetFm.coverImage = publicUrl(supabaseUrl, slug, coverHash);
    }
  }

  // (j) content/analysis/{slug}.mdx 생성
  const output = matter.stringify(transformedBody, targetFm);
  if (!dryRun) {
    await writeFile(mdxOut, output, "utf8");
  }

  // (k) 리포트
  console.log(`\n[content-publish] ${dryRun ? "DRY-RUN" : "COMPLETED"}`);
  console.log(`  slug: ${slug}`);
  console.log(`  mdx:  ${mdxOut}${dryRun ? " (미생성)" : ""}`);
  console.log(`  이미지: ${imageFiles.length}장 (${dryRun ? "미업로드" : "업로드 완료"})`);
  console.log(`  region: ${targetFm.region}, category: ${targetFm.category}, riskLevel: ${targetFm.riskLevel}`);
  if (dryRun) {
    console.log(`\n실행하려면 --execute 플래그 추가.`);
  }
}

main().catch((err) => {
  console.error(`[content-publish] 실패: ${err.message}`);
  process.exit(1);
});
