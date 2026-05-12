import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { AboutPageClient } from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: `${BRAND_NAME}은 투자자의 시간적·물리적 병목을 해소하는 입찰 대리 서비스입니다. 공인중개사가 직접 법원에 출석해 입찰을 수행합니다.`,
};

/* cycle 1-G-β-γ-β — /about 광역 재설계 paradigm:
 * - 6 섹션 광역 (Hero charcoal + Values brand-green + Credentials white + About charcoal + Office surface-muted + Regions charcoal)
 * - 풀스크린 컬러 변주 (단조 폐기) + 자체 SVG 5건 + Asymmetric layout + 큰 타이포 변주 + motion v12
 * - server component (metadata export) → client component (motion v12 광역). */

export default function AboutPage() {
  return <AboutPageClient />;
}
