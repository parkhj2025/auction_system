"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * cycle 1-F-α — 3-way OAuth button mockup paradigm.
 *
 * 광역 paradigm 정수:
 * - PROVIDERS array 광역 단일 source paradigm (Lessons [A] 정합)
 * - Google active paradigm (실제 signInWithOAuth 영구 보존)
 * - Kakao + Naver disabled paradigm (mockup UI / cycle 1-F-β 사후 활성화 paradigm)
 * - DISABLED_PROVIDERS 상수 = LoginButton 광역 단독 (임시 paradigm / cycle 1-F-β 회수)
 * - tooltip = HTML native title 속성 paradigm (신규 npm 0)
 */

type ProviderId = "google" | "kakao" | "naver";

interface ProviderConfig {
  id: ProviderId;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  Logo: () => React.ReactElement;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "google",
    label: "Google로 계속하기",
    bgClass: "bg-white hover:bg-[var(--color-ink-100)]",
    textClass: "text-[var(--color-ink-900)]",
    borderClass: "border border-[var(--color-border)]",
    Logo: GoogleLogo,
  },
  {
    id: "kakao",
    label: "카카오로 계속하기",
    bgClass: "bg-[#FEE500] hover:bg-[#FEE500]",
    textClass: "text-[#1F1F1F]",
    borderClass: "border border-transparent",
    Logo: KakaoLogo,
  },
  {
    id: "naver",
    label: "네이버로 계속하기",
    bgClass: "bg-[#03C75A] hover:bg-[#03C75A]",
    textClass: "text-white",
    borderClass: "border border-transparent",
    Logo: NaverLogo,
  },
];

const DISABLED_PROVIDERS: ReadonlyArray<ProviderId> = ["kakao", "naver"];

export function LoginButton({ redirect }: { redirect?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<ProviderId | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(provider: ProviderId) {
    if (DISABLED_PROVIDERS.includes(provider)) return;
    // cycle 1-F-α — Supabase Provider type narrowing (Kakao + Naver = disabled / Google + Kakao 활성 paradigm 시점 = cycle 1-F-β 진입)
    if (provider !== "google" && provider !== "kakao") return;
    setLoadingProvider(provider);
    setError(null);

    const supabase = createClient();
    const callbackBase = `${window.location.origin}/auth/callback`;
    const redirectTo = redirect
      ? `${callbackBase}?redirect=${encodeURIComponent(redirect)}`
      : callbackBase;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (oauthError) {
      setLoadingProvider(null);
      setError("로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
    // 성공 시 브라우저가 OAuth provider로 자동 이동하므로 추가 처리 불필요
  }

  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map((provider) => {
        const isDisabled = DISABLED_PROVIDERS.includes(provider.id);
        const isLoading = loadingProvider === provider.id;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={isDisabled ? undefined : () => handleLogin(provider.id)}
            disabled={isDisabled || isLoading}
            aria-disabled={isDisabled}
            title={isDisabled ? "곧 지원 예정" : undefined}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold shadow-sm transition-colors duration-150 ${provider.bgClass} ${provider.textClass} ${provider.borderClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${isDisabled ? "disabled:opacity-60" : "disabled:opacity-80"}`}
          >
            <provider.Logo />
            <span>{isLoading ? "로그인 진행 중..." : provider.label}</span>
          </button>
        );
      })}

      {error && (
        <p className="text-sm text-[var(--color-accent-red)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function KakaoLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#1F1F1F"
        d="M12 3C6.48 3 2 6.48 2 10.78c0 2.74 1.82 5.15 4.56 6.53l-1.15 4.21c-.1.36.31.65.62.43l5.05-3.34c.31.03.62.05.92.05 5.52 0 10-3.48 10-7.78S17.52 3 12 3z"
      />
    </svg>
  );
}

function NaverLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFFFFF"
        d="M14.5 12.8 9.4 5H4v14h5.5v-7.8L14.6 19H20V5h-5.5z"
      />
    </svg>
  );
}
