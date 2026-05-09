"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Info, X } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import type { PropertyType } from "@/types/content";
import {
  CASE_CONFIRM_CHECKBOX_LABEL,
  USER_INPUT_LIABILITY_NOTICE,
} from "@/lib/legal";
import { getKSTDateTimeIso } from "@/lib/datetime";
import { AddressSearch, type AddressSearchResult } from "./AddressSearch";

const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
  "아파트",
  "다세대주택",
  "빌라",
  "오피스텔",
  "단독주택",
  "토지",
  "상가",
  "공장",
  "기타",
];

const OTHER_PREFIX = "기타 - ";
// Phase 6.7.6 manualEntry 매각회차 드롭다운 옵션
const ROUND_OPTIONS: number[] = [1, 2, 3, 4, 5];
const ROUND_CUSTOM = "custom";

// Stage 2 cycle 1-A 보강 5 — error state border/ring 분기.
const inputBase =
  "h-12 w-full rounded-xl bg-white px-4 text-base text-[#111418] placeholder:text-gray-400 transition-colors duration-150 focus:outline-none";
const inputBorderNormal =
  "border border-gray-200 focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20";
const inputBorderError =
  "border border-red-500 ring-2 ring-red-500/20";

function fieldClass(hasError: boolean, extra = ""): string {
  const border = hasError ? inputBorderError : inputBorderNormal;
  return `${inputBase} ${border}${extra ? ` ${extra}` : ""}`;
}

function Required() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-red-500">
      *
    </span>
  );
}

interface Props {
  data: ApplyFormData;
  onChange: (patch: Partial<ApplyFormData>) => void;
  /**
   * "사건번호 다시 입력" 버튼 콜백 (Phase 6.3 회귀 수정 — 2026-04-19).
   * X 버튼/배경/Esc dismiss 차단 원칙은 유지하되, 사용자가 manualEntry 진입을
   * 의도하지 않은 경우 (잘못 입력한 사건번호 등) 모달에서 명시적으로 빠져나갈 경로 제공.
   */
  onReturn: () => void;
}

function getSelectValue(v: string): string {
  if (!v) return "";
  if (v === "기타" || v.startsWith(OTHER_PREFIX)) return "기타";
  return v;
}

function getOtherText(v: string): string {
  if (v.startsWith(OTHER_PREFIX)) return v.slice(OTHER_PREFIX.length);
  return "";
}

/**
 * manualEntry 강제 확인 모달 (Phase 4-CONFIRM 회귀 수정 — P0-2).
 *
 * 게이트 무력화 차단:
 * - X 버튼 미표시
 * - 배경 클릭 dismiss 차단 (모달 wrapper onClick 무동작)
 * - Esc 키 dismiss 차단 (preventDefault)
 * - "확인" 버튼만이 유일한 dismiss 경로
 * - "확인" 버튼은 입력 4종(bidDate/propertyType/propertyAddress/"기타"시 자유텍스트) +
 *   책임 조항 동의 체크박스 모두 만족 시에만 실제 진행 (보강 5: 미충족 클릭 시 error state 노출).
 *
 * caseConfirmedAt 기록 시점: "확인" 버튼 클릭 시 (체크박스 ON 단독으로는 set 안 함).
 */
export function CaseConfirmModal({ data, onChange, onReturn }: Props) {
  const submitRef = useRef<HTMLButtonElement>(null);
  // Stage 2 cycle 1-A 보강 5 — first invalid scroll 대상 wrapper refs.
  const bidDateRef = useRef<HTMLDivElement>(null);
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  const propertyTypeOtherRef = useRef<HTMLDivElement>(null);
  const propertyAddressRef = useRef<HTMLDivElement>(null);
  const auctionRoundRef = useRef<HTMLDivElement>(null);
  const agreedRef = useRef<HTMLDivElement>(null);

  const [agreed, setAgreed] = useState(false);
  // Phase 6.7.6 매각회차. ROUND_OPTIONS(1~5) 외 값은 "직접 입력" 모드.
  const [roundMode, setRoundMode] = useState<string>(() =>
    ROUND_OPTIONS.includes(data.auctionRound) ? String(data.auctionRound) : ROUND_CUSTOM,
  );
  const [customRound, setCustomRound] = useState<string>(() =>
    ROUND_OPTIONS.includes(data.auctionRound) ? "" : String(data.auctionRound),
  );
  // Stage 2 cycle 1-A 보강 5 — 단일 활성 모드 paradigm + 상세주소 + error state.
  // 도로명 미선택(propertyAddress 빈 string) = AddressSearch default mount.
  // 도로명 선택 후 = readonly box + "변경" 버튼.
  const [originalAddress] = useState<string>(data.propertyAddress);
  const [addressDetail, setAddressDetail] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  function handleAddressSelect(addr: AddressSearchResult) {
    onChange({ propertyAddress: addr.full });
    setAddressDetail("");
  }

  function handleAddressChange() {
    // "변경" 버튼 클릭 = 활성 모드 복귀 + propertyAddress reset + addressDetail clear.
    onChange({ propertyAddress: "" });
    setAddressDetail("");
  }

  function handleAddressRestore() {
    onChange({ propertyAddress: originalAddress });
    setAddressDetail("");
  }

  const addressChanged =
    !!originalAddress && data.propertyAddress !== originalAddress;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    submitRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      // 강제 모달: Esc 차단 (입력 + 체크 + "확인" 외에 dismiss 불가)
      if (e.key === "Escape") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const selectValue = getSelectValue(data.propertyType);
  const otherText = getOtherText(data.propertyType);

  function handleSelectPropertyType(value: string) {
    onChange({ propertyType: value });
  }

  function handleOtherTextChange(text: string) {
    onChange({
      propertyType: text.trim() ? `${OTHER_PREFIX}${text}` : "기타",
    });
  }

  const otherTextOk = selectValue !== "기타" || !!otherText.trim();
  // 회차 유효성: 드롭다운 1~5면 바로 OK, custom은 숫자 >= 1 필요
  const resolvedRound =
    roundMode === ROUND_CUSTOM
      ? parseInt(customRound, 10)
      : parseInt(roundMode, 10);
  const roundOk = Number.isFinite(resolvedRound) && resolvedRound >= 1;
  const canConfirm =
    !!data.bidDate &&
    !!data.propertyType &&
    selectValue !== "" &&
    otherTextOk &&
    !!data.propertyAddress.trim() &&
    roundOk &&
    agreed;

  // Stage 2 cycle 1-A 보강 5 — field-level error 분해 (showErrors 광역 toggle + 사용자 입력 시 자동 해제).
  const errors = {
    bidDate: !data.bidDate,
    propertyType: selectValue === "",
    propertyTypeOther: selectValue === "기타" && !otherText.trim(),
    propertyAddress: !data.propertyAddress.trim(),
    auctionRound: !roundOk,
    agreed: !agreed,
  };

  function handleConfirm() {
    if (!canConfirm) {
      setShowErrors(true);
      const order: Array<[boolean, React.RefObject<HTMLDivElement | null>]> = [
        [errors.bidDate, bidDateRef],
        [errors.propertyType, propertyTypeRef],
        [errors.propertyTypeOther, propertyTypeOtherRef],
        [errors.propertyAddress, propertyAddressRef],
        [errors.auctionRound, auctionRoundRef],
        [errors.agreed, agreedRef],
      ];
      for (const [hasError, ref] of order) {
        if (hasError && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        }
      }
      return;
    }
    const detail = addressDetail.trim();
    const patch: Partial<ApplyFormData> = {
      caseConfirmedByUser: true,
      caseConfirmedAt: getKSTDateTimeIso(),
      auctionRound: resolvedRound,
    };
    if (detail) {
      patch.propertyAddress = `${data.propertyAddress} ${detail}`;
    }
    onChange(patch);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      // 배경 클릭 dismiss 차단 — 의도적 무동작
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              aria-hidden="true"
              className="text-[var(--color-ink-900)]"
            />
            <h2
              id="case-confirm-modal-title"
              className="text-[length:var(--text-body)] font-black text-[var(--color-ink-900)]"
            >
              사건 정보 입력
            </h2>
          </div>
          <button
            type="button"
            onClick={onReturn}
            aria-label="사건번호 다시 입력"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-[#111418] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
          <p className="text-sm leading-6 text-gray-600">
            사건 정보를 입력하고 일치 여부를 확인해주세요.
          </p>

          <div ref={bidDateRef}>
            <label
              htmlFor="modal-bid-date"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              매각기일
              <Required />
            </label>
            <input
              id="modal-bid-date"
              type="date"
              value={data.bidDate}
              onChange={(e) => onChange({ bidDate: e.target.value })}
              className={fieldClass(showErrors && errors.bidDate)}
            />
            {showErrors && errors.bidDate && (
              <p className="mt-1.5 text-sm text-red-500">
                매각기일을 입력해주세요.
              </p>
            )}
          </div>

          <div ref={propertyTypeRef}>
            <label
              htmlFor="modal-property-type"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              물건 종류
              <Required />
            </label>
            <select
              id="modal-property-type"
              value={selectValue}
              onChange={(e) => handleSelectPropertyType(e.target.value)}
              className={fieldClass(showErrors && errors.propertyType)}
            >
              <option value="">선택해주세요</option>
              {PROPERTY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {showErrors && errors.propertyType && (
              <p className="mt-1.5 text-sm text-red-500">
                물건 종류를 선택해주세요.
              </p>
            )}
          </div>

          {selectValue === "기타" && (
            <div ref={propertyTypeOtherRef}>
              <label
                htmlFor="modal-property-type-other"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                직접 입력
                <Required />
              </label>
              <input
                id="modal-property-type-other"
                type="text"
                placeholder="예: 임야, 근린생활시설 등"
                value={otherText}
                onChange={(e) => handleOtherTextChange(e.target.value)}
                className={fieldClass(showErrors && errors.propertyTypeOther)}
              />
              {showErrors && errors.propertyTypeOther && (
                <p className="mt-1.5 text-sm text-red-500">
                  직접 입력 항목을 작성해주세요.
                </p>
              )}
            </div>
          )}

          <div ref={propertyAddressRef}>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              물건 주소
              <Required />
            </label>
            {!data.propertyAddress ? (
              <>
                <AddressSearch onSelect={handleAddressSelect} />
                {addressChanged && (
                  <button
                    type="button"
                    onClick={handleAddressRestore}
                    className="mt-2 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-[#111418]"
                  >
                    원래 주소로 복구
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="modal-property-address"
                    type="text"
                    readOnly
                    value={data.propertyAddress}
                    className={fieldClass(
                      showErrors && errors.propertyAddress,
                      "cursor-default bg-gray-50 sm:flex-1",
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleAddressChange}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-[#111418] transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 sm:w-auto sm:shrink-0"
                  >
                    변경
                  </button>
                </div>
                <div className="mt-3">
                  <label
                    htmlFor="modal-address-detail"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    상세주소
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      (선택)
                    </span>
                  </label>
                  <input
                    id="modal-address-detail"
                    type="text"
                    placeholder="예: 101동 1502호"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>
                {addressChanged && (
                  <button
                    type="button"
                    onClick={handleAddressRestore}
                    className="mt-2 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-[#111418]"
                  >
                    원래 주소로 복구
                  </button>
                )}
              </>
            )}
            {showErrors && errors.propertyAddress && (
              <p className="mt-1.5 text-sm text-red-500">
                물건 주소를 입력해주세요.
              </p>
            )}
          </div>

          <div ref={auctionRoundRef}>
            <label
              htmlFor="modal-auction-round"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              매각회차
              <Required />
            </label>
            <div className="flex items-center gap-2">
              <select
                id="modal-auction-round"
                value={roundMode}
                onChange={(e) => setRoundMode(e.target.value)}
                className={fieldClass(showErrors && errors.auctionRound)}
              >
                {ROUND_OPTIONS.map((r) => (
                  <option key={r} value={String(r)}>
                    {r === 1 ? "1차 (신건)" : `${r}차 매각`}
                  </option>
                ))}
                <option value={ROUND_CUSTOM}>직접 입력</option>
              </select>
              {roundMode === ROUND_CUSTOM && (
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="회차 숫자"
                  value={customRound}
                  onChange={(e) => setCustomRound(e.target.value.replace(/\D/g, ""))}
                  className={fieldClass(
                    showErrors && errors.auctionRound,
                    "w-32 tabular-nums",
                  )}
                />
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              같은 사건번호라도 회차가 다르면 별도 접수로 처리됩니다.
            </p>
            {showErrors && errors.auctionRound && (
              <p className="mt-1.5 text-sm text-red-500">
                매각회차를 1 이상 입력해주세요.
              </p>
            )}
          </div>

          {/* Phase 6 UX 수정: 빨간 경고 톤 → 슬레이트 뉴트럴 안내 톤.
              강제 모달 진입 시점이라 추가 주의 환기 불필요. legal.ts 단일 출처(USER_INPUT_LIABILITY_NOTICE) 유지. */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-1.5">
              <Info
                size={14}
                aria-hidden="true"
                className="shrink-0 text-gray-500"
              />
              <p className="text-sm font-bold text-gray-700">위임인 책임</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              {USER_INPUT_LIABILITY_NOTICE}
            </p>
          </div>

          <div ref={agreedRef}>
            <label
              className={`flex cursor-pointer items-start gap-2 transition-colors duration-150 ${
                showErrors && errors.agreed
                  ? "rounded-xl border border-red-500 bg-red-50/30 p-3"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#00C853]"
              />
              <span className="flex-1 text-sm leading-6 text-[#111418]">
                {CASE_CONFIRM_CHECKBOX_LABEL}
              </span>
            </label>
            {showErrors && errors.agreed && (
              <p className="mt-1.5 text-sm text-red-500">
                위임 책임에 동의해주세요.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onReturn}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-[#111418] transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 sm:w-auto"
            >
              사건번호 다시 입력
            </button>
            <button
              ref={submitRef}
              type="button"
              onClick={handleConfirm}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-green)] px-6 text-sm font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 sm:w-auto sm:flex-1"
            >
              확인
            </button>
          </div>
          <p className="text-center text-xs leading-5 text-gray-500">
            * 모든 항목을 입력해야 진행할 수 있습니다. 사건번호가 잘못된 경우 좌측{" "}
            <span className="font-bold text-[#111418]">
              &ldquo;사건번호 다시 입력&rdquo;
            </span>{" "}
            버튼을 눌러주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
