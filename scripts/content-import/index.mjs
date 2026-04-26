#!/usr/bin/env node
/**
 * Phase 7 — Cowork 산출물 폴더 → raw-content/{case_id}/ 복사 자동화 CLI.
 * ─────────────────────────────────────────────────────────────────────
 * macOS Finder Quick Action 셸 스크립트가 본 도구를 호출하는 것이 1차 사용자.
 * 단일 책임: "Cowork 산출 폴더를 raw-content/ 안에 검증·복사"만 수행.
 * publish CLI(scripts/content-publish/)와는 별개 명령. 통합 0.
 *
 * case_id 컨벤션: "YYYY타경NNNNNN" (한글 그대로). slug 변환은 publish CLI의
 * deriveSlug가 단독 책임. 본 도구는 변환 0.
 *
 * 사용법:
 *   pnpm content:import "/Users/.../2025타경507598"
 *   pnpm content:import "/Users/.../2025타경507598" --dry-run
 *   pnpm content:import "/Users/.../2025타경507598" --force        # 충돌 시 백업 후 덮어쓰기
 *   pnpm content:import "/Users/.../2025타경507598" --verbose
 *
 * 종료 코드:
 *   0  성공 (또는 --dry-run으로 검증 통과)
 *   1  검증 실패 (경로/형식/필수 파일/case_number 불일치)
 *   2  충돌 (raw-content/{case_id} 이미 존재) — --force 없으면
 *   3  시스템 에러 (권한·디스크 등)
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { spawnSync } from "node:child_process";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const RAW_ROOT = path.join(REPO_ROOT, "raw-content");
const ARCHIVE_ROOT = path.join(RAW_ROOT, ".archive");

const CASE_ID_RE = /^\d{4}타경\d+$/;

/* ─── argv ─── */
function parseArgs(argv) {
  const a = { input: null, force: false, dryRun: false, verbose: false };
  for (let i = 2; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--force") a.force = true;
    else if (v === "--dry-run") a.dryRun = true;
    else if (v === "--verbose" || v === "-v") a.verbose = true;
    else if (v === "--help" || v === "-h") { printHelp(); process.exit(0); }
    else if (!v.startsWith("--") && !a.input) a.input = v;
  }
  return a;
}
function printHelp() {
  console.log(`Usage: pnpm content:import <폴더 절대경로> [--force] [--dry-run] [--verbose]

case_id 컨벤션: "YYYY타경NNNNNN" (한글 그대로). 입력 폴더의 basename이 case_id.

검증 순서:
  a. 입력 경로 존재·디렉토리
  b. basename이 /^\\d{4}타경\\d+$/ 형식
  c. {input}/post.md 존재
  d. {input}/data/meta.json 존재
  e. meta.json.case_number == basename

충돌(raw-content/{case_id} 이미 존재) 시:
  --force 없음 → exit 2 + diff 표시
  --force 있음 → raw-content/.archive/{case_id}-{YYYYMMDD-HHMMSS}/ 로 백업 후 덮어쓰기

종료 코드: 0 성공 / 1 검증 / 2 충돌 / 3 시스템`);
}

/* ─── 보조 함수 ─── */
function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

async function countFiles(dir) {
  let count = 0;
  async function walk(d) {
    let entries;
    try {
      entries = await fsp.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile()) count++;
    }
  }
  await walk(dir);
  return count;
}

async function getMtimeIso(p) {
  try {
    const st = await fsp.stat(p);
    return st.mtime.toISOString();
  } catch {
    return "(없음)";
  }
}

/**
 * 마지막 1줄 stdout (Quick Action notify 표시용)
 *  - 성공: "{case_id} 임포트 완료 ({n}개)"
 *  - 실패: "{case_id|(unknown)}: {사유}"
 */
function notifyAndExit(line, code) {
  console.log(line);
  process.exit(code);
}

/* ─── main ─── */
async function main() {
  const args = parseArgs(process.argv);

  if (!args.input) {
    printHelp();
    notifyAndExit("(unknown): 입력 경로 필요", 1);
  }

  // 절대 경로 정규화
  const input = path.resolve(args.input);

  // a. 존재·디렉토리
  let inputStat;
  try {
    inputStat = await fsp.stat(input);
  } catch {
    notifyAndExit(`(unknown): 입력 경로 없음 — ${input}`, 1);
  }
  if (!inputStat.isDirectory()) {
    notifyAndExit(`(unknown): 입력은 디렉토리여야 함 — ${input}`, 1);
  }

  // b. basename 형식
  const caseId = path.basename(input);
  if (!CASE_ID_RE.test(caseId)) {
    notifyAndExit(
      `${caseId}: basename 형식 위반 (YYYY타경NNNNNN 한글 필요)`,
      1
    );
  }
  if (args.verbose) console.log(`[a/b] case_id = ${caseId}`);

  // c. post.md 존재
  const postPath = path.join(input, "post.md");
  if (!fs.existsSync(postPath)) {
    notifyAndExit(`${caseId}: post.md 부재`, 1);
  }

  // d. data/meta.json 존재
  const metaPath = path.join(input, "data", "meta.json");
  if (!fs.existsSync(metaPath)) {
    notifyAndExit(`${caseId}: data/meta.json 부재`, 1);
  }

  // e. meta.json.case_number == basename
  let meta;
  try {
    meta = JSON.parse(await fsp.readFile(metaPath, "utf8"));
  } catch (e) {
    notifyAndExit(`${caseId}: meta.json 파싱 실패 — ${e.message}`, 1);
  }
  if (meta.case_number !== caseId) {
    notifyAndExit(
      `${caseId}: meta.json.case_number 불일치 (값="${meta.case_number}")`,
      1
    );
  }
  if (args.verbose) {
    console.log(`[c] post.md OK`);
    console.log(`[d] data/meta.json OK`);
    console.log(`[e] case_number 일치 OK`);
  }

  // f. 충돌 검사
  const dest = path.join(RAW_ROOT, caseId);
  const conflict = fs.existsSync(dest);
  if (conflict) {
    const inputN = await countFiles(input);
    const destN = await countFiles(dest);
    const inputMtime = await getMtimeIso(input);
    const destMtime = await getMtimeIso(dest);

    console.log(`[f] 충돌: raw-content/${caseId}/ 이미 존재`);
    console.log(`    기존 파일 수: ${destN}  (mtime ${destMtime})`);
    console.log(`    신규 파일 수: ${inputN}  (mtime ${inputMtime})`);

    if (!args.force) {
      const archiveHint = `raw-content/.archive/${caseId}-${nowStamp()}/`;
      console.log(
        `\n--force 로 덮어쓰려면 백업 후 진행됩니다: ${archiveHint}`
      );
      notifyAndExit(`${caseId}: 충돌 — --force 필요`, 2);
    }

    // --force 동작 (dry-run이 아닐 때만 실제 백업)
    const archiveDir = path.join(ARCHIVE_ROOT, `${caseId}-${nowStamp()}`);
    if (args.dryRun) {
      console.log(`[force/dry-run] 백업 예정 경로: ${archiveDir}`);
    } else {
      try {
        await fsp.mkdir(ARCHIVE_ROOT, { recursive: true });
        await fsp.rename(dest, archiveDir);
        console.log(`[force] 백업 완료: ${archiveDir}`);
      } catch (e) {
        notifyAndExit(`${caseId}: 백업 실패 — ${e.message}`, 3);
      }
    }
  }

  // g. dry-run 분기 (검증 통과 단계까지만)
  if (args.dryRun) {
    const inputN = await countFiles(input);
    console.log(
      `\n[dry-run] 검증 통과. 복사 대상: ${input} → raw-content/${caseId}/ (${inputN}개 파일)`
    );
    if (conflict && !args.force) {
      // 위에서 이미 exit 2 — 여기 도달하지 않음
    }
    notifyAndExit(`${caseId} 임포트 완료 (${inputN}개) — dry-run`, 0);
  }

  // h. 실제 복사
  try {
    // raw-content 자체가 없을 수도 있음 (방어)
    await fsp.mkdir(RAW_ROOT, { recursive: true });
    await fsp.cp(input, dest, { recursive: true, errorOnExist: false });
  } catch (e) {
    notifyAndExit(`${caseId}: 복사 실패 — ${e.message}`, 3);
  }

  const copiedN = await countFiles(dest);

  // i. git status 출력 (정보용)
  if (args.verbose) {
    const r = spawnSync(
      "git",
      ["status", "--short", `raw-content/${caseId}`],
      { cwd: REPO_ROOT, encoding: "utf8" }
    );
    if (r.stdout) console.log(`\n[git status]\n${r.stdout.trimEnd()}`);
  }

  notifyAndExit(`${caseId} 임포트 완료 (${copiedN}개)`, 0);
}

main().catch((e) => {
  // 예측 못한 시스템 에러
  console.error(e);
  notifyAndExit(`(unknown): 시스템 에러 — ${e.message}`, 3);
});
