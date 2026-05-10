"use client";

// cycle 1-D-A-2 = 모바일 앱 form 토큰 (input 56 / 라벨 16 / CTA 56 / gap 28).
// cycle 1-D-A-4-2 = manualEntry/CaseConfirmCard/CaseConfirmModal 영구 폐기 + amber alert + 인라인 카드 통합 paradigm.
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Info,
  ChevronDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { ApplyFormData, CourtListingSummary } from "@/types/apply";
import { COURTS_ALL, groupCourtsByRegion } from "@/lib/constants";
import { cn, formatKoreanWon } from "@/lib/utils";
import { CASE_CONFIRM_CHECKBOX_LABEL } from "@/lib/legal";
import { getKSTDateTimeIso } from "@/lib/datetime";
import { PhotoGallery } from "../PhotoGallery";

/**
 * 사건번호 정규식 — `2024타경12345` 형식 (Phase 6.3 회귀 수정 — 2026-04-19).
 * 매칭 조회는 정규식 통과 시점에만 발동.
 */
const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;

/**
 * Step 1 — 법원 + 사건번호 입력 + 사건 정보 확인.
 *
 * cycle 1-D-A-4-2 paradigm:
 * - manualEntry 영구 폐기 → 매칭 성공 단독 경로.
 * - CaseConfirmCard / CaseConfirmModal 광역 영구 폐기 → 인라인 매칭 카드 통합 (1 카드 paradigm).
 * - 사건번호 NG 분기:
 *   - case_status="not_found" → amber alert "사건번호를 다시 확인해주세요" + input focus 자동.
 *   - case_status="closed" → amber alert "이 사건은 매각이 종결됐습니다".
 *   - case_status="active" → 인라인 카드 + 사이드바 mount.
 * - 영역 분리: desktop 사이드바 단독 데이터 hub / 인라인 = action focus.
 *   mobile 인라인 = 풀 데이터 + 사진 + 체크박스 통합.
 * - 색상 paradigm: amber 광역 (--color-warning + --color-warning-soft) / red = caseTaken 한정 (행동차단).
 */
export function Step1Property({
  data,
  onChange,
  onNext,
}: {
  data: ApplyFormData;
  onChange: (patch: Partial<ApplyFormData>) => void;
  onNext: () => void;
}) {
  const [caseTaken, setCaseTaken] = useState(false);
  const [caseClosed, setCaseClosed] = useState(false);
  const [caseNotFound, setCaseNotFound] = useState(false);
  const [checking, setChecking] = useState(false);
  const [listings, setListings] = useState<CourtListingSummary[]>([]);
  const [matchStatus, setMatchStatus] = useState<"idle" | "checking">("idle");

  const latestPatchRef = useRef(onChange);
  latestPatchRef.current = onChange;

  // cycle 1-D-A-4 정정 2: 첫 mount 시점 reset skip (이중 방어 paradigm).
  const isFirstMountRef = useRef(true);

  // 사건번호 input ref — case_status="not_found" 광역 자동 focus paradigm.
  const caseNumberInputRef = useRef<HTMLInputElement>(null);

  const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
  const courtCode = selectedCourt?.courtCode ?? "";

  // Phase 6 회귀 수정 (P0): 사용자 caseNumber 변경 시 매칭 state reset만 처리.
  // 매칭 조회는 명시적 액션(Enter/Blur/"사건번호 확인" 버튼)에서만 발동.
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    setMatchStatus("idle");
    setCaseTaken(false);
    setCaseClosed(false);
    setCaseNotFound(false);
    setListings([]);
    if (
      data.matchedListing ||
      data.bidDate ||
      data.propertyType ||
      data.propertyAddress ||
      data.caseConfirmedByUser
    ) {
      latestPatchRef.current({
        matchedListing: null,
        bidDate: "",
        propertyType: "",
        propertyAddress: "",
        caseConfirmedByUser: false,
        caseConfirmedAt: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.caseNumber, courtCode]);

  /**
   * 사건번호 매칭 조회 — 명시적 액션 트리거.
   * 트리거 3곳: input onKeyDown(Enter), input onBlur, "사건번호 확인" 버튼.
   * cycle 1-D-A-4-2: nomatch 3초 timer + manualEntry 자동 진입 paradigm 광역 폐기.
   */
  async function triggerLookup() {
    const q = data.caseNumber.trim();
    if (!q) return;
    if (!CASE_NUMBER_PATTERN.test(q)) return;
    if (checking) return;

    setChecking(true);
    setMatchStatus("checking");
    setCaseTaken(false);
    setCaseClosed(false);
    setCaseNotFound(false);

    try {
      const res = await fetch("/api/orders/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseNumber: q, courtCode, courtName: data.court }),
      });

      if (res.status === 401) {
        setMatchStatus("idle");
        return;
      }

      const json = (await res.json()) as {
        available?: boolean | null;
        reason?: string;
        listings?: CourtListingSummary[];
        case_status?: "active" | "closed" | "not_found";
      };

      setCaseTaken(json.available === false);

      const resultListings = json.listings ?? [];
      setListings(resultListings);

      // case_status="closed" 분기 (종결 사건 amber 안내 + 차단).
      if (resultListings.length === 0 && json.case_status === "closed") {
        setCaseClosed(true);
        setMatchStatus("idle");
        return;
      }

      // case_status="not_found" 분기 (manualEntry 폐기 / 재시도 paradigm).
      if (resultListings.length === 0 && json.case_status !== "closed") {
        setCaseNotFound(true);
        setMatchStatus("idle");
        // 사건번호 input 광역 자동 focus paradigm (재입력 유도).
        caseNumberInputRef.current?.focus();
        return;
      }

      if (resultListings.length === 1) {
        const l = resultListings[0];
        setMatchStatus("idle");
        latestPatchRef.current({
          matchedListing: l,
          bidDate: l.bid_date ?? "",
          propertyType: l.usage_name ?? "",
          propertyAddress: l.address_display ?? "",
          caseConfirmedByUser: false,
          caseConfirmedAt: null,
          auctionRound: l.auction_round,
        });
      } else {
        // 복수 매칭 → 사용자가 selectListing으로 선택 대기
        setMatchStatus("idle");
        latestPatchRef.current({
          matchedListing: null,
          bidDate: "",
          propertyType: "",
          propertyAddress: "",
          caseConfirmedByUser: false,
          caseConfirmedAt: null,
          auctionRound: 1,
        });
      }
    } catch {
      setCaseTaken(false);
      setListings([]);
      setMatchStatus("idle");
    } finally {
      setChecking(false);
    }
  }

  const isNonServicedCourt = selectedCourt && !selectedCourt.isServiced;

  // Phase 4-CONFIRM 게이트: bidDate + caseConfirmedByUser 둘 다 truthy 필수.
  const canProceed =
    !!data.caseNumber.trim() &&
    !!data.court &&
    !caseTaken &&
    !caseClosed &&
    !caseNotFound &&
    !checking &&
    !!data.bidDate &&
    !!data.caseConfirmedByUser;

  function handleNext() {
    if (!canProceed) return;
    onNext();
  }

  function selectListing(listing: CourtListingSummary) {
    onChange({
      matchedListing: listing,
      bidDate: listing.bid_date ?? "",
      propertyType: listing.usage_name ?? "",
      propertyAddress: listing.address_display ?? "",
      caseConfirmedByUser: false,
      caseConfirmedAt: null,
      // Phase 6.7.6: 매칭 경로는 listing.auction_round 자동 결정.
      auctionRound: listing.auction_round,
    });
  }

  function handleConfirmCheck(checked: boolean) {
    onChange({
      caseConfirmedByUser: checked,
      caseConfirmedAt: checked ? getKSTDateTimeIso() : null,
    });
  }

  const listing = data.matchedListing;
  const regionGroups = groupCourtsByRegion();

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <header>
        <h2 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          법원과 사건번호를 입력해주세요
        </h2>
        <p className="mt-2 text-base leading-6 text-[var(--color-ink-700)]">
          사건번호로 접수를 진행합니다.
        </p>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-8">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <div>
            <label
              htmlFor="step1-court"
              className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-700)]"
            >
              법원
            </label>
            <select
              id="step1-court"
              value={data.court}
              onChange={(e) => onChange({ court: e.target.value })}
              className="h-[var(--input-h-app)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-[length:var(--text-body)] font-semibold text-[var(--color-ink-900)]"
            >
              {regionGroups.map((group) => (
                <optgroup key={group.region} label={group.region}>
                  {group.courts.map((c) => (
                    <option
                      key={c.label}
                      value={c.label}
                      disabled={!c.isServiced}
                      className={c.isServiced ? "" : "text-gray-400"}
                    >
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
              className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-700)]"
            >
              사건번호
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={caseNumberInputRef}
                id="step1-case"
                type="text"
                placeholder="예: 2024타경12345"
                value={data.caseNumber}
                onChange={(e) =>
                  onChange({
                    caseNumber: e.target.value,
                    caseConfirmedByUser: false,
                    caseConfirmedAt: null,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void triggerLookup();
                  }
                }}
                onBlur={() => void triggerLookup()}
                className="h-[var(--input-h-app)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-[length:var(--text-body)] tabular-nums text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] transition-colors duration-150 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 sm:flex-1"
              />
              <button
                type="button"
                onClick={() => void triggerLookup()}
                disabled={
                  checking ||
                  !CASE_NUMBER_PATTERN.test(data.caseNumber.trim()) ||
                  data.caseConfirmedByUser
                }
                className={cn(
                  "inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-full px-5 text-base font-bold transition-colors duration-150 sm:w-auto sm:shrink-0",
                  data.caseConfirmedByUser
                    ? "cursor-default bg-gray-100 text-gray-500"
                    : "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400",
                )}
              >
                {data.caseConfirmedByUser
                  ? "확인 완료"
                  : checking
                    ? "확인 중..."
                    : "사건번호 확인"}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-500)]">
          현재 인천지방법원 본원만 신청 가능합니다. 서비스 지역은 점차 확대될
          예정입니다.
        </p>
      </div>

      {/* 매칭 상태 banner (info / amber) */}
      {matchStatus === "checking" && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--color-info)]/30 bg-[var(--color-info-soft)] px-4 py-3 text-sm font-medium text-[var(--color-info)]"
        >
          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
          사건 정보 조회 중...
        </div>
      )}

      {/* 서비스 불가 지역 안내 (차단 아님) */}
      {isNonServicedCourt && (
        <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
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

      {/* 사건번호 NG — 종결 분기 (amber) */}
      {caseClosed && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-warning)]"
        >
          <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">이 사건은 매각이 종결됐습니다</p>
            <p className="mt-1 text-xs leading-5">
              매각기일이 지났거나 절차가 종료되었습니다. 다른 사건번호로 다시 검색해주세요.
            </p>
          </div>
        </div>
      )}

      {/* 사건번호 NG — 미발견 분기 (amber + input focus 자동) */}
      {caseNotFound && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-warning)]"
        >
          <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">사건번호를 다시 확인해주세요</p>
            <p className="mt-1 text-xs leading-5">
              입력하신 사건번호로 매물을 찾지 못했습니다. 사건번호와 법원이 정확한지 확인 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      )}

      {/* 이미 접수 진행 중 (red — 영구 룰 §9 행동차단 한정 정합) */}
      {caseTaken && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-accent-red)]/30 bg-red-50 px-4 py-3 text-sm leading-6 text-[var(--color-accent-red)]"
        >
          <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">이미 접수가 진행 중인 물건입니다</p>
            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
              한 물건당 한 분만 대리 접수합니다. 같은 사건번호라도 회차가
              바뀌면 다시 접수하실 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 복수 물건 선택 UI (listings 2건 이상) */}
      {listings.length >= 2 && !caseTaken && !listing && (
        <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-ink-200)] bg-[var(--color-ink-50)]/40 p-5">
          <div className="flex items-center gap-2 text-[var(--color-ink-900)]">
            <ChevronDown size={18} aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-wider">
              이 사건에 {listings.length}개 물건이 있습니다. 선택해주세요
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            {listings.map((l) => (
              <button
                key={l.docid}
                type="button"
                onClick={() => selectListing(l)}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-left transition-colors duration-150 hover:border-[var(--color-ink-700)] hover:shadow-[var(--shadow-card)]"
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
                    <span className="text-[var(--color-ink-900)]">{l.component_count}개 필지 일괄</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 인라인 매칭 카드 (CaseConfirmCard 통합 / 1 카드 paradigm).
          desktop = action focus 단독 (헤더 + h3 + sub line + 체크박스)
          mobile = 풀 데이터 dl + photos + 체크박스 통합 */}
      {listing && !caseTaken && (
        <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/50 p-5 lg:p-7">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            의뢰하실 사건 정보가 맞는지 확인해주세요
          </p>
          <h3 className="mt-3 text-lg font-black tracking-tight text-[var(--color-ink-900)] lg:text-xl">
            {listing.address_display}
          </h3>
          <p className="mt-2 text-sm tabular-nums text-[var(--color-ink-700)] lg:text-base">
            {listing.bid_date ?? "-"}
            {listing.min_bid_amount != null && (
              <>
                {" · 최저가 "}
                <span className="font-black text-[var(--color-accent-red)]">
                  {formatKoreanWon(listing.min_bid_amount)}
                </span>
              </>
            )}
          </p>

          {/* 모바일 단독: 풀 데이터 dl + 사진 (사이드바 영역 0 시점 대체 paradigm) */}
          <div className="lg:hidden">
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">감정가</dt>
                <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                  {listing.appraisal_amount != null
                    ? formatKoreanWon(listing.appraisal_amount)
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-500)]">매각회차</dt>
                <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                  {listing.failed_count === 0
                    ? "신건"
                    : `${listing.failed_count + 1}차 매각`}
                </dd>
                {listing.failed_count >= 1 && (
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-500)]">
                    유찰 {listing.failed_count}회
                  </p>
                )}
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
                  <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                    {listing.component_count}개 필지 일괄 매각
                  </dd>
                </div>
              )}
            </dl>
            <PhotoGallery docid={listing.docid} variant="hero" />
          </div>

          {/* 복수 물건 사건에서 다른 물건 선택 가능 */}
          {listings.length >= 2 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  matchedListing: null,
                  bidDate: "",
                  propertyType: "",
                  propertyAddress: "",
                  caseConfirmedByUser: false,
                  caseConfirmedAt: null,
                  auctionRound: 1,
                })
              }
              className="mt-3 text-xs font-semibold text-[var(--color-ink-500)] underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              다른 물건 선택
            </button>
          )}

          {/* 체크박스 (CaseConfirmCard 통합 paradigm) */}
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 hover:bg-white/50">
            <input
              type="checkbox"
              checked={data.caseConfirmedByUser}
              onChange={(e) => handleConfirmCheck(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--brand-green)]"
            />
            <span className="flex-1 text-base leading-7 text-[var(--color-ink-900)]">
              {CASE_CONFIRM_CHECKBOX_LABEL}
              {data.caseConfirmedByUser && data.caseConfirmedAt && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-ink-500)]">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  확인 시각 기록됨
                </span>
              )}
            </span>
          </label>
        </div>
      )}

      {/* 면책 alert (amber 3줄 / 매칭 카드 노출 시 단독) */}
      {listing && !caseTaken && (
        <div
          role="note"
          className="rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-warning)]"
        >
          <ul className="flex flex-col gap-1">
            <li>· 입찰 전 사건 정보를 한 번 더 확인해주세요</li>
            <li>· 정보 오류로 인한 책임은 부담하지 않습니다</li>
            <li>· 입찰가는 만원 단위로 올림 처리됩니다</li>
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-full px-8 text-base font-black transition-colors duration-150 sm:w-auto sm:px-10",
            canProceed
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          )}
        >
          다음: 입찰 정보 입력
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
