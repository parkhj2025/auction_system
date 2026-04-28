"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import {
  verifyPhone,
  type PhoneVerifyResult,
} from "@/lib/auth/phoneVerify";

/**
 * 휴대폰 본인인증 모달 (Phase 5 mock).
 *
 * 컨테이너 박스(헤더/본문/닫기 버튼)는 유지하되, 본문(현재 mock 버튼)은
 * Stage 2C에서 실 SDK iframe 또는 redirect 트리거로 교체 가능한 구조.
 * 인증 결과는 onVerified 콜백으로 상위에 전달.
 */
interface Props {
  /** 인증 후보 사용자 정보. mock은 사용 안 함, 실 SDK는 본인 확인 매칭에 사용. */
  initialName?: string;
  initialSsnFront?: string;
  /**
   * 본인인증 완료 콜백.
   * Phase 6.7.6 시그니처 확장: verifiedPhone 3번째 인자 추가 →
   * Step2BidInfo가 bid.phone state에 prefill하여 "이미 본인인증 시 입력한 값을
   * 다시 입력해야 한다" 모순 UX 제거.
   */
  onVerified: (
    result: PhoneVerifyResult,
    verifiedName: string,
    verifiedPhone: string,
  ) => void;
  onClose: () => void;
}

const PHONE_PATTERN = /^010-\d{4}-\d{4}$/;

export function PhoneVerifyModal({
  initialName = "",
  initialSsnFront = "",
  onVerified,
  onClose,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !verifying) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, verifying]);

  function handlePhoneChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length >= 4 && digits.length < 8) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length >= 8) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    setPhone(formatted);
    setError(null);
  }

  async function handleVerify() {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      setError("휴대폰번호를 010-0000-0000 형식으로 입력해주세요.");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const result = await verifyPhone({
        phone,
        name: name.trim(),
        ssnFront: initialSsnFront,
      });
      if (!result.ok) {
        setError("본인인증에 실패했습니다. 다시 시도해주세요.");
        setVerifying(false);
        return;
      }
      // Phase 6.7.6: phone state는 handlePhoneChange에서 이미 formatPhone과
      // 동일 포맷("010-1234-5678")으로 저장되어 있음 (PHONE_PATTERN 검증 통과).
      // Step2BidInfo.bid.phone에 그대로 전달 가능.
      onVerified(result, name.trim(), phone);
    } catch (err) {
      console.error("[PhoneVerifyModal] verify failed", err);
      setError("본인인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      setVerifying(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-verify-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!verifying) onClose();
      }}
    >
      <div
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2
            id="phone-verify-title"
            className="flex items-center gap-2 text-[length:var(--text-body)] font-black text-[var(--color-ink-900)]"
          >
            <ShieldCheck size={18} aria-hidden="true" className="text-[var(--color-ink-900)]" />
            휴대폰 본인인증
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={verifying}
            aria-label="닫기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-xs leading-5 text-[var(--color-ink-500)]">
            위임장 작성 전 본인 확인이 필요합니다. 인증 정보는 위임 사실 확인
            목적으로만 사용됩니다.
          </p>

          <div>
            <label
              htmlFor="verify-name"
              className="mb-2 block text-sm font-bold text-[var(--color-ink-900)]"
            >
              성명
            </label>
            <input
              id="verify-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              disabled={verifying}
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] disabled:opacity-50"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label
              htmlFor="verify-phone"
              className="mb-2 block text-sm font-bold text-[var(--color-ink-900)]"
            >
              휴대폰번호
            </label>
            <input
              id="verify-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              disabled={verifying}
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-sm tabular-nums text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] disabled:opacity-50"
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-[var(--radius-sm)] border border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)] px-3 py-2 text-xs text-[var(--color-accent-red)]"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-4 text-sm font-black text-white shadow-[var(--shadow-card)] hover:bg-black disabled:cursor-not-allowed disabled:bg-[var(--color-ink-300)] disabled:shadow-none"
          >
            {verifying ? "인증 중..." : "인증 완료"}
          </button>

          <p className="text-[10px] leading-4 text-[var(--color-ink-500)]">
            * 현재 mock 단계 — 실제 통신사 인증은 사업자등록 후 활성화됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
