import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, Article, Clauses } from "@/components/common/LegalLayout";
import { formatKoreanWon } from "@/lib/utils";
import { FEES, COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "환불 정책",
  description: `${COMPANY.name} 수수료 환불 및 입찰 보증금 반환 정책. 패찰 시 보증금은 당일 즉시 반환됩니다.`,
};

export default function RefundPage() {
  return (
    <LegalLayout
      title="환불 정책"
      intro={`${COMPANY.name}의 수수료 환불 규정과 입찰 보증금 반환 원칙을 안내합니다. 패찰 시 보증금은 당일 즉시 반환되며, 결과와 무관하게 투명하게 운영됩니다.`}
      effectiveDate="2026-04-14"
      lastUpdated="2026-04-14"
    >
      <Article number="01" title="기본 원칙">
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              입찰 보증금은 결과와 무관하게 이용자의 자산
            </strong>
            입니다. 회사는 보증금을 전용계좌에서 분리 관리하며, 어떠한 경우에도
            임의로 사용하지 않습니다.
          </li>
          <li>
            기본 수수료는 서비스 수행의 대가로 청구되며, 수행 단계에 따라 환불
            범위가 달라집니다(아래 제2조 참조).
          </li>
          <li>
            낙찰 성공보수{" "}
            <strong className="tabular-nums text-[var(--color-ink-900)]">
              {formatKoreanWon(FEES.successBonus)}
            </strong>
            은 낙찰이 확정된 경우에만 청구되며, 환불 대상이 아닙니다.
          </li>
        </Clauses>
      </Article>

      <Article number="02" title="수수료 환불 규정">
        <p>
          이용자가 서비스 신청 후 취소하는 경우, 취소 시점에 따라 다음과 같이
          환불됩니다.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-separate border-spacing-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr>
                <th className="border-b border-[var(--color-border)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                  취소 시점
                </th>
                <th className="border-b border-[var(--color-border)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                  수수료 환불
                </th>
                <th className="border-b border-[var(--color-border)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]">
                  보증금 반환
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top">
                  접수 확정 전 (상담원 확인 연락 이전)
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  수수료 미청구
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top">
                  해당 없음
                </td>
              </tr>
              <tr>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top">
                  접수 확정 후 ~ 입찰일 2일 전
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  50% 환불
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  당일 즉시 반환
                </td>
              </tr>
              <tr>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top">
                  입찰일 1일 전 ~ 입찰 당일
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top">
                  환불 불가
                </td>
                <td className="border-b border-[var(--color-border)] px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  당일 즉시 반환
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 align-top">
                  회사 귀책 사유로 입찰 불가
                </td>
                <td className="px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  전액 환불
                </td>
                <td className="px-5 py-3 align-top font-bold text-[var(--color-ink-900)]">
                  당일 즉시 반환
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--color-ink-500)]">
          접수 확정 후 50% 환불 규정은 서류 검토, 위임장 작성, 일정 확인 등
          회사가 이미 수행한 업무에 대한 대가를 반영한 것입니다.
        </p>
      </Article>

      <Article number="03" title="입찰 보증금 반환">
        <Clauses>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              패찰 시
            </strong>
            : 입찰 종료 후 결과 확인 즉시 이용자 계좌로{" "}
            <strong className="text-[var(--color-ink-900)]">
              보증금 전액이 반환
            </strong>
            됩니다. 영업일 기준 당일 즉시 처리됩니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              낙찰 시
            </strong>
            : 법원이 지정한 절차에 따라 보증금이 낙찰 대금의 일부로 처리되며,
            잔금 납부 관련 안내를 별도로 드립니다.
          </li>
          <li>
            <strong className="font-black text-[var(--color-ink-900)]">
              매각기일 변경·취하
            </strong>
            : 법원 사유로 입찰이 진행되지 않은 경우 보증금은 당일 즉시 반환되며,
            수수료는 다음 회차로 이월 또는 전액 환불 중 이용자가 선택할 수
            있습니다.
          </li>
        </Clauses>
      </Article>

      <Article number="04" title="환불 지급 기간 및 방법">
        <Clauses>
          <li>
            환불 및 보증금 반환은 이용자가 신청 시 제공한 계좌 또는 별도로
            지정한 계좌로 송금됩니다.
          </li>
          <li>
            반환 금액에서 이체 수수료 등 추가 비용을 공제하지 않습니다(회사
            부담).
          </li>
          <li>
            통상 영업일 기준 1~2일 이내에 송금되며, 금융기관 점검 일정 등에
            따라 지연될 수 있습니다.
          </li>
        </Clauses>
      </Article>

      <Article number="05" title="환불 제외 항목">
        <Clauses>
          <li>
            낙찰 후 이용자 사정으로 인한 대금 미납(대금미납 시 법원이 보증금을
            몰수하며, 회사는 보증금을 반환할 수 없습니다)
          </li>
          <li>
            이용자가 제출한 정보의 오류·허위로 인해 입찰이 무효 처리된 경우
            기본 수수료
          </li>
          <li>이미 지급된 낙찰 성공보수</li>
        </Clauses>
      </Article>

      <Article number="06" title="민원 처리">
        <p>
          환불과 관련한 이견이 있는 경우 먼저{" "}
          <Link
            href="/contact"
            className="font-bold text-[var(--color-ink-900)] underline decoration-[var(--color-ink-300)] underline-offset-2 hover:text-black"
          >
            문의하기
          </Link>{" "}
          또는 카카오톡 채널을 통해 회사에 이의를 제기해주시기 바랍니다.
          협의로 해결되지 않는 경우 소비자분쟁해결기준 및 관련 법령에 따라
          처리됩니다.
        </p>
      </Article>
    </LegalLayout>
  );
}
