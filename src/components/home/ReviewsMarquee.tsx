"use client";

import { useEffect, useState } from "react";

/* Phase 1.2 (A-1-2) v1 — ReviewsMarquee (2-row 양방향 + chat bubble + 이모지 avatar + 20건 random pool).
 * - CSS @keyframes via styled-jsx (globals.css 비침투)
 * - 모바일 = 단일 row (좌→우 / 카드 240) / 데스크탑 = 2-row 양방향 (좌→우 + 우→좌 / 카드 280)
 * - mask-image inline + -webkit-mask-image (Safari 14+ 정합)
 * - hover pause via :hover + animation-play-state: paused
 * - prefers-reduced-motion @media query 정지
 * - SSR safe: useState(REVIEWS) + useEffect 셔플 / hydration mismatch 0 */

type Review = {
  id: number;
  label: string;
  emoji: string;
  bg: string;
  fg: string;
  quote1: string;
  quote2: string;
  meta: string;
};

const REVIEWS: Review[] = [
  { id: 1, label: "30대 학부모", emoji: "👩‍🍼", bg: "#E6F1FB", fg: "#0C447C", quote1: "애 등원 시간이랑 입찰 시간이 정확히 겹쳐요.", quote2: "사건번호만 넘기고 끝났습니다.", meta: "3주 전" },
  { id: 2, label: "50대 자영업자", emoji: "🧑‍💼", bg: "#FAEEDA", fg: "#854F0B", quote1: "오전에 가게 비우면 단골 다 놓쳐요.", quote2: "영업하면서 입찰 끝냈습니다.", meta: "1개월 전" },
  { id: 3, label: "60대 은퇴자", emoji: "🧓", bg: "#F3F4F6", fg: "#444441", quote1: "법원 서류 보면 머리가 아파서요.", quote2: "사건번호 넘기고 입찰 부탁드렸습니다.", meta: "2개월 전" },
  { id: 4, label: "30대 직장인", emoji: "💼", bg: "#E0F2F1", fg: "#085041", quote1: "연차 한 번이 너무 아까운데,", quote2: "쓰지 않고 입찰 끝냈습니다.", meta: "2주 전" },
  { id: 5, label: "40대 간호사", emoji: "👩‍⚕️", bg: "#F3E8FF", fg: "#3C3489", quote1: "야간 끝나고 법원까지는 무리거든요.", quote2: "이젠 사건번호만 보내고 끝납니다.", meta: "5일 전" },
  { id: 6, label: "20대 첫 입찰", emoji: "✨", bg: "#DCFCE7", fg: "#27500A", quote1: "권리분석은 직접 했지만 법원이 무서웠어요.", quote2: "입찰만 맡기니 한결 가벼웠습니다.", meta: "1주 전" },
  { id: 7, label: "40대 워킹맘", emoji: "👩‍💻", bg: "#E6F1FB", fg: "#0C447C", quote1: "워킹맘은 평일 오전이 제일 빡빡해요.", quote2: "입찰만 맡기고 일정 챙겼습니다.", meta: "3주 전" },
  { id: 8, label: "30대 카페 운영", emoji: "☕", bg: "#FAEEDA", fg: "#854F0B", quote1: "혼자 운영하는 카페라 자리를 못 떠요.", quote2: "신청만 하고 손님 받았습니다.", meta: "1개월 전" },
  { id: 9, label: "30대 출장", emoji: "✈️", bg: "#E0F2F1", fg: "#085041", quote1: "출장 일정이랑 입찰일이 겹쳐버렸어요.", quote2: "사건번호만 넘기고 가벼웠습니다.", meta: "2주 전" },
  { id: 10, label: "40대 회의 직책", emoji: "💼", bg: "#E0F2F1", fg: "#085041", quote1: "회의 빠지면 진행이 안 되는 직책이라,", quote2: "법원 대신 가주신 게 다행이었습니다.", meta: "3주 전" },
  { id: 11, label: "30대 야근", emoji: "🌙", bg: "#E0F2F1", fg: "#085041", quote1: "야근 끝나고 새벽에 입찰 준비는 무리거든요.", quote2: "맡기고 결과만 기다렸습니다.", meta: "2주 전" },
  { id: 12, label: "50대 단골 가게", emoji: "🍞", bg: "#FAEEDA", fg: "#854F0B", quote1: "월요일이 제일 바쁜 날인데 입찰일이라니,", quote2: "다행히 안 가도 됐습니다.", meta: "2개월 전" },
  { id: 13, label: "30대 둘째 학부모", emoji: "🍼", bg: "#E6F1FB", fg: "#0C447C", quote1: "둘째가 어려서 자리를 비울 수가 없어요.", quote2: "집에서 신청만 하고 마쳤습니다.", meta: "5일 전" },
  { id: 14, label: "40대 교대 근무", emoji: "🏥", bg: "#F3E8FF", fg: "#3C3489", quote1: "병원 교대라 평일이 자유롭지 않아요.", quote2: "휴일 신청해도 처리됐습니다.", meta: "2주 전" },
  { id: 15, label: "30대 야간 근무", emoji: "🌃", bg: "#F3E8FF", fg: "#3C3489", quote1: "야간 끝나고 잠도 못 자고 법원은 무리거든요.", quote2: "쉬면서 결과만 받았습니다.", meta: "1주 전" },
  { id: 16, label: "60대 거동", emoji: "🦯", bg: "#F3F4F6", fg: "#444441", quote1: "거동이 예전 같지 않아 외출이 부담돼요.", quote2: "집에서 신청만 했습니다.", meta: "3개월 전" },
  { id: 17, label: "60대 첫 경매", emoji: "🤔", bg: "#F3F4F6", fg: "#444441", quote1: "처음 경매라 법원이 무서웠어요.", quote2: "맡기니 한결 가벼웠습니다.", meta: "2개월 전" },
  { id: 18, label: "30대 지방 거주", emoji: "🚄", bg: "#DCFCE7", fg: "#27500A", quote1: "지방에서 법원까지 왕복 6시간이거든요.", quote2: "안 움직이고 끝냈습니다.", meta: "5일 전" },
  { id: 19, label: "40대 통근", emoji: "🚇", bg: "#E0F2F1", fg: "#085041", quote1: "통근만 왕복 3시간인데 법원까지는 무리거든요.", quote2: "신청만 하고 결과 기다렸습니다.", meta: "2주 전" },
  { id: 20, label: "30대 신혼", emoji: "💍", bg: "#DCFCE7", fg: "#27500A", quote1: "맞벌이라 둘 다 시간 빼기가 쉽지 않아요.", quote2: "퇴근 후 신청해도 처리됐습니다.", meta: "1주 전" },
];

const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", system-ui, sans-serif';

const MASK_GRADIENT =
  "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ReviewsMarquee() {
  const [shuffled, setShuffled] = useState<Review[]>(REVIEWS);

  useEffect(() => {
    setShuffled(fisherYates(REVIEWS));
  }, []);

  const rowA = shuffled.slice(0, 10);
  const rowB = shuffled.slice(10, 20);

  const maskStyle = {
    maskImage: MASK_GRADIENT,
    WebkitMaskImage: MASK_GRADIENT,
    overflow: "hidden" as const,
  };

  return (
    <div className="mt-12 lg:mt-16">
      {/* 모바일 — 2-row 양방향 (위 좌→우 80s / 아래 우→좌 95s) */}
      <div className="lg:hidden">
        <div className="marquee-wrap" style={maskStyle}>
          <div className="marquee-row marquee-left-mobile">
            {[...rowA, ...rowA].map((r, i) => (
              <ReviewCard key={`m-a-${r.id}-${i}`} review={r} mobile />
            ))}
          </div>
        </div>
        <div className="marquee-wrap mt-3" style={maskStyle}>
          <div className="marquee-row marquee-right-mobile">
            {[...rowB, ...rowB].map((r, i) => (
              <ReviewCard key={`m-b-${r.id}-${i}`} review={r} mobile />
            ))}
          </div>
        </div>
      </div>

      {/* 데스크탑 — 2-row 양방향 (위 좌→우 / 아래 우→좌) */}
      <div className="hidden lg:block">
        <div className="marquee-wrap" style={maskStyle}>
          <div className="marquee-row marquee-left">
            {[...rowA, ...rowA].map((r, i) => (
              <ReviewCard key={`d-a-${r.id}-${i}`} review={r} />
            ))}
          </div>
        </div>
        <div className="marquee-wrap mt-4" style={maskStyle}>
          <div className="marquee-row marquee-right">
            {[...rowB, ...rowB].map((r, i) => (
              <ReviewCard key={`d-b-${r.id}-${i}`} review={r} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-row {
          display: flex;
          width: max-content;
        }
        .marquee-left {
          animation: marquee-left 50s linear infinite;
        }
        .marquee-right {
          animation: marquee-right 60s linear infinite;
        }
        .marquee-left-mobile {
          animation: marquee-left 80s linear infinite;
        }
        .marquee-right-mobile {
          animation: marquee-right 95s linear infinite;
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .marquee-wrap:hover .marquee-row {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function ReviewCard({
  review,
  mobile = false,
}: {
  review: Review;
  mobile?: boolean;
}) {
  const cardClass = mobile
    ? "relative mr-3 w-[240px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white px-4 pb-[14px] pt-[14px] shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
    : "relative mr-4 w-[280px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white px-5 pb-[18px] pt-[18px] shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <article className={cardClass}>
      {/* chat tail — inline span / 12×12 rotate-45 / border-l + border-t (카드 border 정합) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[6px] left-6 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"
      />

      {/* avatar + label row */}
      <header className="flex items-center gap-3">
        <div
          className={
            mobile
              ? "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              : "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
          }
          style={{ backgroundColor: review.bg, color: review.fg }}
        >
          <span
            style={{ fontFamily: EMOJI_FONT_FAMILY }}
            className={
              mobile
                ? "text-[24px] leading-none"
                : "text-[28px] leading-none"
            }
          >
            {review.emoji}
          </span>
        </div>
        <span
          className={
            mobile
              ? "text-[12px] font-medium text-gray-500"
              : "text-[14px] font-medium text-gray-500"
          }
        >
          {review.label}
        </span>
      </header>

      {/* quotes */}
      <p
        className={
          mobile
            ? "mt-3 text-[14px] font-medium leading-[1.5] text-[#111418]"
            : "mt-3 text-[16px] font-medium leading-[1.5] text-[#111418]"
        }
      >
        {review.quote1}
      </p>
      <p
        className={
          mobile
            ? "mt-1 text-[13px] leading-[1.5] text-gray-500"
            : "mt-1.5 text-[15px] leading-[1.5] text-gray-500"
        }
      >
        {review.quote2}
      </p>

      {/* meta */}
      <p
        className={
          mobile
            ? "mt-2 text-[11px] text-gray-400"
            : "mt-2 text-[12px] text-gray-400"
        }
      >
        {review.meta}
      </p>
    </article>
  );
}
