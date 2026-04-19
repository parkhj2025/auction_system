import type { Metadata } from "next";
import { LegalLayout } from "@/components/common/LegalLayout";
import { COMPANY } from "@/lib/constants";
import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${COMPANY.name}의 개인정보 수집·이용·보관·파기 정책. 보관 기간 5년, 목적 외 사용 없음.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="개인정보처리방침"
      intro={`${COMPANY.name}(이하 "회사")은 이용자의 개인정보를 소중히 다루며, 개인정보 보호법 등 관련 법령을 준수합니다. 본 방침은 회사가 수집·이용·보관·파기하는 개인정보의 항목과 처리 방식에 관해 설명합니다.`}
      effectiveDate="2026-04-14"
      lastUpdated="2026-04-19"
    >
      <PrivacyContent />
    </LegalLayout>
  );
}
