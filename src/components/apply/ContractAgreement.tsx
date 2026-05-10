"use client";

import type { ApplyFormData } from "@/types/apply";
import { computeFee } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import {
  DELEGATE_INFO,
  DISCLAIMER_TEXT,
  DELEGATION_SCOPE_ITEMS,
  CONTRACT_OBLIGATIONS,
} from "@/lib/legal/contract";

/**
 * cycle 1-D-A-4-5 repurpose — DelegationPreviewModal body component.
 *
 * 직전 cycle 1-D-A-4-4 = Step4 inline render → cycle 1-D-A-4-5 = modal 안 단독 render paradigm.
 * professional 양식 정수 = serif font + bordered table + 단일 column 정형 layout.
 */

interface Props {
  data: ApplyFormData;
}

const SCOPE_PREFIX = ["가", "나", "다", "라", "마"];

function maskSsnFront(v: string) {
  if (!v) return "";
  return `${v.slice(0, 2)}****`;
}

function formatTodayKor(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function TableRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-gray-300 last:border-b-0">
      <th
        scope="row"
        className="w-32 bg-gray-50 px-3 py-2.5 text-left align-top text-sm font-bold text-[var(--color-ink-700)]"
      >
        {label}
      </th>
      <td className="px-3 py-2.5 align-top text-sm text-[var(--color-ink-900)]">
        {children}
      </td>
    </tr>
  );
}

export function ContractAgreement({ data }: Props) {
  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const fee = data.bidDate ? computeFee(data.bidDate) : null;

  return (
    <article
      style={{ fontFamily: '"Noto Serif KR", "Nanum Myeongjo", serif' }}
      className="text-[var(--color-ink-900)]"
    >
      <header className="mb-5 border-b-2 border-[var(--color-ink-900)] pb-4">
        <h2 className="text-center text-2xl font-black tracking-[-0.01em]">
          매수신청 대리 이용 계약서
        </h2>
      </header>

      <div className="mb-6 rounded-md border border-gray-300 bg-gray-50 p-3.5 text-sm leading-7 text-[var(--color-ink-700)]">
        {DISCLAIMER_TEXT}
      </div>

      <section className="mb-6">
        <h3 className="mb-3 text-base font-black">제1조 (당사자 정보)</h3>
        <p className="mb-2 text-sm font-bold text-[var(--color-ink-900)]">
          [입찰의뢰인]
        </p>
        <table className="mb-4 w-full overflow-hidden rounded-md border border-gray-300">
          <tbody>
            <TableRow label="성명">{bid.applicantName || "-"}</TableRow>
            <TableRow label="주민등록번호 앞자리">
              <span className="tabular-nums">
                {maskSsnFront(bid.ssnFront)}
              </span>
            </TableRow>
            <TableRow label="주소">{data.propertyAddress || "-"}</TableRow>
            <TableRow label="연락처">
              <span className="tabular-nums">{bid.phone || "-"}</span>
            </TableRow>
          </tbody>
        </table>
        <p className="mb-2 text-sm font-bold text-[var(--color-ink-900)]">
          [매수신청대리인]
        </p>
        <table className="w-full overflow-hidden rounded-md border border-gray-300">
          <tbody>
            <TableRow label="성명">{DELEGATE_INFO.name}</TableRow>
            <TableRow label="자격">{DELEGATE_INFO.qualification}</TableRow>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-base font-black">제2조 (경매 사건 정보)</h3>
        <table className="w-full overflow-hidden rounded-md border border-gray-300">
          <tbody>
            <TableRow label="집행법원">{data.court}</TableRow>
            <TableRow label="사건번호">
              <span className="tabular-nums">{data.caseNumber || "-"}</span>
            </TableRow>
            <TableRow label="매각기일">
              <span className="tabular-nums">{data.bidDate || "-"}</span>
            </TableRow>
            <TableRow label="입찰 희망 금액">
              <span className="font-bold tabular-nums text-[var(--color-accent-red)]">
                {bidAmount > 0
                  ? `${bidAmount.toLocaleString("ko-KR")}원 (${formatKoreanWon(bidAmount)})`
                  : "-"}
              </span>
            </TableRow>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-base font-black">제3조 (매수신청 대리 보수)</h3>
        <table className="w-full overflow-hidden rounded-md border border-gray-300">
          <tbody>
            <TableRow label="확정 보수액">
              {fee ? (
                <span className="tabular-nums">
                  {fee.baseFee.toLocaleString("ko-KR")}원 ({fee.tierLabel})
                </span>
              ) : (
                "-"
              )}
            </TableRow>
            <TableRow label="낙찰 성공보수">
              <span className="tabular-nums">
                50,000원 (낙찰 결정 시점 단독 발생)
              </span>
            </TableRow>
            <TableRow label="보수지급 시기">
              본 계약 체결 시 확정 보수액을 선납하며, 성공보수는 낙찰 결정 후
              정산 단계에서 지급합니다.
            </TableRow>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-base font-black">제4조 (위임 내용)</h3>
        <p className="mb-2 text-sm leading-7">
          본 계약에 따라 입찰의뢰인은 매수신청대리인에게 다음 권한을 위임합니다.
        </p>
        <ol className="space-y-1.5 text-sm leading-7">
          {DELEGATION_SCOPE_ITEMS.map((item, idx) => (
            <li key={idx} className="flex gap-2 pl-2">
              <span className="shrink-0 font-bold">{SCOPE_PREFIX[idx]}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-base font-black">제5조 (계약 내용)</h3>
        <h4 className="mb-1.5 text-sm font-bold">가. 입찰의뢰인 의무</h4>
        <ol className="mb-3 list-decimal space-y-1 pl-6 text-sm leading-7">
          {CONTRACT_OBLIGATIONS.delegator.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h4 className="mb-1.5 text-sm font-bold">나. 매수신청대리인 의무</h4>
        <ol className="mb-3 list-decimal space-y-1 pl-6 text-sm leading-7">
          {CONTRACT_OBLIGATIONS.delegate.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h4 className="mb-1.5 text-sm font-bold">다. 양 당사자 책임 관계</h4>
        <ol className="mb-3 list-decimal space-y-1 pl-6 text-sm leading-7">
          {CONTRACT_OBLIGATIONS.responsibility.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h4 className="mb-1.5 text-sm font-bold">라. 회사 관련 사항</h4>
        <ol className="list-decimal space-y-1 pl-6 text-sm leading-7">
          {CONTRACT_OBLIGATIONS.company.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      </section>

      <div className="border-t-2 border-[var(--color-ink-900)] pt-5">
        <p className="text-sm leading-7">
          본 계약을 증명하기 위하여 양 당사자는 이의 없음을 확인하고 서명합니다.
        </p>
        <p className="mt-3 text-sm font-bold">{formatTodayKor()}</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold">[입찰의뢰인]</p>
            <p className="mt-1 text-sm">{bid.applicantName || "-"}</p>
            <p className="mt-2 text-xs text-[var(--color-ink-500)]">
              (서명: 신청 화면 안에서 진행)
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">[매수신청대리인]</p>
            <p className="mt-1 text-sm">{DELEGATE_INFO.name}</p>
            <p className="mt-2 text-xs text-[var(--color-ink-500)]">
              (서명: 사업자등록 사후 인감 자동 삽입)
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
