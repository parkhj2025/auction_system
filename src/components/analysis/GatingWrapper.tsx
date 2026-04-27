"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { usePathname } from "next/navigation";

const FINGERPRINT_KEY = "gq_fingerprint";

/**
 * 소프트 게이팅 래퍼.
 *
 * 초기 렌더: children을 그대로 보여준다 (SSR/SEO 크롤러 + JS 비활성 사용자 보호).
 * 마운트 후: /api/analysis-view에 POST → gated 여부 결정 → 블러 적용.
 *
 * 블러 적용 시:
 * - children을 max-height로 잘라내고 하단을 흰색 그라데이션으로 페이드아웃
 * - 그 아래에 로그인 CTA 카드 표시
 * - 원본 콘텐츠는 max-height로만 숨김 (JS 없이 DOM에는 존재 → 크롤러 친화적)
 */
export function GatingWrapper({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const [gated, setGated] = useState(false);
  const [checked, setChecked] = useState(false);
  const hasCalled = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    let fingerprint = "";
    try {
      fingerprint = localStorage.getItem(FINGERPRINT_KEY) ?? "";
      if (!fingerprint) {
        fingerprint = crypto.randomUUID();
        localStorage.setItem(FINGERPRINT_KEY, fingerprint);
      }
    } catch {
      // localStorage 접근 실패 (시크릿 모드 일부 등) — fingerprint 없이 진행
      // API가 missing_fingerprint 반환하면 gated=false로 폴백됨
    }

    fetch("/api/analysis-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint, slug }),
    })
      .then((res) => res.json())
      .then((json: { gated?: boolean }) => {
        if (json.gated === true) setGated(true);
      })
      .catch(() => {
        // 네트워크 에러 시 gated=false 유지
      })
      .finally(() => setChecked(true));
  }, [slug]);

  // 서버 렌더 및 초기 체크 전에는 콘텐츠 전체 노출 (FOUC 방지 + SEO)
  if (!checked || !gated) {
    return <>{children}</>;
  }

  const loginHref = `/login?redirect=${encodeURIComponent(pathname ?? "/")}`;

  return (
    <div>
      {/* 본문 상단 일부만 보여주고 나머지는 잘라냄 */}
      <div
        className="relative overflow-hidden"
        style={{ maxHeight: "700px" }}
        aria-hidden="false"
      >
        {children}
        {/* 하단 페이드 오버레이 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-white/70 to-white" />
      </div>

      {/* 로그인 유도 CTA */}
      <div
        role="region"
        aria-label="로그인 유도"
        className="mt-2 rounded-[var(--radius-2xl)] border-2 border-[var(--color-ink-900)] bg-white p-8 text-center shadow-[var(--shadow-card)] sm:p-10"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
          <Lock size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-2xl">
          전체 분석을 보려면 로그인해주세요
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
          첫 번째 물건분석은 자유롭게 읽으실 수 있습니다.
          <br />두 번째부터는 로그인 후 무제한 열람 가능합니다.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href={loginHref}
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-8 text-base font-black text-white shadow-[var(--shadow-card)] transition hover:bg-black"
          >
            Google로 로그인
          </Link>
          <p className="text-xs text-[var(--color-ink-500)]">
            로그인하면 접수 내역 조회·마이페이지·전체 분석 열람까지 한 번에.
          </p>
        </div>
      </div>
    </div>
  );
}
