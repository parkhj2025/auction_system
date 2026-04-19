import { Article, Clauses } from "@/components/common/LegalLayout";
import { COMPANY } from "@/lib/constants";
import { USER_INPUT_LIABILITY_NOTICE } from "@/lib/legal";

/**
 * 개인정보처리방침 본문 (Article 트리만).
 * Phase 6.5-POST 작업 7 (2026-04-19): /privacy 페이지와 PrivacyPreviewModal에서 동일하게 소비.
 * 페이지(/privacy)는 LegalLayout으로 wrap, Modal은 헤더/푸터 별도.
 * 본문 1곳 수정 = 페이지 + Modal 자동 반영 (HTML/PDF 단일 소스 패턴 동일).
 */
export function PrivacyContent() {
  return (
    <>
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
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              사건 정보 확인 시점
            </strong>
            (KST 타임스탬프): 위임장 분쟁 시 위임인의 정보 입력·확인 시각 입증
            근거. 매수신청대리 업무 기록의 일부로 위임장 PDF와 동일한 보관 정책
            적용.
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
          회사는 처리 목적이 달성된 개인정보는 지체 없이 파기하는 것을 원칙으로
          합니다. 다만, 아래 항목은 관련 법령에 근거해 정해진 기간 동안 보관한
          후 자동 파기합니다.
        </p>
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]"
                >
                  보관 항목
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]"
                >
                  근거 법령
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]"
                >
                  보관 기간
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <td className="px-4 py-3 align-top">
                  <p className="font-bold text-[var(--color-ink-900)]">위임장 PDF</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                    주민등록번호 13자리 전체가 본문에 포함됨. 비공개 Storage
                    영역에 분리 저장.
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-xs leading-5 text-[var(--color-ink-700)]">
                  전자상거래법 제6조 +<br />
                  공인중개사의 매수신청대리인 등록 등에 관한 규칙 제15조
                </td>
                <td className="px-4 py-3 align-top">
                  <strong className="font-black text-[var(--color-ink-900)]">5년</strong>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <p className="font-bold text-[var(--color-ink-900)]">
                    계약 및 대금 결제 기록
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                    수수료·보증금 송금·반환·정산 기록.
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-xs leading-5 text-[var(--color-ink-700)]">
                  전자상거래법 제6조
                </td>
                <td className="px-4 py-3 align-top">
                  <strong className="font-black text-[var(--color-ink-900)]">5년</strong>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <p className="font-bold text-[var(--color-ink-900)]">
                    소비자 불만·분쟁 처리 기록
                  </p>
                </td>
                <td className="px-4 py-3 align-top text-xs leading-5 text-[var(--color-ink-700)]">
                  전자상거래법 제6조
                </td>
                <td className="px-4 py-3 align-top">
                  <strong className="font-black text-[var(--color-ink-900)]">3년</strong>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <p className="font-bold text-[var(--color-ink-900)]">접속 로그</p>
                </td>
                <td className="px-4 py-3 align-top text-xs leading-5 text-[var(--color-ink-700)]">
                  통신비밀보호법
                </td>
                <td className="px-4 py-3 align-top">
                  <strong className="font-black text-[var(--color-ink-900)]">3개월</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
          개인정보보호법 제21조 제3항에 따라 위 보존 항목은 다른 개인정보와
          분리하여 저장·관리합니다. 위임장 PDF는 비공개 버킷의 RLS 정책으로
          접근이 차단되며, 본인 열람 시에는 60초 만료 임시 URL로만 발급됩니다.
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--color-ink-500)]">
          이용자가 삭제를 요청하는 경우, 법령상 보존 의무가 없는 항목은 즉시
          파기합니다. 보존 의무가 있는 항목은 위 기간 만료 시까지 다른 용도로
          활용되지 않으며, 만료 즉시 자동 파기됩니다.
        </p>
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
              파기 절차
            </strong>
            : 보존 기간이 만료되거나 처리 목적이 달성된 개인정보는 일 1회 자동
            스케줄러가 식별하여 즉시 파기합니다. 별도의 사유로 즉시 파기가
            필요한 경우 담당자가 수동으로 처리합니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              파기 방법
            </strong>
            : 전자적 파일은 복구 및 재생이 불가능한 방법으로 영구 삭제합니다.
            위임장 PDF는 비공개 Storage 버킷에서 파일 자체를 삭제하며, 데이터
            베이스에서 해당 파일 경로 참조도 동시에 NULL 처리되어 dead link가
            남지 않습니다. 종이 문서는 분쇄기로 분쇄하거나 소각합니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              파기 기한
            </strong>
            : 보존 기간 종료일로부터 늦어도 24시간 이내에 자동 파기됩니다.
            처리 목적 달성에 따른 즉시 파기 항목은 사유 발생 시점에 즉시
            처리됩니다.
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

      <Article number="10" title="위임인의 사건 정보 입력 책임">
        <p>{USER_INPUT_LIABILITY_NOTICE}</p>
        <p className="mt-3 text-xs leading-5 text-[var(--color-ink-500)]">
          이용자가 신청 화면(Step 1 사건 정보 확인)에서 직접 입력하거나 확인한
          매각기일·물건 종류·주소 등 사건 정보는 위임장 PDF와 매수신청대리
          업무 진행의 근거가 됩니다. 회사는 이용자가 확인 체크박스를 누른 시각을
          기록하여 분쟁 시 입증 근거로 활용합니다.
        </p>
      </Article>

      <Article number="11" title="변경 공지">
        <p>
          본 개인정보처리방침은 법령·정책 또는 회사 내부 방침의 변경에 따라
          수정될 수 있으며, 변경 시 웹사이트 공지사항을 통해 시행일 7일 전부터
          고지합니다.
        </p>
      </Article>
    </>
  );
}
