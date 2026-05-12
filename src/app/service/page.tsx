import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { ServicePageClient } from "@/components/service/ServicePageClient";

export const metadata: Metadata = {
  title: "이용 절차",
  description: `${BRAND_NAME} 입찰 대리 진행 절차 — 사건번호 접수부터 결과 통보·정산까지 5단계. 신청 시점에 따른 정찰제 수수료. 패찰 시 보증금 당일 반환.`,
};

/* cycle 1-G-γ — /service 광역 재설계 paradigm (/about paradigm 차용):
 * - 5 섹션 (Hero charcoal + Scope white + Process brand-green + Pricing surface-muted + CTA charcoal)
 * - 카톡 메인 NG paradigm 정정 (v62) + 가격 작은 paradigm + 5가지 안전장치 폐기 (Trust 짧은 chip 통합)
 * - server component (metadata) → client wrapper (motion v12). */

export default function ServicePage() {
  return <ServicePageClient />;
}
