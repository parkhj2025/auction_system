import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
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
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
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
