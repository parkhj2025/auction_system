"use client";

import { CheckCircle2 } from "lucide-react";
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

const inputClass =
  "h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]";

interface Props {
  data: ApplyFormData;
  onChange: (patch: Partial<ApplyFormData>) => void;
  mode: "matched" | "manual";
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

export function CaseConfirmCard({ data, onChange, mode }: Props) {
  const isManual = mode === "manual";
  const selectValue = getSelectValue(data.propertyType);
  const otherText = getOtherText(data.propertyType);

  function handleCheck(checked: boolean) {
    onChange({
      caseConfirmedByUser: checked,
      caseConfirmedAt: checked ? getKSTDateTimeIso() : null,
    });
  }

  function handleSelectPropertyType(value: string) {
    onChange({ propertyType: value });
  }

  function handleOtherTextChange(text: string) {
    onChange({
      propertyType: text.trim() ? `${OTHER_PREFIX}${text}` : "기타",
    });
  }

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
        {isManual ? "사건 정보 직접 입력" : "사건 정보 확인"}
      </h3>

      {isManual ? (
        <>
          <p className="mt-2 text-xs leading-5 text-[var(--color-ink-500)]">
            대법원 경매정보 매칭이 되지 않아 직접 입력이 필요합니다. 매각기일은
            법원 공고를 직접 확인해주세요.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="confirm-bid-date"
                className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
              >
                매각기일
              </label>
              <input
                id="confirm-bid-date"
                type="date"
                value={data.bidDate}
                onChange={(e) => onChange({ bidDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-property-type"
                className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
              >
                물건 종류
              </label>
              <select
                id="confirm-property-type"
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
              <div className="sm:col-span-2">
                <label
                  htmlFor="confirm-property-type-other"
                  className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
                >
                  물건 종류 (직접 입력)
                </label>
                <input
                  id="confirm-property-type-other"
                  type="text"
                  placeholder="예: 임야, 근린생활시설 등"
                  value={otherText}
                  onChange={(e) => handleOtherTextChange(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="confirm-property-address"
                className="mb-1 block text-xs font-bold text-[var(--color-ink-700)]"
              >
                물건 주소
              </label>
              <input
                id="confirm-property-address"
                type="text"
                placeholder="예: 인천광역시 미추홀구 ..."
                value={data.propertyAddress}
                onChange={(e) => onChange({ propertyAddress: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] p-4">
            <p className="text-xs font-bold text-[var(--color-accent-red)]">
              위임인 책임
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-700)]">
              {USER_INPUT_LIABILITY_NOTICE}
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-xs leading-5 text-[var(--color-ink-500)]">
            위 사건 정보가 본인이 의뢰하려는 사건과 일치하는지 확인해주세요.
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">매각기일</dt>
              <dd className="mt-1 font-bold tabular-nums text-[var(--color-ink-900)]">
                {data.bidDate || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-500)]">물건 종류</dt>
              <dd className="mt-1 font-bold text-[var(--color-ink-900)]">
                {data.propertyType || "-"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-[var(--color-ink-500)]">주소</dt>
              <dd className="mt-1 text-sm text-[var(--color-ink-700)]">
                {data.propertyAddress || "-"}
              </dd>
            </div>
          </dl>
        </>
      )}

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={data.caseConfirmedByUser}
          onChange={(e) => handleCheck(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
        />
        <span className="flex-1 text-sm leading-6 text-[var(--color-ink-900)]">
          {CASE_CONFIRM_CHECKBOX_LABEL}
          {data.caseConfirmedByUser && data.caseConfirmedAt && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-ink-500)]">
              <CheckCircle2 size={12} aria-hidden="true" />
              확인 시각 기록됨
            </span>
          )}
        </span>
      </label>
    </section>
  );
}
