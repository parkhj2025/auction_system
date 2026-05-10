"use client";

import { useEffect } from "react";

/**
 * cycle 1-D-A-4-3 보강 1 — 전자본인서명확인서 발급 방법 안내 모달.
 *
 * 정보 모달 paradigm 정수 (ConfirmCaseModal 강제 모달 paradigm 광역 분리):
 * - backdrop click 닫기 = 보존 (사용자 자유 paradigm)
 * - ESC 키 닫기 = 보존
 * - "확인" CTA 단독 (취소 영역 0)
 *
 * 전자본인서명확인서 단독 paradigm (인감증명서 + 본인서명사실확인서 양 서류 paradigm 영구 폐기):
 * - 첫 발급 = 주민센터 방문 + 발급시스템 이용 승인 신청 (최초 1회 / 4년 유효)
 * - 사전 등록 사후 = 정부24 PC 웹 (www.gov.kr) 접속 + 공동인증서/금융인증서 로그인 + 발급
 * - 모바일 앱 NG (PC 웹 단독 paradigm)
 *
 * 어미 = 합니다체 단독 paradigm (§32 정합 / 요체 영구 폐기).
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
          전자본인서명확인서 발급 방법
        </h3>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--color-ink-700)]">
          <li>
            가까운 주민센터(읍·면·동 사무소) 방문하여 발급시스템 이용 승인 신청
            (최초 1회 / 4년 유효)
          </li>
          <li>
            정부24 PC 웹 (
            <span className="font-medium">www.gov.kr</span>) 접속 후 공동인증서
            또는 금융인증서로 로그인
          </li>
          <li>전자본인서명확인서 발급 메뉴 선택 후 발급</li>
          <li>발급증 PDF 다운로드 후 본 페이지에 업로드</li>
        </ol>

        <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
          정부24 모바일 앱이 아닌 PC 웹에서만 발급 가능합니다.
        </p>

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
