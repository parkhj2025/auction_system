"use client";

import { useEffect } from "react";

/**
 * cycle 1-D-A-4-3 — 전자본인서명확인서 발급 방법 안내 모달.
 *
 * 정보 모달 paradigm 정수 (ConfirmCaseModal 강제 모달 paradigm 광역 분리):
 * - backdrop click 닫기 = 보존 (사용자 자유 paradigm)
 * - ESC 키 닫기 = 보존
 * - "확인" CTA 단독 (취소 영역 0)
 *
 * courtName 동적 props paradigm = COURTS_ALL + isServiced 플래그 광역 확장 paradigm 정합.
 * Phase 1 default = "인천지방법원" / 미래 cycle = isServiced 플래그 단독 갱신 / IssueGuideModal 변동 0.
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  courtName: string;
}

export function IssueGuideModal({ isOpen, onClose, courtName }: Props) {
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
          전자본인서명확인서 발급 방법
        </h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7 text-[var(--color-ink-700)]">
          <li>
            대법원 전자민원센터 (
            <span className="font-medium">ecfs.scourt.go.kr</span>) 접속
          </li>
          <li>공동인증서 또는 금융인증서로 로그인</li>
          <li>&ldquo;전자본인서명확인서 발급&rdquo; 메뉴 선택</li>
          <li>
            수요기관 ={" "}
            <strong className="text-[var(--color-ink-900)]">
              {courtName} 집행관
            </strong>{" "}
            입력
          </li>
          <li>발급 PDF 다운로드 → 본 페이지 업로드</li>
        </ol>
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
