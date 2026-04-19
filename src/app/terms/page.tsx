import type { Metadata } from "next";
import { LegalLayout } from "@/components/common/LegalLayout";
import { COMPANY } from "@/lib/constants";
import { TermsContent } from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${COMPANY.name} 서비스 이용약관. 매수신청 대리 업무 범위, 수수료, 서비스 이용 조건 등을 규정합니다.`,
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="이용약관"
      intro={`${COMPANY.name}(이하 "회사")이 제공하는 부동산 경매 매수신청 대리 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정합니다.`}
      effectiveDate="2026-04-14"
      lastUpdated="2026-04-14"
    >
      <TermsContent />
    </LegalLayout>
  );
}
