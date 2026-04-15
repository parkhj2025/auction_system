"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ArrowRight, Info } from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import type { ApplyFormData } from "@/types/apply";
import { COURTS_ALL, groupCourtsByRegion } from "@/lib/constants";
import { formatKoreanWon } from "@/lib/utils";

/**
 * Step 1 — 법원 + 사건번호 입력.
 *
 * 설계 원칙 (2026-04-15 확정):
 * - "검색 UX"가 아니라 "정보 입력 UX"로 설계. 사건번호 매칭은 뒤에서 조용히
 *   동작하고, 매칭 실패는 에러가 아닌 정상 경로.
 * - 수동 입력과 매칭 성공은 동등한 경로. 분기 버튼 없음.
 * - 법원은 전국 전체를 선택 가능. 서비스 불가 지역도 선택 가능하며, 접수 후
 *   관리자가 /admin에서 반려·협력사 안내 처리. (isServiced 플래그는 안내
 *   배너용)
 * - 사건번호가 변경되면 600ms 디바운스 후 자동으로 프론트매터 매칭 + 중복
 *   확인을 수행.
 */
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
  const [caseTaken, setCaseTaken] = useState(false);
  const [checking, setChecking] = useState(false);

  // 최신 data 참조를 effect에서 안전하게 쓰기 위한 ref
  const latestPatchRef = useRef(onChange);
  latestPatchRef.current = onChange;

  // 사건번호 변경 시 디바운스된 매칭 + 중복 확인
  useEffect(() => {
    const q = data.caseNumber.trim();

    // 빈 입력이면 이전 상태 초기화
    if (!q) {
      setCaseTaken(false);
      setChecking(false);
      if (data.matchedPost) {
        latestPatchRef.current({ matchedPost: null, manualEntry: false });
      }
      return;
    }

    const handle = setTimeout(async () => {
      // 1. 프론트매터 사건번호 매칭 (정확 일치 또는 공백 제거 일치)
      const match =
        posts.find((p) => p.caseNumber === q) ??
        posts.find(
          (p) => p.caseNumber.replace(/\s/g, "") === q.replace(/\s/g, "")
        );

      if (match) {
        // 이미 동일한 매칭이면 onChange 호출하지 않아 루프 방지
        if (data.matchedPost?.slug !== match.slug) {
          latestPatchRef.current({
            matchedPost: match,
            caseNumber: match.caseNumber,
            manualEntry: false,
          });
        }
      } else if (data.matchedPost) {
        // 사건번호가 수정되어 더 이상 매칭되지 않음
        latestPatchRef.current({ matchedPost: null, manualEntry: false });
      }

      // 2. 중복 접수 확인 (매칭 여부와 무관)
      setChecking(true);
      try {
        const res = await fetch("/api/orders/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseNumber: q }),
        });
        if (res.status === 401) {
          // 미로그인 — 미들웨어가 이미 /login 리다이렉트를 처리했을 것.
          // 여기서는 게이팅 해제로 폴백.
          setCaseTaken(false);
        } else {
          const json = (await res.json()) as {
            available?: boolean | null;
          };
          setCaseTaken(json.available === false);
        }
      } catch {
        // 네트워크 에러 시 통과 (서버 UNIQUE INDEX가 2차 방어)
        setCaseTaken(false);
      } finally {
        setChecking(false);
      }
    }, 600);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.caseNumber, posts]);

  const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
  const isNonServicedCourt = selectedCourt && !selectedCourt.isServiced;

  const canProceed =
    !!data.caseNumber.trim() &&
    !!data.court &&
    !caseTaken &&
    !checking;

  function handleNext() {
    if (!canProceed) return;
    // 매칭된 포스트가 없으면 수동 입력으로 표시 (에러 아님)
    if (!data.matchedPost && !data.manualEntry) {
      onChange({ manualEntry: true });
    }
    onNext();
  }

  const post = data.matchedPost;
  const regionGroups = groupCourtsByRegion();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-brand-600">
          Step 1
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          법원과 사건번호를 입력해주세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          선택하신 법원과 사건번호로 접수를 진행합니다. 물건의 상세 정보
          (감정가·최저가·입찰일 등)는 접수 확인 시 카카오톡으로 안내드립니다.
        </p>
      </header>

      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <div>
            <label
              htmlFor="step1-court"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              법원
            </label>
            <select
              id="step1-court"
              value={data.court}
              onChange={(e) => onChange({ court: e.target.value })}
              className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink-900)]"
            >
              {regionGroups.map((group) => (
                <optgroup key={group.region} label={group.region}>
                  {group.courts.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                      {c.isServiced ? " ✓" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="step1-case"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              사건번호
            </label>
            <input
              id="step1-case"
              type="text"
              placeholder="예: 2024타경12345"
              value={data.caseNumber}
              onChange={(e) => onChange({ caseNumber: e.target.value })}
              className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base tabular-nums text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-500)]">
          법원은 전국 어느 법원이든 선택할 수 있습니다. 사건번호는 법원 고유 포맷
          (예: 2024타경12345)으로 입력해주세요.
        </p>
      </div>

      {/* 서비스 불가 지역 안내 (차단 아님) */}
      {isNonServicedCourt && (
        <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
          <div className="text-xs leading-5 text-[var(--color-ink-700)]">
            <strong className="text-[var(--color-ink-900)]">
              {data.court}
            </strong>
            은(는) 현재 직접 대리 서비스 지역이 아닙니다. 접수하시면 관리자가
            확인 후 처리 가능 여부 또는 협력사 연결을 안내드립니다. 인천지방법원
            외 지역은 수임까지 시간이 더 걸릴 수 있습니다.
          </div>
        </div>
      )}

      {/* 이미 접수 진행 중 배너 (차단) */}
      {caseTaken && (
        <div
          role="alert"
          className="rounded-[var(--radius-xl)] border-2 border-[var(--color-accent-red)] bg-red-50 p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-[var(--color-accent-red)]"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-black text-[var(--color-accent-red)]">
                이미 접수가 진행 중인 물건입니다
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
                경매퀵은 한 물건에 한 고객만 대리 접수합니다 (이해충돌 방지).
                같은 사건번호의 회차가 끝난 뒤 다음 회차부터 다시 접수 가능합니다.
                궁금하신 점은 카카오톡으로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 매칭된 물건 (보너스 — 있으면 좋고 없어도 정상) */}
      {post && !caseTaken && (
        <div className="rounded-[var(--radius-xl)] border-2 border-brand-600 bg-brand-50/30 p-6">
          <div className="flex items-center gap-2 text-brand-700">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-wider">
              이 물건은 저희 분석 글에 소개되어 있습니다
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
              <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {post.bidDate}
                {post.bidTime ? ` ${post.bidTime}` : ""}
              </dd>
            </div>
            <div className="col-span-2">
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

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleNext}
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
