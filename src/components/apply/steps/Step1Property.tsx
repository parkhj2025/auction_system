"use client";

// cycle 1-D-A-2 = 모바일 앱 form 토큰 광역 (input 56 / 라벨 16 / CTA 56 / gap 28).
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronDown,
  Loader2,
} from "lucide-react";
import type { ApplyFormData, CourtListingSummary } from "@/types/apply";
import { COURTS_ALL, groupCourtsByRegion } from "@/lib/constants";
import { cn, formatKoreanWon } from "@/lib/utils";
import { PhotoGallery } from "../PhotoGallery";
import { CaseConfirmCard } from "../CaseConfirmCard";
import { CaseConfirmModal } from "../CaseConfirmModal";

/**
 * 사건번호 정규식 — `2024타경12345` 형식 (Phase 6.3 회귀 수정 — 2026-04-19).
 * 매칭 조회 + manualEntry 자동 진입은 정규식 통과 시점에만 발동.
 * 부분 입력(예: "2099타경") 상태에서는 fetch/manualEntry/모달 모두 차단되어
 * 사용자가 끝까지 타이핑할 수 있다.
 */
const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;

/**
 * Step 1 — 법원 + 사건번호 입력 + 사건 정보 확인.
 *
 * 설계 원칙 (2026-04-19 Phase 4-CONFIRM 확정):
 * - /api/orders/check → listings 배열 반환. court_listings DB 매칭 우선.
 * - listings 1건 → 자동 매칭 카드. 2건+ → 선택 UI. 0건 → frontmatter 폴백.
 * - 매칭 성공/실패 무관 모든 경로에서 CaseConfirmCard 통일 UX 적용.
 * - 매칭 성공 시 bidDate/propertyType/propertyAddress 자동 복사,
 *   manualEntry 시 사용자 직접 입력 (네이티브 input[type=date], select, text).
 * - data.bidDate && data.caseConfirmedByUser 둘 다 truthy일 때만 다음 Step 진입.
 * - case 변경 시 매칭/입력값 + caseConfirmedByUser/caseConfirmedAt 모두 reset.
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
  const [checking, setChecking] = useState(false);
  const [listings, setListings] = useState<CourtListingSummary[]>([]);
  // cycle 1-D-A-2: 매칭 상태 banner (checking / nomatch 3초 노출 사후 manualEntry 자동 진입).
  const [matchStatus, setMatchStatus] = useState<
    "idle" | "checking" | "nomatch"
  >("idle");
  const nomatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestPatchRef = useRef(onChange);
  latestPatchRef.current = onChange;

  const selectedCourt = COURTS_ALL.find((c) => c.label === data.court);
  const courtCode = selectedCourt?.courtCode ?? "";

  // Phase 6 회귀 수정 (P0): 사용자 caseNumber 변경 시 매칭 state reset만 처리.
  // 매칭 조회는 명시적 액션(Enter/Blur/"사건번호 확인" 버튼)에서만 발동 — onChange 실시간 조회 완전 제거.
  // 정규식 \d+가 1자리 이상 허용하여 타이핑 중 모든 중간값이 트리거되던 문제 본질적 해결.
  useEffect(() => {
    // cycle 1-D-A-2: 사용자 입력 변경 시 nomatch 타이머 광역 cancel + matchStatus reset.
    if (nomatchTimerRef.current) {
      clearTimeout(nomatchTimerRef.current);
      nomatchTimerRef.current = null;
    }
    setMatchStatus("idle");
    setCaseTaken(false);
    setCaseClosed(false);
    setListings([]);
    if (
      data.matchedListing ||
      data.manualEntry ||
      data.bidDate ||
      data.propertyType ||
      data.propertyAddress ||
      data.caseConfirmedByUser
    ) {
      latestPatchRef.current({
        matchedListing: null,
        manualEntry: false,
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
   * 사건번호 매칭 조회 — 명시적 액션 트리거 (Phase 6 회귀 수정 P0).
   * 트리거 3곳: input onKeyDown(Enter), input onBlur, "사건번호 확인" 버튼.
   * 빈 입력 / 정규식 미통과 / 이미 조회 중 → 즉시 return.
   */
  async function triggerLookup() {
    const q = data.caseNumber.trim();
    if (!q) return;
    if (!CASE_NUMBER_PATTERN.test(q)) return;
    if (checking) return;

    setChecking(true);
    setMatchStatus("checking");
    try {
      const res = await fetch("/api/orders/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseNumber: q, courtCode, courtName: data.court }),
      });

      if (res.status === 401) {
        setCaseTaken(false);
        setListings([]);
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

      // cycle 1-D-A-4: case_status="closed" 분기 (종결 사건 광역 안내 + 차단).
      if (resultListings.length === 0 && json.case_status === "closed") {
        setCaseClosed(true);
        setMatchStatus("idle");
        return;
      }

      if (resultListings.length === 1) {
        const l = resultListings[0];
        setMatchStatus("idle");
        latestPatchRef.current({
          matchedListing: l,
          manualEntry: false,
          bidDate: l.bid_date ?? "",
          propertyType: l.usage_name ?? "",
          propertyAddress: l.address_display ?? "",
          caseConfirmedByUser: false,
          caseConfirmedAt: null,
          auctionRound: l.auction_round,
        });
      } else if (resultListings.length === 0) {
        // cycle 1-D-A-4: 대법원 fetch 단독 paradigm (Cowork 콘텐츠 매칭 광역 폐기).
        // 매칭 0건 → 3초 안내 사후 manualEntry 자동 진입.
        setMatchStatus("nomatch");
        nomatchTimerRef.current = setTimeout(() => {
          latestPatchRef.current({
            matchedListing: null,
            manualEntry: true,
            bidDate: "",
            propertyType: "",
            propertyAddress: "",
            caseConfirmedByUser: false,
            caseConfirmedAt: null,
            auctionRound: 1,
          });
          setMatchStatus("idle");
          nomatchTimerRef.current = null;
        }, 3000);
      } else {
        // 복수 매칭 → 사용자가 selectListing으로 선택 대기
        setMatchStatus("idle");
        latestPatchRef.current({
          matchedListing: null,
          manualEntry: false,
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
  // manualEntry/매칭 두 경로 모두 동일 게이트 적용.
  const canProceed =
    !!data.caseNumber.trim() &&
    !!data.court &&
    !caseTaken &&
    !caseClosed &&
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
      manualEntry: false,
      bidDate: listing.bid_date ?? "",
      propertyType: listing.usage_name ?? "",
      propertyAddress: listing.address_display ?? "",
      caseConfirmedByUser: false,
      caseConfirmedAt: null,
      // Phase 6.7.6: 매칭 경로는 listing.auction_round 자동 결정 (사용자 변경 불가).
      auctionRound: listing.auction_round,
    });
  }

  // cycle 1-D-A-4: matchedPost 광역 폐기 (대법원 fetch 단독 paradigm).
  const listing = data.matchedListing;
  const regionGroups = groupCourtsByRegion();

  const showMatchedConfirm = !caseTaken && !!listing;
  const showManualConfirm = !caseTaken && data.manualEntry;

  return (
    <div className="flex flex-col gap-6">
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
              className="mb-2.5 block text-[var(--label-fs-app)] font-bold text-[var(--color-ink-700)]"
            >
              사건번호
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
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
                  "inline-flex h-[var(--cta-h-app)] w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors duration-150 sm:w-auto sm:shrink-0",
                  data.caseConfirmedByUser
                    ? "cursor-default bg-gray-100 text-gray-500"
                    : "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
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

      {/* cycle 1-D-A-2: 매칭 상태 banner */}
      {matchStatus === "checking" && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[var(--color-info)]/30 bg-[var(--color-info-soft)] px-4 py-3 text-sm font-medium text-[var(--color-info)]"
        >
          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
          사건 정보 조회 중...
        </div>
      )}
      {matchStatus === "nomatch" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-warning)]"
        >
          <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <p>
            사건 정보를 자동으로 가져올 수 없습니다. 잠시 후 직접 입력 화면으로 이동합니다.
          </p>
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

      {/* cycle 1-D-A-4: 종결 사건 안내 (차단) */}
      {caseClosed && (
        <div
          role="alert"
          className="rounded-[var(--radius-xl)] border-2 border-[var(--color-accent-red)] bg-red-50 p-5"
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-[var(--color-accent-red)]"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-black text-[var(--color-accent-red)]">
                이 사건은 매각이 종결됐습니다
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
                대법원 경매정보에 따르면 본 사건은 종결 또는 매각기일이 지났습니다.
                다른 사건번호로 다시 검색해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 이미 접수 진행 중 배너 (차단) */}
      {caseTaken && (
        <div
          role="alert"
          className="rounded-[var(--radius-xl)] border-2 border-[var(--color-accent-red)] bg-red-50 p-5"
        >
          <div className="flex items-start gap-2">
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
                한 물건당 한 분만 대리 접수합니다. 같은 사건번호라도 회차가
                바뀌면 다시 접수하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 복수 물건 선택 UI (D3: listings 2건 이상) */}
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
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-left transition hover:border-[var(--color-ink-700)] hover:shadow-[var(--shadow-card)]"
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

      {/* court_listings 매칭 카드 (단일 매칭 또는 선택 후) */}
      {listing && !caseTaken && (
        <div className="rounded-[var(--radius-xl)] border-2 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/50 p-6">
          <div className="flex items-center gap-2 text-[var(--color-ink-900)]">
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
              <dt className="text-xs text-[var(--color-ink-500)]">최저가</dt>
              <dd className="mt-1 font-black tabular-nums text-[var(--color-accent-red)]">
                {listing.min_bid_amount != null
                  ? formatKoreanWon(listing.min_bid_amount)
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
          {/* 사진 갤러리 (온디맨드 로드) */}
          <PhotoGallery docid={listing.docid} />
          {/* 복수 물건 사건에서 다른 물건 선택 가능 */}
          {listings.length >= 2 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  matchedListing: null,
                  manualEntry: false,
                  bidDate: "",
                  propertyType: "",
                  propertyAddress: "",
                  caseConfirmedByUser: false,
                  caseConfirmedAt: null,
                  auctionRound: 1,
                })
              }
              className="mt-2 ml-3 text-xs font-semibold text-[var(--color-ink-500)] underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              다른 물건 선택
            </button>
          )}
          {/* 1-D-A 출처 표기 */}
          <p className="mt-4 border-t border-[var(--color-ink-200)] pt-3 text-xs text-gray-500">
            출처: 대법원 경매정보 (KOGL Type 1)
          </p>
        </div>
      )}

      {/* cycle 1-D-A-4: frontmatter 매칭 (Cowork 콘텐츠) 카드 광역 폐기.
          대법원 fetch 단독 paradigm → matchedListing 카드 단독. */}

      {/* 1-D-A 면책 alert — 사건 정보 영역 표시 시 노출 */}
      {(showMatchedConfirm || showManualConfirm) && (
        <div
          role="note"
          className="rounded-xl border border-red-500 bg-red-50/30 p-4"
        >
          <p className="text-sm font-bold leading-6 text-[var(--color-accent-red)]">
            🚩 입찰 정보는 대법원 경매정보 원본을 직접 확인하셔야 합니다.
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-xs leading-5 text-[var(--color-ink-700)]">
            <li>· 경매 정보는 대법원 경매정보 사이트 기반으로 제공됩니다.</li>
            <li>· 정보 오류로 인한 책임은 부담하지 않습니다.</li>
            <li>· 입찰보증금은 안전한 입찰을 위해 100원 단위 올림 처리됩니다.</li>
          </ul>
        </div>
      )}

      {/* Phase 4-CONFIRM: 사건 정보 확인 카드 + 강제 모달.
          - matched: 인라인 카드 + 인라인 체크박스
          - manual: 강제 모달(미확인 상태) → "확인" 클릭 후 인라인 읽기 전용 카드 + "정보 수정" 버튼 */}
      {showMatchedConfirm && (
        <CaseConfirmCard data={data} onChange={onChange} mode="matched" />
      )}
      {showManualConfirm && (
        <CaseConfirmCard data={data} onChange={onChange} mode="manual" />
      )}
      {showManualConfirm && !data.caseConfirmedByUser && (
        <CaseConfirmModal
          data={data}
          onChange={onChange}
          onReturn={() => {
            // Phase 6.3 회귀 수정: 모달에서 명시적 dismiss 경로.
            // 단일 onChange 호출로 9개 필드 일괄 reset (race condition 차단 + 가독성).
            // useEffect 빈 처리 분기에 의존하지 않고 onReturn 자신이 제어하는 모든 상태 명시.
            // 본인인증 정보(verified/verifiedName/verifiedAt)는 의도적 미포함 — 재입력 시 유지.
            // 강제 모달의 X/배경/Esc 차단 원칙은 유지.
            onChange({
              caseNumber: "",
              matchedListing: null,
              manualEntry: false,
              bidDate: "",
              propertyType: "",
              propertyAddress: "",
              caseConfirmedByUser: false,
              caseConfirmedAt: null,
            });
          }}
        />
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            "inline-flex min-h-[var(--cta-h-app)] items-center gap-2 rounded-full px-6 text-sm font-black transition-colors duration-150",
            canProceed
              ? "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-deep)]"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          )}
        >
          다음: 입찰 정보 입력
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
