"use client";

import { useEffect } from "react";

/**
 * Phase 6.7.5 모바일 진단용 onscreen console (vconsole).
 *
 * 폰에서 원격 디버깅 경로 접근 불가할 때 화면 우측 하단에 vConsole 버튼 노출.
 * 탭하면 Log/Network/Element 탭이 열려 모바일에서 직접 로그 확인 가능.
 *
 * IS_DIAG 가드:
 * - NEXT_PUBLIC_DIAG_ENABLED=1 환경변수 설정 시에만 dynamic import 실행
 * - main → Production 워크플로우에서는 Preview 배포가 자동 생성되지 않으므로
 *   이전 `VERCEL_ENV === "preview"` 가드가 always false였음 → 별도 env var로 전환.
 * - 환경변수 미설정 시 undefined !== "1" → IS_DIAG=false → import("vconsole") 호출 안 됨
 *   → vconsole chunk 자체는 번들에 있지만 네트워크 로드 안 됨
 * - 로컬 dev (pnpm dev): .env.local에 해당 변수 설정 없으면 미활성
 *
 * 원인 확정 후 본 컴포넌트 + PDFPreviewModal의 [pdf-diag] 코드 + env var 제거.
 */
const IS_DIAG = process.env.NEXT_PUBLIC_DIAG_ENABLED === "1";

export function DiagConsole() {
  useEffect(() => {
    if (!IS_DIAG) return;

    let instance: { destroy: () => void } | null = null;
    (async () => {
      try {
        const mod = await import("vconsole");
        const VConsole = mod.default;
        instance = new VConsole();
      } catch (err) {
        console.error("[diag] vconsole init failed", err);
      }
    })();

    return () => {
      instance?.destroy();
    };
  }, []);

  return null;
}
