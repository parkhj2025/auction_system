import type { Metadata } from "next";
import { LegalLayout, Article, Clauses } from "@/components/common/LegalLayout";
import { COMPANY } from "@/lib/constants";
import { USER_INPUT_LIABILITY_NOTICE } from "@/lib/legal";

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
      <Article number="제1조" title="목적">
        <p>
          본 약관은 {COMPANY.name}(이하 &ldquo;회사&rdquo;)이 운영하는 웹사이트를 통해
          제공되는 부동산 경매 매수신청 대리 서비스(이하 &ldquo;서비스&rdquo;)의
          이용에 관하여 회사와 이용자 간의 권리, 의무 및 책임사항, 이용 조건 및
          절차 등 기본적인 사항을 규정함을 목적으로 합니다.
        </p>
      </Article>

      <Article number="제2조" title="정의">
        <Clauses>
          <li>
            &ldquo;서비스&rdquo;란 회사가 이용자를 대리하여 법원 경매에 매수
            신청을 수행하는 공인중개사법상의 매수신청 대리 업무를 말합니다.
          </li>
          <li>
            &ldquo;이용자&rdquo;란 본 약관에 따라 회사가 제공하는 서비스를
            신청하고 이용하는 개인 또는 법인을 말합니다.
          </li>
          <li>
            &ldquo;접수&rdquo;란 이용자가 웹사이트 신청 페이지를 통해 사건번호,
            입찰 정보, 필수 서류를 제출하고 회사가 이를 확인한 상태를 말합니다.
          </li>
          <li>
            &ldquo;수수료&rdquo;란 회사가 서비스 제공의 대가로 이용자로부터
            수령하는 금액을 말하며, 기본 수수료와 낙찰 성공보수로 구성됩니다.
          </li>
        </Clauses>
      </Article>

      <Article number="제3조" title="약관의 효력 및 변경">
        <Clauses>
          <li>
            본 약관은 웹사이트에 게시함으로써 효력을 발생하며, 이용자가
            서비스를 신청하는 시점부터 적용됩니다.
          </li>
          <li>
            회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을
            변경할 수 있으며, 변경된 약관은 적용일 7일 전부터 웹사이트에
            공지합니다.
          </li>
          <li>
            이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수
            있으며, 변경 공지 후에도 서비스를 계속 이용하는 경우 변경 약관에
            동의한 것으로 봅니다.
          </li>
        </Clauses>
      </Article>

      <Article number="제4조" title="서비스의 내용 및 업무 범위">
        <p>
          회사가 제공하는 서비스는 공인중개사법에 따른{" "}
          <strong className="font-black text-[var(--color-ink-900)]">
            매수신청 대리(입찰 대리) 업무
          </strong>
          만을 포함하며, 구체적인 업무 내용은 다음과 같습니다.
        </p>
        <Clauses>
          <li>사건번호 확인 및 접수 관리</li>
          <li>위임장, 입찰표 등 법적 서류의 작성</li>
          <li>입찰일 법원 방문 및 현장 입찰 대리</li>
          <li>입찰 보증금의 수납·관리 및 반환</li>
          <li>낙찰·패찰 결과 통보 및 정산</li>
        </Clauses>
        <p>
          다음 각호의 업무는 서비스 범위에 포함되지 않으며, 이용자는 필요 시
          법무사·변호사 등 별도의 전문가에게 의뢰해야 합니다.
        </p>
        <Clauses>
          <li>권리분석 및 등기부 인수 여부의 최종 판단</li>
          <li>투자 권유, 매수 추천, 수익 보장</li>
          <li>명도(점유자 퇴거) 및 관련 협상</li>
          <li>소유권 이전 등기 대행</li>
          <li>세무 상담 및 신고 대행</li>
        </Clauses>
      </Article>

      <Article number="제5조" title="이용 신청 및 승낙">
        <Clauses>
          <li>
            이용자는 웹사이트 신청 페이지에서 사건번호, 법원, 입찰 정보, 신청인
            정보를 입력하고 전자본인서명확인서와 신분증 사본을 업로드함으로써
            이용 신청을 합니다.
          </li>
          <li>
            회사는 접수 내용을 확인한 후 승낙 또는 거절을 통보합니다. 승낙된
            시점에 서비스 이용 계약이 성립한 것으로 봅니다.
          </li>
          <li>
            다음 각호에 해당하는 경우 회사는 이용 신청을 거절할 수 있습니다.
            <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-[var(--color-ink-500)]">
              <li>서비스 지역이 아닌 법원의 물건인 경우</li>
              <li>
                동일 물건에 대해 이미 다른 이용자의 접수가 확정된 경우(1물건
                1고객 원칙)
              </li>
              <li>매각기일이 변경·연기·취하된 경우</li>
              <li>서류 또는 정보에 중대한 하자가 있는 경우</li>
            </ul>
          </li>
        </Clauses>
      </Article>

      <Article number="제6조" title="수수료 및 결제">
        <Clauses>
          <li>
            기본 수수료는 신청 시점을 기준으로 얼리버드(입찰일 7일 이상 전)
            50,000원, 일반(2~7일 전) 70,000원, 급건(2일 이내) 100,000원으로
            확정됩니다.
          </li>
          <li>
            낙찰 성공보수 50,000원은 낙찰이 확정된 경우에만 추가로 청구됩니다.
          </li>
          <li>
            수수료 및 입찰 보증금은 회사가 지정한 전용계좌로 송금하여야 하며,
            입찰일 전일까지 입금이 확인되지 않는 경우 대리 입찰이 수행되지
            않을 수 있습니다.
          </li>
          <li>
            수수료 환불 및 입찰 보증금 반환에 관한 세부 사항은 별도의{" "}
            <a
              href="/refund"
              className="font-bold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
            >
              환불 정책
            </a>
            을 따릅니다.
          </li>
        </Clauses>
      </Article>

      <Article number="제7조" title="이용자의 의무">
        <Clauses>
          <li>
            이용자는 서비스 신청 시 정확한 정보를 제공하여야 하며, 허위 정보로
            인한 불이익은 이용자 본인이 부담합니다.
          </li>
          <li>
            이용자는 회사가 송금한 보증금 반환 계좌 정보를 정확히 제공하여야
            하며, 계좌 오류로 인한 송금 지연·불능은 이용자의 책임으로 합니다.
          </li>
          <li>
            이용자는 서비스를 통해 취득한 정보를 법령에 위배되는 용도로
            사용하여서는 안 됩니다.
          </li>
        </Clauses>
      </Article>

      <Article number="제8조" title="서비스 이용의 제한 및 해지">
        <Clauses>
          <li>
            이용자는 접수 확정 전까지 자유롭게 신청을 취소할 수 있으며, 그 경우
            수수료는 청구되지 않습니다.
          </li>
          <li>
            접수 확정 후 취소에 관한 사항은 환불 정책을 따릅니다.
          </li>
          <li>
            회사는 이용자가 본 약관을 중대하게 위반한 경우 서비스 이용을 제한
            또는 거절할 수 있습니다.
          </li>
        </Clauses>
      </Article>

      <Article number="제9조" title="면책 조항">
        <Clauses>
          <li>
            회사는 서비스 제공 중 천재지변, 법원 일정 변경, 전산 장애 등
            불가항력적 사유로 인한 손해에 대해 책임을 지지 않습니다.
          </li>
          <li>
            회사는 이용자가 입찰가 결정, 권리분석, 투자 판단 등{" "}
            <strong className="font-black text-[var(--color-ink-900)]">
              서비스 범위 밖
            </strong>
            의 행위로 입은 손해에 대해 책임을 지지 않습니다.
          </li>
          <li>
            웹사이트에 게시된 물건분석·가이드·시황 콘텐츠는 참고 자료이며 투자
            권유가 아닙니다. 투자 판단에 대한 책임은 이용자 본인에게 있습니다.
          </li>
          <li>{USER_INPUT_LIABILITY_NOTICE}</li>
        </Clauses>
      </Article>

      <Article number="제10조" title="분쟁 해결 및 관할">
        <Clauses>
          <li>
            회사와 이용자 간 분쟁이 발생한 경우 상호 협의를 통해 해결함을
            원칙으로 합니다.
          </li>
          <li>
            협의로 해결되지 않는 분쟁의 관할 법원은 민사소송법상 관할 규정에
            따르며, 전자상거래 등에서의 소비자 보호에 관한 법률이 정하는 바에
            따릅니다.
          </li>
        </Clauses>
      </Article>
    </LegalLayout>
  );
}
