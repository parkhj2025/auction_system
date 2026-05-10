"use client";

import Image from "next/image";
import type { ApplyFormData } from "@/types/apply";
import { computeFee } from "@/lib/apply";
import { formatKoreanWon } from "@/lib/utils";
import {
  DELEGATE_INFO,
  DISCLAIMER_TEXT,
  DELEGATION_SCOPE_ITEMS,
  CONTRACT_OBLIGATIONS,
} from "@/lib/legal/contract";

interface Props {
  data: ApplyFormData;
  signatureDataUrl: string | null;
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-32 shrink-0 text-[var(--color-ink-500)]">{label}</dt>
      <dd className="flex-1 font-bold text-[var(--color-ink-900)]">{children}</dd>
    </div>
  );
}

export function ContractAgreement({ data, signatureDataUrl }: Props) {
  const bid = data.bidInfo;
  const bidAmount = Number(bid.bidAmount.replace(/[^\d]/g, "")) || 0;
  const fee = data.bidDate ? computeFee(data.bidDate) : null;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-center text-lg font-black text-[var(--color-ink-900)]">
        매수신청 대리 이용 계약서
      </h3>

      <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm leading-7 text-[var(--color-ink-700)]">
        {DISCLAIMER_TEXT}
      </div>

      <section className="mt-6">
        <h4 className="text-base font-black text-[var(--color-ink-900)]">
          1. 당사자 정보
        </h4>
        <h5 className="mt-3 text-sm font-bold text-[var(--color-ink-900)]">
          [입찰의뢰인]
        </h5>
        <dl className="mt-2 space-y-2 text-base leading-7 text-[var(--color-ink-700)]">
          <Row label="성명">{bid.applicantName || "-"}</Row>
          <Row label="주민등록번호 앞자리">
            <span className="tabular-nums">{maskSsnFront(bid.ssnFront)}</span>
          </Row>
          <Row label="주소">{data.propertyAddress || "-"}</Row>
          <Row label="연락처">
            <span className="tabular-nums">{bid.phone || "-"}</span>
          </Row>
        </dl>
        <h5 className="mt-5 text-sm font-bold text-[var(--color-ink-900)]">
          [매수신청대리인]
        </h5>
        <dl className="mt-2 space-y-2 text-base leading-7 text-[var(--color-ink-700)]">
          <Row label="성명">{DELEGATE_INFO.name}</Row>
          <Row label="자격">{DELEGATE_INFO.qualification}</Row>
        </dl>
      </section>

      <section className="mt-6">
        <h4 className="text-base font-black text-[var(--color-ink-900)]">
          2. 경매 사건 정보
        </h4>
        <dl className="mt-3 space-y-2 text-base leading-7 text-[var(--color-ink-700)]">
          <Row label="집행법원">{data.court}</Row>
          <Row label="사건번호">
            <span className="tabular-nums">{data.caseNumber || "-"}</span>
          </Row>
          <Row label="매각기일">
            <span className="tabular-nums">{data.bidDate || "-"}</span>
          </Row>
          <Row label="입찰 희망 금액">
            <span className="tabular-nums text-[var(--color-accent-red)]">
              {bidAmount > 0
                ? `${bidAmount.toLocaleString("ko-KR")}원 (${formatKoreanWon(bidAmount)})`
                : "-"}
            </span>
          </Row>
        </dl>
      </section>

      <section className="mt-6">
        <h4 className="text-base font-black text-[var(--color-ink-900)]">
          3. 매수신청 대리 보수
        </h4>
        <dl className="mt-3 space-y-2 text-base leading-7 text-[var(--color-ink-700)]">
          <Row label="확정 보수액">
            {fee ? (
              <span className="tabular-nums">
                {fee.baseFee.toLocaleString("ko-KR")}원 ({fee.tierLabel})
              </span>
            ) : (
              "-"
            )}
          </Row>
          <Row label="낙찰 성공보수">
            <span className="tabular-nums">
              50,000원 (낙찰 결정 시점 단독 발생)
            </span>
          </Row>
          <Row label="보수지급 시기">
            <span className="font-normal text-[var(--color-ink-700)]">
              본 계약 체결 시 확정 보수액을 선납하며, 성공보수는 낙찰 결정 후
              정산 단계에서 지급합니다.
            </span>
          </Row>
        </dl>
      </section>

      <section className="mt-6">
        <h4 className="text-base font-black text-[var(--color-ink-900)]">
          4. 위임 내용
        </h4>
        <p className="mt-3 text-base leading-7 text-[var(--color-ink-700)]">
          본 계약에 따라 입찰의뢰인은 매수신청대리인에게 다음 권한을 위임합니다.
        </p>
        <ol className="mt-2 space-y-2 text-base leading-7 text-[var(--color-ink-700)]">
          {DELEGATION_SCOPE_ITEMS.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="shrink-0 font-bold text-[var(--color-ink-900)]">
                {SCOPE_PREFIX[idx]}.
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h4 className="text-base font-black text-[var(--color-ink-900)]">
          5. 계약 내용
        </h4>
        <h5 className="mt-3 text-sm font-bold text-[var(--color-ink-900)]">
          가. 입찰의뢰인 의무
        </h5>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-base leading-7 text-[var(--color-ink-700)]">
          {CONTRACT_OBLIGATIONS.delegator.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h5 className="mt-4 text-sm font-bold text-[var(--color-ink-900)]">
          나. 매수신청대리인 의무
        </h5>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-base leading-7 text-[var(--color-ink-700)]">
          {CONTRACT_OBLIGATIONS.delegate.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h5 className="mt-4 text-sm font-bold text-[var(--color-ink-900)]">
          다. 양 당사자 책임 관계
        </h5>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-base leading-7 text-[var(--color-ink-700)]">
          {CONTRACT_OBLIGATIONS.responsibility.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
        <h5 className="mt-4 text-sm font-bold text-[var(--color-ink-900)]">
          라. 회사 관련 사항
        </h5>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-base leading-7 text-[var(--color-ink-700)]">
          {CONTRACT_OBLIGATIONS.company.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      </section>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-base leading-7 text-[var(--color-ink-700)]">
          본 계약을 증명하기 위하여 양 당사자는 이의 없음을 확인하고 서명합니다.
        </p>
        <p className="mt-3 text-base font-bold text-[var(--color-ink-900)]">
          {formatTodayKor()}
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-bold text-[var(--color-ink-900)]">
              [입찰의뢰인]
            </p>
            <p className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
              {bid.applicantName || "-"}
            </p>
            <div
              className={
                signatureDataUrl
                  ? "relative mt-2 flex h-16 items-center justify-center overflow-hidden rounded-md border border-[var(--color-ink-900)] bg-white transition-colors duration-200"
                  : "mt-2 flex h-16 items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors duration-200"
              }
            >
              {signatureDataUrl ? (
                <Image
                  src={signatureDataUrl}
                  alt="입찰의뢰인 서명"
                  width={400}
                  height={64}
                  unoptimized
                  className="h-full w-auto object-contain"
                />
              ) : (
                <span className="text-xs text-[var(--color-ink-500)]">
                  (서명)
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-ink-900)]">
              [매수신청대리인]
            </p>
            <p className="mt-1 text-base font-bold text-[var(--color-ink-900)]">
              {DELEGATE_INFO.name}
            </p>
            <div className="mt-2 flex h-16 items-center justify-center rounded-md border-2 border-dashed border-gray-300">
              <span className="text-xs text-[var(--color-ink-500)]">(서명)</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
