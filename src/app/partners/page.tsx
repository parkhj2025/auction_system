import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "파트너 문의",
  description: `${BRAND_NAME} 파트너 문의 안내 페이지. 협력·제휴 문의 접수 채널은 곧 공개됩니다.`,
};

/* Phase 1.2 (A-1-2) v50 cycle 10 — /partners placeholder.
 * Stage 2 Phase 영역 / 후속 cycle 콘텐츠 신규 영역. */
export default function PartnersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="파트너 문의"
        title={
          <>
            함께할 파트너를{" "}
            <span className="text-[var(--brand-green)]">찾고 있습니다</span>
            <span style={{ color: "#FFD43B" }}>.</span>
          </>
        }
        subtitle="협력·제휴 문의 채널은 곧 공개됩니다. 준비가 끝나는 대로 안내드리겠습니다."
      />

      <section className="container-app w-full py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[16px] leading-7 text-gray-600 lg:text-[18px]">
            준비 중입니다.
          </p>
        </div>
      </section>
    </main>
  );
}
