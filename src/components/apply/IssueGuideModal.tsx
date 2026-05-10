"use client";

import { useEffect } from "react";

/**
 * cycle 1-D-A-4-3 재진입 — 첨부 서류 발급 방법 안내 모달.
 *
 * 정보 모달 paradigm 정수 (ConfirmCaseModal 강제 모달 paradigm 광역 분리):
 * - backdrop click 닫기 = 보존 (사용자 자유 paradigm)
 * - ESC 키 닫기 = 보존
 * - "확인" CTA 단독 (취소 영역 0)
 *
 * 양 서류 sequential paradigm:
 * - 인감증명서 (주민센터 또는 무인발급기 / 1통 600원)
 * - 본인서명사실확인서 (주민센터 / 무료)
 * - 사용자 자유 선택 paradigm = section 광역 sequential 노출
 *
 * courtName props 영구 폐기 (정부24 paradigm 영구 폐기 정합 = 수요기관 영역 0).
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function IssueGuideModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      // 정보 모달 paradigm 정수 = ESC 닫기 보존.
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-guide-modal-title"
    >
      <div
        className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="issue-guide-modal-title"
          className="text-lg font-black text-[var(--color-ink-900)]"
        >
          발급 방법
        </h3>

        <section className="mt-4">
          <h4 className="text-base font-bold text-[var(--color-ink-900)]">
            인감증명서
          </h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-[var(--color-ink-700)]">
            <li>가까운 주민센터 또는 무인발급기 방문</li>
            <li>신분증 + 인감도장 지참</li>
            <li>인감증명서 발급 (1통 600원)</li>
            <li>발급 PDF 또는 스캔본 업로드</li>
          </ol>
        </section>

        <section className="mt-5">
          <h4 className="text-base font-bold text-[var(--color-ink-900)]">
            본인서명사실확인서
          </h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-[var(--color-ink-700)]">
            <li>가까운 주민센터 방문</li>
            <li>신분증 제출 + 전자패드 서명</li>
            <li>본인서명사실확인서 발급 (무료)</li>
            <li>발급 PDF 또는 스캔본 업로드</li>
          </ol>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-[var(--brand-green)] text-base font-black text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)]"
        >
          확인
        </button>
      </div>
    </div>
  );
}
