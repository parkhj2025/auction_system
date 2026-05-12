"use client";

// cycle 1-D-A-2 = 모바일 앱 form 토큰 (input 56 / 라벨 16 / CTA 56 / gap 28).
// cycle 1-D-A-4-2 = manualEntry/CaseConfirmCard/CaseConfirmModal 영구 폐기 + amber alert + 인라인 카드 통합.
// cycle 1-D-A-4-2 paradigm 회수 = 사이드바 영구 폐기 + 단일 카드 paradigm + 모바일/데스크탑 일관성 + 입력 form §A-9 정합.
//   - 카드 padding p-5 단독 (lg:p-7/p-8 영구 폐기) / bg-white 통일 / sm:grid 광역 영구 폐기 → flex flex-col gap-4.
//   - 데이터 row grid grid-cols-2 gap-x-4 gap-y-4 / 최저가 + 보증금 col-span-2 typography 단독 강조 (박스 폐기).
//   - 사진 grid = hero + thumbnail strip paradigm (모바일 + 데스크탑 동일).
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Info,
  ChevronDown,
  Loader2,
} from "lucide-react";
import type { ApplyFormData, CourtListingSummary } from "@/types/apply";
import { COURTS_ALL, groupCourtsByRegion } from "@/lib/constants";
import { cn, formatKoreanWon } from "@/lib/utils";
import { CASE_CONFIRM_CHECKBOX_LABEL } from "@/lib/legal";
import { getKSTDateTimeIso } from "@/lib/datetime";
import { PhotoGallery } from "../PhotoGallery";
import { ConfirmCaseModal } from "../ConfirmCaseModal";

const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;

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
  const [caseFetchFailed, setCaseFetchFailed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [listings, setListings] = useState<CourtListingSummary[]>([]);
  const [matchStatus, setMatchStatus] = useState<"idle" | "checking">("idle");
  // cycle 1-D-A-4-2 보강 1: 체크박스 click → modal trigger paradigm.
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const latestPatchRef = useRef(onChange);
  latestPatchRef.current = onChange;

  // cycle 1-D-A-4 정정 2: 첫 mount 시점 reset skip (이중 방어 paradigm).
  const isFirstMountRef = useRef(true);

  const caseNumberInputRef = useRef<HTMLInputElement>(null);

  const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
  const courtCode = selectedCourt?.courtCode ?? "";

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    setMatchStatus("idle");
    setCaseTaken(false);
    setCaseClosed(false);
    setCaseNotFound(false);
    setCaseFetchFailed(false);
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
    setCaseFetchFailed(false);

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
        case_status?: "active" | "closed" | "not_found" | "fetch_failed";
      };

      setCaseTaken(json.available === false);

      const resultListings = json.listings ?? [];
      setListings(resultListings);

      if (resultListings.length === 0 && json.case_status === "fetch_failed") {
        setCaseFetchFailed(true);
        setMatchStatus("idle");
        return;
      }

      if (resultListings.length === 0 && json.case_status === "closed") {
        setCaseClosed(true);
        setMatchStatus("idle");
        return;
      }

      if (
        resultListings.length === 0 &&
        json.case_status !== "closed" &&
        json.case_status !== "fetch_failed"
      ) {
        setCaseNotFound(true);
        setMatchStatus("idle");
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

  // cycle 1-D-A-4-2 보강 1: 체크박스 click → modal trigger / "확인" → Step2 / "취소" → 회복.
  // Step1 = 동의 step paradigm = 본문 CTA dom 영구 폐기 (Step2~4 = CTA 보존 / §A-12 톤앤매너 일관성 정합).
  function handleCheckboxChange(checked: boolean) {
    if (checked) {
      // 체크 즉시 시각 반영 + caseConfirmedAt 백엔드 timestamp 기록 (UI 노출 영역 0).
      onChange({
        caseConfirmedByUser: true,
        caseConfirmedAt: getKSTDateTimeIso(),
      });
      setConfirmModalOpen(true);
    } else {
      // re-uncheck (사용자 광역 직접 해제)
      onChange({
        caseConfirmedByUser: false,
        caseConfirmedAt: null,
      });
    }
  }

  function handleModalConfirm() {
    // cycle 1-D-A-4-2 final: setStep(2) 자동 진입 영구 폐기 → Step1 머무름 + 체크 paradigm.
    // 체크박스 = checked 보존 / form.caseConfirmedAt 백엔드 기록 보존 / 사용자 직접 본문 CTA 클릭 시점 광역 setStep(2).
    setConfirmModalOpen(false);
  }

  function handleModalCancel() {
    // checked 회복 (uncheck) + Step1 머무름.
    onChange({
      caseConfirmedByUser: false,
      caseConfirmedAt: null,
    });
    setConfirmModalOpen(false);
  }

  function selectListing(listing: CourtListingSummary) {
    onChange({
      matchedListing: listing,
      bidDate: listing.bid_date ?? "",
      propertyType: listing.usage_name ?? "",
      propertyAddress: listing.address_display ?? "",
      caseConfirmedByUser: false,
      caseConfirmedAt: null,
      auctionRound: listing.auction_round,
    });
  }

  const listing = data.matchedListing;
  const regionGroups = groupCourtsByRegion();

  // 입찰보증금 = 최저가 × (재경매 20% / 일반 10%) — Step2 rebid 광역 사용자 입력 사후 정정 paradigm.
  const depositRate = data.bidInfo.rebid ? "20%" : "10%";
  const deposit =
    listing && listing.min_bid_amount != null
      ? Math.round(listing.min_bid_amount * (data.bidInfo.rebid ? 0.2 : 0.1))
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* cycle 1-D-A-4-2 보강 1: h2 페이지 헤더 paradigm 신규 도입 (Toss/카뱅 모바일 앱 standard 정합).
          sub = 단일 매칭 카드 헤더 카피 흡수 paradigm. */}
      <header>
        <h2 className="text-2xl font-black leading-[1.2] tracking-[-0.015em] text-[var(--color-ink-900)]">
          사건 정보 확인
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          의뢰하실 사건 정보가 맞는지 확인해주세요
        </p>
      </header>

      {/* 입력 form 카드 (§A-9 정합 = sm:grid 폐기 + p-5 단독 + bg-white) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4">
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
                  "inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-bold transition-colors duration-150 sm:w-auto sm:shrink-0",
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
        <p className="mt-4 text-xs text-[var(--color-ink-500)]">
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

      {/* 사건번호 NG — fetch_failed 분기 (amber / 일시 NG paradigm / cycle 1-G-γ-α-ε) */}
      {caseFetchFailed && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-warning)]"
        >
          <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">사건 정보 확인이 일시적으로 어렵습니다</p>
            <p className="mt-1 text-xs leading-5">
              잠시 후 다시 시도해주세요. 계속 진행이 어려우신 경우 직접 상담을 신청해주세요.
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-[var(--color-ink-900)]">
            <ChevronDown size={18} aria-hidden="true" />
            <p className="text-sm font-bold text-[var(--color-ink-900)]">
              이 사건에 {listings.length}개 물건이 있습니다. 선택해주세요
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
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

      {/* 단일 카드 paradigm — 모바일 + 데스크탑 광역 동일 dom (§A-9 + §A-12 정합).
          cycle 1-D-A-4-2 보강 1 = 카드 헤더 dom 영구 폐기 (h2 페이지 헤더 광역 sub로 흡수 정합).
          톤앤매너 일관성 회수 = form 카드 paradigm 정합 (border border-gray-200 / bg-white / p-5). */}
      {listing && !caseTaken && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          {/* 주소 h3 (카드 안 헤더 dom 영구 폐기 / 주소 단독 첫 dom) */}
          <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
            {listing.address_display}
          </h3>

          {/* 사진 4-col 동등 grid (모바일 + 데스크탑 동일 paradigm) */}
          <PhotoGallery docid={listing.docid} />

          {/* 데이터 single column paradigm (grid-cols-2 영구 폐기 / 모바일 + 데스크탑 동일).
              텍스트 hierarchy = dt 14 font-medium ink-500 (subtle) / dd 16 font-bold ink-900.
              차용 source: 카카오뱅크 거래 상세 paradigm 정수. */}
          <dl className="mt-5 flex flex-col gap-4">
            <div>
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">입찰일</dt>
              <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
                {listing.bid_date ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">감정가</dt>
              <dd className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
                {listing.appraisal_amount != null
                  ? formatKoreanWon(listing.appraisal_amount)
                  : "-"}
              </dd>
            </div>

            {/* 최저가 = border-t divider + text-2xl typography 단독 강조 paradigm */}
            <div className="border-t border-[var(--color-ink-200)] pt-4">
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">최저가</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums text-[var(--color-accent-red)]">
                {listing.min_bid_amount != null
                  ? formatKoreanWon(listing.min_bid_amount)
                  : "-"}
              </dd>
            </div>

            {/* 입찰보증금 = text-lg typography 단독 강조 paradigm */}
            {deposit !== null && (
              <div>
                <dt className="text-sm font-medium text-[var(--color-ink-500)]">
                  입찰보증금 · 최저가 {depositRate}
                </dt>
                <dd className="mt-1 text-lg font-black tabular-nums text-[var(--color-ink-900)]">
                  {formatKoreanWon(deposit)}
                </dd>
              </div>
            )}

            <div className="border-t border-[var(--color-ink-200)] pt-4">
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">매각회차</dt>
              <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
                {listing.failed_count === 0
                  ? "신건"
                  : `${listing.failed_count + 1}차 매각`}
                {listing.failed_count >= 1 && (
                  <span className="ml-2 text-xs font-medium text-[var(--color-ink-500)]">
                    유찰 {listing.failed_count}회
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">용도</dt>
              <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
                {listing.usage_name ?? "-"}
              </dd>
            </div>
            {listing.area_display && (
              <div>
                <dt className="text-sm font-medium text-[var(--color-ink-500)]">면적</dt>
                <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
                  {listing.area_display}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-[var(--color-ink-500)]">법원</dt>
              <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
                {listing.court_name}
              </dd>
            </div>
            {listing.component_count > 1 && (
              <div>
                <dt className="text-sm font-medium text-[var(--color-ink-500)]">구성</dt>
                <dd className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
                  {listing.component_count}개 필지 일괄 매각
                </dd>
              </div>
            )}
          </dl>

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
              className="mt-4 text-xs font-semibold text-[var(--color-ink-500)] underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              다른 물건 선택
            </button>
          )}

          {/* 체크박스 + 라벨 (footer ul 영구 폐기 / 3 항목 카피 = ConfirmCaseModal 안 광역 이전).
              체크 click → modal open trigger paradigm.
              "확인 시각 기록됨" UI dom 영구 폐기 (백엔드 timestamp 단독 보존). */}
          <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-[var(--color-ink-200)] pt-5">
            <input
              type="checkbox"
              checked={data.caseConfirmedByUser}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--brand-green)]"
            />
            <span className="flex-1 text-base leading-7 text-[var(--color-ink-900)]">
              {CASE_CONFIRM_CHECKBOX_LABEL}
            </span>
          </label>
        </div>
      )}

      {/* cycle 1-D-A-4-2 final: 본문 "다음: 입찰 정보 입력" CTA 부활 paradigm.
          사용자 직접 진입 paradigm = modal "확인" 사후 Step1 머무름 + 사용자 CTA 클릭 시점 광역 setStep(2). */}
      {listing && !caseTaken && (
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={!data.caseConfirmedByUser}
            className={cn(
              "inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-xl px-8 text-base font-black transition-colors duration-150 lg:w-auto lg:px-10",
              data.caseConfirmedByUser
                ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            )}
          >
            다음: 입찰 정보 입력
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* cycle 1-D-A-4-2 보강 1: 사건 정보 이중 확인 modal */}
      <ConfirmCaseModal
        isOpen={confirmModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

    </div>
  );
}
