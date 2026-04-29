import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { MobileSticky } from "@/components/layout/MobileSticky";
import { createClient } from "@/lib/supabase/server";
import type { UserMenuProps } from "@/components/auth/UserMenu";
import { BRAND_NAME } from "@/lib/constants";

/* Phase 0.2: 폰트 단일화 (Pretendard Variable self-host / public/fonts/PretendardVariable.woff2).
 * jsdelivr CDN 의존 폐기 — 사파리에서 stylesheet+preload 4건 모두 로드 실패 본질.
 * @font-face 정의는 globals.css 상단 단일 source. <head> = self-host preload 1건만. */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
  ),
  title: {
    default: `${BRAND_NAME} — 법원 안 가는 부동산 경매 입찰 대리`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "법원 안 가는 부동산 경매 입찰 대리. 얼리버드 5만원, 패찰 시 보증금 당일 즉시 반환. 공인중개사·서울보증보험 가입. 현재 인천지방법원 서비스 중이며, 서비스 지역은 확대됩니다.",
};

/* 단계 5-2 #4: viewport-fit cover — iOS Safari 노치 디바이스에서 env(safe-area-inset-*) 활성화 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

async function getUserForNav(): Promise<UserMenuProps | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const meta = user.user_metadata ?? {};
    const displayName =
      (meta.full_name as string | undefined) ||
      (meta.name as string | undefined) ||
      user.email ||
      "사용자";
    const email = user.email ?? null;
    const initial = displayName.trim().charAt(0).toUpperCase() || "U";

    return { displayName, email, initial };
  } catch {
    // 환경변수 누락 등으로 클라이언트 생성 실패 시 미로그인 상태로 폴백
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navUser = await getUserForNav();

  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Phase 0.4: 사파리 새로고침 race condition 본질 해결 (Filament Group 검증 패턴).
         * Font Loading API document.fonts.load() 완료 시점에 .fonts-loaded class 추가 → globals.css 분기로 Pretendard 적용.
         * sessionStorage 두 번째 방문 즉시 class 추가 (FOUT 0). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('fonts-loaded')==='true'){document.documentElement.classList.add('fonts-loaded');return;}}catch(e){}if(document.fonts&&document.fonts.load){document.fonts.load('1em "Pretendard Variable"').then(function(){document.documentElement.classList.add('fonts-loaded');try{sessionStorage.setItem('fonts-loaded','true');}catch(e){}}).catch(function(){document.documentElement.classList.add('fonts-loaded');});}else{document.documentElement.classList.add('fonts-loaded');}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] text-[var(--color-ink-900)] md:pb-0">
        <TopNav user={navUser} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <MobileSticky />
      </body>
    </html>
  );
}
