"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronDown,
} from "lucide-react";
import type { AnalysisFrontmatter } from "@/types/content";
import type { ApplyFormData, CourtListingSummary } from "@/types/apply";
import { BRAND_NAME, COURTS_ALL, groupCourtsByRegion } from "@/lib/constants";
import { formatKoreanWon } from "@/lib/utils";
import { PhotoGallery } from "../PhotoGallery";

/**
 * Step 1 — 법원 + 사건번호 입력.
 *
 * 설계 원칙 (2026-04-17 Stage 2A 확정):
 * - /api/orders/check → listings 배열 반환. court_listings DB 매칭 우선.
 * - listings 1건 → 자동 매칭 카드. 2건+ → 선택 UI. 0건 → frontmatter 폴백.
 * - 수동 입력과 매칭 성공은 동등한 경로.
 * - court_code 필터 (D2). 복수 매칭 선택 UI (D3).
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
  const [listings, setListings] = useState<CourtListingSummary[]>([]);

  const latestPatchRef = useRef(onChange);
  latestPatchRef.current = onChange;

  // 법원 선택 → courtCode 조회
  const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
  const courtCode = selectedCourt?.courtCode ?? "";

  // 사건번호 변경 시 디바운스된 매칭 + 중복 확인
  useEffect(() => {
    const q = data.caseNumber.trim();

    if (!q) {
      setCaseTaken(false);
      setChecking(false);
      setListings([]);
      if (data.matchedPost || data.matchedListing) {
        latestPatchRef.current({
          matchedPost: null,
          matchedListing: null,
          manualEntry: false,
        });
      }
      return;
    }

    const handle = setTimeout(async () => {
      setChecking(true);
      try {
        // /api/orders/check → 중복 확인 + court_listings 매칭
        const res = await fetch("/api/orders/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseNumber: q, courtCode, courtName: data.court }),
        });

        if (res.status === 401) {
          setCaseTaken(false);
          setListings([]);
          return;
        }

        const json = (await res.json()) as {
          available?: boolean | null;
          reason?: string;
          listings?: CourtListingSummary[];
        };

        setCaseTaken(json.available === false);

        const resultListings = json.listings ?? [];
        setListings(resultListings);

        if (resultListings.length === 1) {
          // 단일 매칭 → 자동 선택
          latestPatchRef.current({
            matchedListing: resultListings[0],
            matchedPost: null,
            manualEntry: false,
          });
        } else if (resultListings.length === 0) {
          // court_listings 매칭 없음 → frontmatter 폴백
          const fmMatch =
            posts.find((p) => p.caseNumber === q) ??
            posts.find(
              (p) =>
                p.caseNumber.replace(/\s/g, "") === q.replace(/\s/g, "")
            );

          if (fmMatch) {
            if (data.matchedPost?.slug !== fmMatch.slug) {
              latestPatchRef.current({
                matchedPost: fmMatch,
                matchedListing: null,
                caseNumber: fmMatch.caseNumber,
                manualEntry: false,
              });
            }
          } else if (data.matchedPost || data.matchedListing) {
            latestPatchRef.current({
              matchedPost: null,
              matchedListing: null,
              manualEntry: false,
            });
          }
        } else {
          // 복수 매칭 → 선택 대기 (matchedListing은 사용자가 선택해야 설정)
          if (data.matchedListing || data.matchedPost) {
            latestPatchRef.current({
              matchedPost: null,
              matchedListing: null,
              manualEntry: false,
            });
          }
        }
      } catch {
        setCaseTaken(false);
        setListings([]);
      } finally {
        setChecking(false);
      }
    }, 600);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.caseNumber, courtCode, posts]);

  const isNonServicedCourt = selectedCourt && !selectedCourt.isServiced;

  const canProceed =
    !!data.caseNumber.trim() &&
    !!data.court &&
    !caseTaken &&
    !checking;

  function handleNext() {
    if (!canProceed) return;
    // TODO(Phase 4-CONFIRM, 2026-04-19):
    // 현재 manualEntry 경로는 검증 없이 통과. Phase 4-CONFIRM에서
    // 아래 흐름으로 재설계 예정:
    // - 크롤러 매칭 성공/실패 무관하게 고객에게 사건 정보 재확인
    //   UX 통일 ("다음 사건이 맞습니까?" 체크박스)
    // - manualEntry 경로에서 매각기일·물건종류 수기 입력 필드 추가
    // - 고객 확인 체크 + KST 타임스탬프를 ApplyFormData에 저장
    // - bidDate를 ApplyFormData 레벨 non-null string으로 승격 →
    //   Phase 4-DATETIME의 (B) throw를 (A) 타입 강제로 자연 전환
    // - 위임장 PDF에 "위임인이 직접 확인·입력" 책임 조항 추가
    // - 착수 시점: Phase 5(본인인증 mock) 완료 후
    // - 추정 공수: 5~6시간 (Step1 UI + 타입 + PDF + privacy/terms)
    //
    // 현재 (Phase 4-DATETIME) 단계에서는 위임장 PDF 생성 시점
    // throw로 차단 (보강 2).
    if (!data.matchedPost && !data.matchedListing && !data.manualEntry) {
      onChange({ manualEntry: true });
    }
    onNext();
  }

  function selectListing(listing: CourtListingSummary) {
    onChange({ matchedListing: listing, matchedPost: null, manualEntry: false });
  }

  const post = data.matchedPost;
  const listing = data.matchedListing;
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
                      {c.isServiced ? " \u2713" : ""}
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
                {BRAND_NAME}은 한 물건에 한 고객만 대리 접수합니다 (이해충돌 방지).
                같은 사건번호의 회차가 끝난 뒤 다음 회차부터 다시 접수 가능합니다.
                궁금하신 점은 카카오톡으로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 복수 물건 선택 UI (D3: listings 2건 이상) */}
      {listings.length >= 2 && !caseTaken && !listing && (
        <div className="rounded-[var(--radius-xl)] border-2 border-brand-200 bg-brand-50/20 p-5">
          <div className="flex items-center gap-2 text-brand-700">
            <ChevronDown size={18} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-wider">
              이 사건에 {listings.length}개 물건이 있습니다. 선택해주세요
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {listings.map((l) => (
              <button
                key={l.docid}
                type="button"
                onClick={() => selectListing(l)}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-left transition hover:border-brand-400 hover:shadow-[var(--shadow-card)]"
              >
                <p className="text-sm font-bold text-[var(--color-ink-900)]">
                  {l.address_display}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-ink-500)]">
                  <span>{l.usage_name}</span>
                  {l.area_display && <span>{l.area_display}</span>}
                  {l.min_bid_amount != null && (
                    <span className="font-bold text-[var(--color-accent-red)]">
                      최저가 {formatKoreanWon(l.min_bid_amount)}
                    </span>
                  )}
                  {l.component_count > 1 && (
                    <span className="text-brand-600">{l.component_count}개 필지 일괄</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* court_listings 매칭 카드 (단일 매칭 또는 선택 후) */}
      {listing && !caseTaken && (
        <div className="rounded-[var(--radius-xl)] border-2 border-brand-600 bg-brand-50/30 p-6">
          <div className="flex items-center gap-2 text-brand-700">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-wider">
              대법원 경매정보에서 물건을 확인했습니다
            </p>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-[var(--color-ink-900)]">
            {listing.address_display}
          </h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">입찰일</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {listing.bid_date ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">감정가</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {listing.appraisal_amount != null
                  ? formatKoreanWon(listing.appraisal_amount)
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">
                최저가 (유찰 {listing.failed_count}회)
              </dt>
              <dd className="mt-1 font-black tabular-nums text-[var(--color-accent-red)]">
                {listing.min_bid_amount != null
                  ? formatKoreanWon(listing.min_bid_amount)
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">용도</dt>
              <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                {listing.usage_name ?? "-"}
              </dd>
            </div>
            {listing.area_display && (
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">면적</dt>
                <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                  {listing.area_display}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">법원</dt>
              <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                {listing.court_name}
              </dd>
            </div>
            {listing.component_count > 1 && (
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">구성</dt>
                <dd className="mt-1 font-bold text-brand-600">
                  {listing.component_count}개 필지 일괄 매각
                </dd>
              </div>
            )}
          </dl>
          {/* 사진 갤러리 (온디맨드 로드) */}
          <PhotoGallery docid={listing.docid} />
          {/* 복수 물건 사건에서 다른 물건 선택 가능 */}
          {listings.length >= 2 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  matchedListing: null,
                  matchedPost: null,
                  manualEntry: false,
                })
              }
              className="mt-2 ml-3 text-xs font-medium text-[var(--color-ink-500)] underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              다른 물건 선택
            </button>
          )}
        </div>
      )}

      {/* frontmatter 매칭 (폴백, court_listings에 없을 때) */}
      {post && !listing && !caseTaken && (
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
