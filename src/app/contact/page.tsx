import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  ArrowRight,
  Info,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "문의하기",
  description: `${COMPANY.name} 상담 채널 안내. 접수는 웹 신청 페이지에서, 상담은 카카오톡 채널로 진행됩니다.`,
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            문의하기
          </p>
          <h1 className="mt-2 text-h2 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h1">
            어떻게 도와드릴까요
          </h1>
          <p className="mt-3 max-w-2xl text-[length:var(--text-body)] leading-7 text-[var(--color-ink-500)]">
            서비스 이용 전 궁금한 점, 접수 후 확인·변경 요청 등 모든 문의를
            받습니다. 가장 빠른 경로는 접수 페이지입니다.
          </p>
        </div>
      </section>

      {/* 접수 우선 안내 */}
      <section className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-8 sm:pt-14">
        <div className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/60 p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-900)] text-white">
            <Info size={18} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-black text-[var(--color-ink-900)]">
              입찰 대리 신청은 웹 접수 페이지에서 완결됩니다
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-ink-700)]">
              신청 과정에서 발생하는 사건번호 확인·서류 업로드·수수료 안내는
              접수 페이지가 직접 처리합니다. 이 페이지는 접수 과정에 없는 문의
              (예: 서비스 일반 질의, 사용 후 후기, 제휴 제안)를 위한 채널입니다.
            </p>
            <Link
              href="/apply"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white hover:bg-black"
            >
              신청 페이지로 이동
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 채널 카드 */}
      <section className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
          상담 채널
        </p>
        <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
          편하신 방법을 선택해주세요
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
              <MessageCircle size={22} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                카카오톡 채널
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                접수 후 확인·결과 통보를 포함해 가장 빠르게 응답드립니다.
                운영 시간 내 평균 30분 이내 응답.
              </p>
            </div>
            <a
              href={COMPANY.kakaoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-kakao)] px-5 text-sm font-black text-[var(--color-ink-900)] hover:brightness-95"
            >
              카카오톡 채널 열기
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </article>

          <article className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink-50)] text-[var(--color-ink-900)]">
              <Mail size={22} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight text-[var(--color-ink-900)]">
                이메일 문의
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                장문 설명이나 첨부 자료가 있는 문의는 이메일이 편합니다.
                영업일 기준 1~2일 내 회신.
              </p>
            </div>
            <a
              href="mailto:contact@example.com"
              className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] hover:border-[var(--color-ink-900)] hover:text-black"
            >
              메일 보내기
            </a>
          </article>
        </div>
      </section>

      {/* 회사 정보 */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
            회사 정보
          </p>
          <h2 className="mt-2 text-h3 font-black tracking-tight text-[var(--color-ink-900)]">
            {COMPANY.name}
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-ink-500)]">
                <Clock size={14} aria-hidden="true" />
                운영 시간
              </dt>
              <dd className="mt-3 text-sm leading-6 text-[var(--color-ink-900)]">
                평일 09:00 – 18:00
                <br />
                <span className="text-xs text-[var(--color-ink-500)]">
                  주말·공휴일 제외. 경매 진행일은 법원 일정에 따라 응답이 늦어질 수
                  있습니다.
                </span>
              </dd>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-ink-500)]">
                <MapPin size={14} aria-hidden="true" />
                주소
              </dt>
              <dd className="mt-3 text-sm leading-6 text-[var(--color-ink-900)]">
                인천광역시 미추홀구 (구체 주소는 사업자 등록 확정 후 공개)
                <br />
                <span className="text-xs text-[var(--color-ink-500)]">
                  우편 수령 가능 시간은 운영 시간과 동일합니다.
                </span>
              </dd>
            </div>
          </dl>
          <p className="mt-8 text-xs leading-5 text-[var(--color-ink-500)]">
            대표 {COMPANY.ceo} · 공인중개사 · 서울보증보험 가입. 사업자등록번호
            · 매수신청대리인 등록번호 등 상세 정보는 향후 이 페이지에 공개
            예정입니다.
          </p>
        </div>
      </section>
    </main>
  );
}
