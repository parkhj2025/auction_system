"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Info } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import type { PropertyType } from "@/types/content";
import {
  CASE_CONFIRM_CHECKBOX_LABEL,
  USER_INPUT_LIABILITY_NOTICE,
} from "@/lib/legal";
import { getKSTDateTimeIso } from "@/lib/datetime";

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

const inputClass =
  "h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]";

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
 *   책임 조항 동의 체크박스 모두 만족 시에만 enabled
 *
 * caseConfirmedAt 기록 시점: "확인" 버튼 클릭 시 (체크박스 ON 단독으로는 set 안 함).
 */
export function CaseConfirmModal({ data, onChange, onReturn }: Props) {
  const submitRef = useRef<HTMLButtonElement>(null);
  const [agreed, setAgreed] = useState(false);
  // Phase 6.7.6 매각회차. ROUND_OPTIONS(1~5) 외 값은 "직접 입력" 모드.
  const [roundMode, setRoundMode] = useState<string>(() =>
    ROUND_OPTIONS.includes(data.auctionRound) ? String(data.auctionRound) : ROUND_CUSTOM,
  );
  const [customRound, setCustomRound] = useState<string>(() =>
    ROUND_OPTIONS.includes(data.auctionRound) ? "" : String(data.auctionRound),
  );

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

  function handleConfirm() {
    if (!canConfirm) return;
    onChange({
      caseConfirmedByUser: true,
      caseConfirmedAt: getKSTDateTimeIso(),
      auctionRound: resolvedRound,
    });
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
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-6 py-4">
          <ShieldCheck
            size={18}
            aria-hidden="true"
            className="text-brand-600"
          />
          <h2
            id="case-confirm-modal-title"
            className="text-base font-black text-[var(--color-ink-900)]"
          >
            사건 정보 입력
          </h2>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <p className="text-xs leading-5 text-[var(--color-ink-500)]">
            법원, 사건번호, 매각기일, 물건 종류, 주소를 입력해주세요. 아래 정보가
            본인이 의뢰하려는 사건과 일치하는지 확인 후 &ldquo;확인&rdquo; 버튼으로
            진행해주세요.
          </p>

          <div>
            <label
              htmlFor="modal-bid-date"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              매각기일
            </label>
            <input
              id="modal-bid-date"
              type="date"
              value={data.bidDate}
              onChange={(e) => onChange({ bidDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="modal-property-type"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              물건 종류
            </label>
            <select
              id="modal-property-type"
              value={selectValue}
              onChange={(e) => handleSelectPropertyType(e.target.value)}
              className={inputClass}
            >
              <option value="">선택해주세요</option>
              {PROPERTY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {selectValue === "기타" && (
            <div>
              <label
                htmlFor="modal-property-type-other"
                className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
              >
                물건 종류 (직접 입력)
              </label>
              <input
                id="modal-property-type-other"
                type="text"
                placeholder="예: 임야, 근린생활시설 등"
                value={otherText}
                onChange={(e) => handleOtherTextChange(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="modal-property-address"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              물건 주소
            </label>
            <input
              id="modal-property-address"
              type="text"
              placeholder="예: 인천광역시 미추홀구 ..."
              value={data.propertyAddress}
              onChange={(e) => onChange({ propertyAddress: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="modal-auction-round"
              className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
            >
              매각회차
            </label>
            <div className="flex items-center gap-2">
              <select
                id="modal-auction-round"
                value={roundMode}
                onChange={(e) => setRoundMode(e.target.value)}
                className={inputClass}
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
                  className={`${inputClass} w-32 tabular-nums`}
                />
              )}
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-ink-500)]">
              같은 사건번호라도 회차가 다르면 별도 접수로 처리됩니다.
            </p>
          </div>

          {/* Phase 6 UX 수정: 빨간 경고 톤 → 슬레이트 뉴트럴 안내 톤.
              강제 모달 진입 시점이라 추가 주의 환기 불필요. legal.ts 단일 출처(USER_INPUT_LIABILITY_NOTICE) 유지. */}
          <div className="rounded-[var(--radius-md)] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-1.5">
              <Info
                size={14}
                aria-hidden="true"
                className="shrink-0 text-slate-500"
              />
              <p className="text-xs font-bold text-slate-700">
                위임인 책임
              </p>
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
              {USER_INPUT_LIABILITY_NOTICE}
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
            />
            <span className="flex-1 text-sm leading-6 text-[var(--color-ink-900)]">
              {CASE_CONFIRM_CHECKBOX_LABEL}
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReturn}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)]"
            >
              사건번호 수정
            </button>
            <button
              ref={submitRef}
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand-600 px-4 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
            >
              확인
            </button>
          </div>
          <p className="text-center text-[10px] leading-4 text-[var(--color-ink-500)]">
            * 모든 항목을 입력하고 책임 조항에 동의해야 &ldquo;확인&rdquo;으로 진행할 수
            있습니다. 사건번호 자체를 잘못 입력한 경우 좌측 &ldquo;사건번호 다시 입력&rdquo;
            버튼으로 Step 1 입력 화면으로 돌아갈 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
