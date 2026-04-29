import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { MobileSticky } from "@/components/layout/MobileSticky";
import { createClient } from "@/lib/supabase/server";
import type { UserMenuProps } from "@/components/auth/UserMenu";
import { BRAND_NAME } from "@/lib/constants";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

/* sub-phase 8.2 신규 — JetBrains Mono (mono label / sequence label / number 영역).
 * 한글 영역 자동 영역 Pretendard fallback (--font-mono chain 본질). */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

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
    <html lang="ko" className={`${notoSansKr.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        {/* 룰 32 (단계 5-4-3): 브라우저 일관성 — Pretendard Variable @v1.3.9 + dynamic-subset.
         * preload URL = woff2/ 디렉토리 제거 + v 접두사 명시.
         * stylesheet URL = pretendardvariable-dynamic-subset (한글 동적 서브셋, bundle 축소).
         * smoothing / font-feature-settings / letter-spacing = globals.css 단일 source of truth.
         * Noto Sans KR fallback (--font-noto-kr) 보존 — 한글 영역 안전성. */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      {/* 단계 5-2 #4: 모바일 MobileSticky 영역 padding 에 safe-area-inset-bottom 합산 */}
      <body className="flex min-h-full flex-col bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] text-[var(--color-ink-900)] md:pb-0">
        <TopNav user={navUser} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <MobileSticky />
      </body>
    </html>
  );
}
