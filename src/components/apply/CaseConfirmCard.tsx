"use client";

import { CheckCircle2, Edit3 } from "lucide-react";
import type { ApplyFormData } from "@/types/apply";
import {
  CASE_CONFIRM_CHECKBOX_LABEL,
} from "@/lib/legal";
import { getKSTDateTimeIso } from "@/lib/datetime";

interface Props {
  data: ApplyFormData;
  onChange: (patch: Partial<ApplyFormData>) => void;
  mode: "matched" | "manual";
}

/**
 * 사건 정보 확인 카드 (Phase 4-CONFIRM 회귀 수정 — P0-2).
 *
 * mode="matched": 매칭 성공 시 자동 채움된 정보 읽기 전용 + 인라인 체크박스
 *   → 체크 ON 시 즉시 caseConfirmedByUser=true + caseConfirmedAt set
 *
 * mode="manual": 강제 모달이 입력 + 체크 + "확인" 처리.
 *   - caseConfirmedByUser=true 시: 읽기 전용 요약 + "정보 수정" 버튼
 *     (수정 버튼 클릭 시 caseConfirmedByUser=false reset → 모달 재오픈)
 *   - caseConfirmedByUser=false 시: null 반환 (모달이 처리 중이므로 인라인 표시 안 함)
 */
export function CaseConfirmCard({ data, onChange, mode }: Props) {
  if (mode === "manual" && !data.caseConfirmedByUser) {
    return null;
  }

  function handleCheck(checked: boolean) {
    onChange({
      caseConfirmedByUser: checked,
      caseConfirmedAt: checked ? getKSTDateTimeIso() : null,
    });
  }

  function handleEditManual() {
    // caseConfirmedByUser=false reset → Step1Property에서 모달 재오픈
    onChange({
      caseConfirmedByUser: false,
      caseConfirmedAt: null,
    });
  }

  const isManual = mode === "manual";

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          {isManual ? "사건 정보 (직접 입력 완료)" : "사건 정보 확인"}
        </h3>
        {isManual && (
          <button
            type="button"
            onClick={handleEditManual}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink-900)] underline-offset-2 hover:underline"
          >
            <Edit3 size={12} aria-hidden="true" />
            정보 수정
          </button>
        )}
      </div>

      {!isManual && (
        <p className="mt-2 text-xs leading-5 text-[var(--color-ink-500)]">
          위 사건 정보가 본인이 의뢰하려는 사건과 일치하는지 확인해주세요.
        </p>
      )}

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

      {!isManual && (
        // matched 경로: 인라인 체크박스. manual 경로는 모달의 "확인"이 이미 set한 상태이므로 체크박스 불필요.
        <label className="mt-5 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={data.caseConfirmedByUser}
            onChange={(e) => handleCheck(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink-900)]"
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
      )}

      {isManual && data.caseConfirmedAt && (
        <p className="mt-4 inline-flex items-center gap-1 text-xs text-[var(--color-ink-500)]">
          <CheckCircle2 size={12} aria-hidden="true" />
          확인 시각 기록됨 · 위임인 책임 조항 동의 완료
        </p>
      )}
    </section>
  );
}
