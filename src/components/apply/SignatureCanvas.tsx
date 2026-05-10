"use client";

import { useRef } from "react";
import SignaturePad from "react-signature-canvas";

interface SignatureCanvasProps {
  /** 서명 stroke 종료 시점 또는 "지우기" 시점에 호출.
   *  비어있으면 null, 그렇지 않으면 PNG base64 dataURL. */
  onChange: (dataUrl: string | null) => void;
  /** true이면 입력 차단. 기본 false. */
  disabled?: boolean;
  /** Canvas height Tailwind class. 기본 "h-40". cycle 1-D-A-4-4 = SignatureModal h-48 차용 paradigm. */
  heightClass?: string;
}

export function SignatureCanvas({
  onChange,
  disabled = false,
  heightClass = "h-40",
}: SignatureCanvasProps) {
  const padRef = useRef<SignaturePad>(null);

  function handleEnd() {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      onChange(null);
      return;
    }
    onChange(pad.toDataURL("image/png"));
  }

  function handleClear() {
    padRef.current?.clear();
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white ${
          disabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <SignaturePad
          ref={padRef}
          onEnd={handleEnd}
          canvasProps={{
            className: `block w-full ${heightClass} touch-none`,
            "aria-label": "서명 입력 영역",
          }}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="inline-flex min-h-9 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-xs font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-ink-100)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          지우기
        </button>
      </div>
    </div>
  );
}
