"use client";

import { useState } from "react";
import { Search, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import type { ApplyFormData } from "@/types/apply";
import { COURTS_ACTIVE, COURTS_COMING_SOON } from "@/lib/constants";
import { formatKoreanWon } from "@/lib/utils";

export function Step1Property({
  data,
  posts,
  onChange,
  onNext,
}: {
  data: ApplyFormData;
  posts: AnalysisFrontmatter[];
  onChange: (patch: Partial<ApplyFormData>) => void;
  onNext: () => void;
}) {
  const [lookupError, setLookupError] = useState<string | null>(null);

  function handleLookup() {
    const q = data.caseNumber.trim();
    if (!q) {
      setLookupError("사건번호를 입력해주세요.");
      return;
    }
    const match =
      posts.find((p) => p.caseNumber === q) ??
      posts.find((p) => p.caseNumber.replace(/\s/g, "") === q.replace(/\s/g, ""));
    if (match) {
      onChange({
        matchedPost: match,
        caseNumber: match.caseNumber,
        court: match.court,
        manualEntry: false,
      });
      setLookupError(null);
    } else {
      onChange({ matchedPost: null, manualEntry: false });
      setLookupError(
        "일치하는 물건분석을 찾지 못했습니다. 사건번호를 다시 확인하거나 수동 입력으로 계속 진행할 수 있습니다."
      );
    }
  }

  function handleManual() {
    if (!data.caseNumber.trim()) {
      setLookupError("사건번호를 입력해주세요.");
      return;
    }
    onChange({ matchedPost: null, manualEntry: true });
    setLookupError(null);
    onNext();
  }

  const canProceed = !!data.matchedPost || data.manualEntry;
  const post = data.matchedPost;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Step 1
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          물건을 확인해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          사건번호로 물건을 불러와 정보가 일치하는지 확인합니다. 분석 페이지의
          &ldquo;이 물건 입찰 대리 신청&rdquo;에서 들어오신 경우 자동으로 채워집니다.
        </p>
      </header>

      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="step1-court">
            법원
          </label>
          <select
            id="step1-court"
            value={data.court}
            onChange={(e) => onChange({ court: e.target.value })}
            className="h-12 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink-900)] sm:w-48"
          >
            <optgroup label="서비스 중">
              {COURTS_ACTIVE.map((c) => (
                <option key={c.value} value={c.label}>
                  {c.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="서비스 준비 중">
              {COURTS_COMING_SOON.map((c) => (
                <option key={c.value} value={c.label} disabled>
                  {c.label}
                </option>
              ))}
            </optgroup>
          </select>
          <label className="sr-only" htmlFor="step1-case">
            사건번호
          </label>
          <input
            id="step1-case"
            type="text"
            placeholder="예: 2021타경521675"
            value={data.caseNumber}
            onChange={(e) => onChange({ caseNumber: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLookup();
              }
            }}
            className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
          />
          <button
            type="button"
            onClick={handleLookup}
            className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-[var(--color-ink-700)]"
          >
            <Search size={16} aria-hidden="true" />
            물건 확인
          </button>
        </div>
        {lookupError && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-accent-red)]"
          >
            <AlertCircle size={12} className="mt-0.5" aria-hidden="true" />
            {lookupError}
          </p>
        )}
      </div>

      {/* 매칭된 물건 표시 */}
      {post && (
        <div className="rounded-[var(--radius-xl)] border-2 border-brand-600 bg-brand-50/30 p-6">
          <div className="flex items-center gap-2 text-brand-700">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-wider">
              물건 매칭 완료
            </p>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-[var(--color-ink-900)]">
            {post.title}
          </h3>
          {post.subtitle && (
            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              {post.subtitle}
            </p>
          )}
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">법원</dt>
              <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                {post.court}
                {post.courtDivision ? ` ${post.courtDivision}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">사건번호</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {post.caseNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {post.bidDate}
                {post.bidTime ? ` ${post.bidTime}` : ""}
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs text-[var(--color-ink-500)]">주소</dt>
              <dd className="mt-1 text-sm text-[var(--color-ink-700)]">
                {post.address}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">감정가</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {post.appraisalDisplay ?? formatKoreanWon(post.appraisal)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">
                {post.round}차 최저가
              </dt>
              <dd className="mt-1 font-black tabular-nums text-[var(--color-accent-red)]">
                {post.minPriceDisplay ?? formatKoreanWon(post.minPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">유형</dt>
              <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                {post.propertyType} · {post.auctionType}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* 매칭 실패 시 수동 입력 경로 */}
      {!post && lookupError && data.caseNumber.trim() && (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 text-sm leading-6 text-[var(--color-ink-700)]">
          <p>
            사건번호{" "}
            <strong className="tabular-nums text-[var(--color-ink-900)]">
              {data.caseNumber}
            </strong>
            을(를) 수동으로 진행할 수 있습니다. 상담원이 접수 확인 시 해당
            물건의 감정가·최저가·입찰일을 확인하여 안내드립니다.
          </p>
          <button
            type="button"
            onClick={handleManual}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-900)] hover:border-brand-600 hover:text-brand-700"
          >
            수동 입력으로 계속 진행
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-6 text-sm font-black text-white shadow-[var(--shadow-card)] transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
        >
          다음: 입찰 정보 입력
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
