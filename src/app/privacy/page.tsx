import type { Metadata } from "next";
import { LegalLayout, Article, Clauses } from "@/components/common/LegalLayout";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${COMPANY.name}의 개인정보 수집·이용·보관·파기 정책. 보관 기간 3년, 목적 외 사용 없음.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="개인정보처리방침"
      intro={`${COMPANY.name}(이하 "회사")은 이용자의 개인정보를 소중히 다루며, 개인정보 보호법 등 관련 법령을 준수합니다. 본 방침은 회사가 수집·이용·보관·파기하는 개인정보의 항목과 처리 방식에 관해 설명합니다.`}
      effectiveDate="2026-04-14"
      lastUpdated="2026-04-19"
    >
      <Article number="01" title="수집하는 개인정보의 항목">
        <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              필수 항목
            </strong>
            : 성명, 연락처(휴대전화), 사건번호, 입찰 희망 금액
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              주민등록번호 앞 6자리
            </strong>
            : 위임장 작성 목적. 회사 데이터베이스에 보관되며, 입찰이 종료된
            상태(낙찰·패찰·취하 등)로 전이되는 시점에 자동 NULL 처리됩니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              주민등록번호 뒷 7자리
            </strong>
            : 위임장 PDF 생성 시점에만 사용됩니다. 회사 데이터베이스에는
            <strong> 저장되지 않으며</strong>, PDF 생성 직후 메모리에서 즉시
            폐기됩니다. 생성된 위임장 PDF는 매수신청대리 업무 기록 보존 의무에
            따라 비공개 보관 영역에 <strong>3년</strong> 보관 후 자동 삭제됩니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              서류
            </strong>
            : 전자본인서명확인서(PDF), 신분증 사본(PDF 또는 이미지)
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              자동 수집 항목
            </strong>
            : IP 주소, 접속 일시, 브라우저 정보, 쿠키(웹사이트 품질 개선 목적)
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              공동입찰 시
            </strong>
            : 공동입찰인의 성명 및 연락처
          </li>
        </Clauses>
      </Article>

      <Article number="02" title="수집 및 이용 목적">
        <p>회사는 수집한 개인정보를 다음 목적으로만 이용합니다.</p>
        <Clauses>
          <li>매수신청 대리 서비스 제공 및 위임 서류 작성</li>
          <li>입찰 수수료 및 보증금 수납·반환 처리</li>
          <li>접수 확인, 진행 상황 통보, 결과 안내 등 이용자 응대</li>
          <li>서비스 개선 및 통계 분석(개인 식별 불가능한 형태로 처리)</li>
          <li>관련 법령에 따른 기록 보존</li>
        </Clauses>
      </Article>

      <Article number="03" title="보유 및 이용 기간">
        <p>
          회사는 수집한 개인정보를 관련 법령 및 회사 내부 정책에 따라 아래
          기간 동안 보관한 후 지체 없이 파기합니다.
        </p>
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              접수 정보 및 서류
            </strong>
            : 접수일로부터 <strong>3년</strong> (매수신청대리인 업무 기록
            보존 의무에 따름)
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              결제·정산 기록
            </strong>
            : 5년 (전자상거래법에 따라 보존)
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              접속 로그
            </strong>
            : 3개월 (통신비밀보호법)
          </li>
          <li>
            이용자가 삭제를 요청하는 경우, 법령상 보존 의무가 없는 항목은 즉시
            파기합니다.
          </li>
        </Clauses>
      </Article>

      <Article number="04" title="제3자 제공">
        <p>
          회사는 이용자의 개인정보를{" "}
          <strong className="font-black text-[var(--color-ink-900)]">
            원칙적으로 외부에 제공하지 않습니다
          </strong>
          . 다만 다음의 경우에 한하여 예외로 합니다.
        </p>
        <Clauses>
          <li>이용자가 사전에 동의한 경우</li>
          <li>
            법령의 규정에 의하거나 수사 목적으로 법령에서 정한 절차와 방법에
            따라 수사기관의 요구가 있는 경우
          </li>
        </Clauses>
      </Article>

      <Article number="05" title="개인정보의 처리 위탁">
        <p>
          회사는 원활한 서비스 제공을 위해 다음의 업무를 외부에 위탁할 수
          있으며, 위탁 계약 시 개인정보 보호 관련 법령을 준수하도록 관리합니다.
        </p>
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              서버 호스팅
            </strong>
            : 클라우드 인프라 제공사 (이용자 정보·서류 파일 보관)
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              알림 발송
            </strong>
            : 카카오톡 채널 운영사 (접수 확인·결과 통보)
          </li>
          <li>
            위탁 업체는 향후 정식 시행 시점에 본 방침에 구체적으로 명시됩니다.
          </li>
        </Clauses>
      </Article>

      <Article number="06" title="파기 절차 및 방법">
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              전자적 파일
            </strong>
            : 복구 및 재생이 불가능한 방법으로 영구 삭제
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              종이 문서
            </strong>
            : 분쇄기로 분쇄하거나 소각
          </li>
          <li>
            보존 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이
            파기합니다.
          </li>
        </Clauses>
      </Article>

      <Article number="07" title="이용자의 권리">
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <Clauses>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구(법령상 보존 의무가 없는 경우)</li>
          <li>처리 정지 요구</li>
        </Clauses>
        <p>
          권리 행사는 문의하기 페이지 또는 카카오톡 채널을 통해 요청하실 수
          있으며, 회사는 지체 없이 조치합니다.
        </p>
      </Article>

      <Article number="08" title="안전성 확보 조치">
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              기술적 조치
            </strong>
            : 개인정보 전송 구간 SSL/TLS 암호화, 서류 파일 접근 권한 제한
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              관리적 조치
            </strong>
            : 개인정보 취급 인원 최소화, 정기적 접근 기록 점검
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              물리적 조치
            </strong>
            : 서류 보관 시 잠금 장치 사용, 외부 반출 금지
          </li>
        </Clauses>
      </Article>

      <Article number="09" title="개인정보 보호책임자">
        <Clauses>
          <li>성명: {COMPANY.ceo}</li>
          <li>직책: 대표</li>
          <li>연락처: 문의하기 페이지 또는 카카오톡 채널</li>
        </Clauses>
      </Article>

      <Article number="10" title="변경 공지">
        <p>
          본 개인정보처리방침은 법령·정책 또는 회사 내부 방침의 변경에 따라
          수정될 수 있으며, 변경 시 웹사이트 공지사항을 통해 시행일 7일 전부터
          고지합니다.
        </p>
      </Article>
    </LegalLayout>
  );
}
