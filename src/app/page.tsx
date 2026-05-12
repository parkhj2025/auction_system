import { HomePageClient } from "@/components/home/HomePageClient";
import { getActiveCaseNumbers } from "@/lib/content";

/* cycle 1-G-γ-α — 메인 광역 재구성 paradigm (/service paradigm 차용 + /service 페이지 영구 폐기):
 * - 8 섹션 (Hero + Scope + Compare + Process + Pricing + Reviews + Insight + CTA)
 * - bg 변주 = charcoal 3 + white 3 + brand-green 1 + surface-muted 1
 * - 사건번호 폼 = Hero 안 통합 (charcoal bg paradigm). */

export default function Home() {
  const caseNumbers = getActiveCaseNumbers();
  return <HomePageClient caseNumbers={caseNumbers} />;
}
