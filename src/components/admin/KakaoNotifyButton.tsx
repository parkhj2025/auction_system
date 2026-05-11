"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * cycle 1-E-B 신규 — 카카오톡 알림 trigger paradigm (Phase 1 = 수동 단독).
 *
 * 광역 흐름 paradigm:
 * - admin "알림 보내기" button click → modal pop (카피 + 전화번호 광역 표기)
 * - 형준님 = 카피 copy + 전화번호 copy → 카카오톡 직접 단독 paradigm
 * - 자동 alimtalk = Phase 2 v2 패키지 영역 (CLAUDE.md §17 정합)
 *
 * 시각 paradigm (Step1·2 정합):
 * - button = brand-green CTA paradigm
 * - modal = rounded-2xl + p-6 + max-w-[480px] (BidConfirmModal 정합)
 * - copy button = navigator.clipboard.writeText() + fallback paradigm
 */

interface Props {
  applicantName: string;
  applicationId: string;
  phone: string;
}

export function KakaoNotifyButton({
  applicantName,
  applicationId,
  phone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"copy" | "phone" | null>(null);

  const message = `[경매퀵] ${applicantName}님, 입찰 대리 신청이 접수되었습니다. 접수번호: ${applicationId}`;

  async function copyText(text: string, key: "copy" | "phone") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback 영역 0
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-green)] px-4 text-sm font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
      >
        <MessageCircle size={14} aria-hidden="true" />
        알림 보내기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kakao-notify-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
            <h3
              id="kakao-notify-modal-title"
              className="text-lg font-black tracking-tight text-[var(--color-ink-900)]"
            >
              카카오톡 알림 발송
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-700)]">
              아래 카피와 전화번호를 복사하여 카카오톡으로 직접 발송해주세요.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <dt className="text-sm font-medium text-[var(--color-ink-500)]">
                    전화번호
                  </dt>
                  <button
                    type="button"
                    onClick={() => copyText(phone, "phone")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-bold transition-colors duration-150 hover:bg-[var(--color-ink-50)]",
                      copied === "phone"
                        ? "text-[var(--brand-green)]"
                        : "text-[var(--color-ink-900)]",
                    )}
                  >
                    {copied === "phone" ? (
                      <>
                        <Check size={12} aria-hidden="true" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={12} aria-hidden="true" />
                        복사
                      </>
                    )}
                  </button>
                </div>
                <p className="rounded-md bg-gray-50 px-3 py-2.5 text-base font-bold tabular-nums text-[var(--color-ink-900)]">
                  {phone}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <dt className="text-sm font-medium text-[var(--color-ink-500)]">
                    안내 카피
                  </dt>
                  <button
                    type="button"
                    onClick={() => copyText(message, "copy")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-bold transition-colors duration-150 hover:bg-[var(--color-ink-50)]",
                      copied === "copy"
                        ? "text-[var(--brand-green)]"
                        : "text-[var(--color-ink-900)]",
                    )}
                  >
                    {copied === "copy" ? (
                      <>
                        <Check size={12} aria-hidden="true" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={12} aria-hidden="true" />
                        복사
                      </>
                    )}
                  </button>
                </div>
                <p className="rounded-md bg-gray-50 px-3 py-2.5 text-sm leading-6 text-[var(--color-ink-900)]">
                  {message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-[var(--cta-h-app)] w-full items-center justify-center rounded-xl bg-[var(--color-ink-900)] text-base font-black text-white transition-colors duration-150 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-700)]"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
