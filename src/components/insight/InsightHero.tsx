"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  categoryLabel,
  type InsightPostStats,
} from "@/lib/insightMock";
import type { InsightCardData } from "@/lib/content";
import { ArrowRightIcon } from "@/components/insight/icons";

/* 단계 2.5 (work-012) — /insight Live Data Hero.
 * mock 폐기 사후 paradigm: 첫 카드 자동 featured (publishedAt desc 정렬 최상단 / server 안 결정).
 * 우측 = 데이터 시각 패널 (큰 숫자 count-up + 단계 trend line SVG line draw / stats 부재 시점 fallback).
 * 좌측 = 정정 5 보존 (칩 2건 + 메인 + 서브 + 마침표 yellow + CTA 0).
 * Hero 외 영역 = 정정 1~5 보존. 카드 click = Link href 진입 paradigm. */

const ACCENT_YELLOW = "#FFD43B";
const STAGE_LABELS = ["감정가", "1차", "2차", "3차", "최저가"];

function formatPriceKR(won: number): string {
  const eok = won / 100_000_000;
  return `${eok.toFixed(2).replace(/\.?0+$/, "")}억`;
}

export function InsightHero({
  editorsPick,
}: {
  editorsPick: InsightCardData;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-green)]">
      {/* 우상단 미세 도형 (white alpha 0.08 / 그라데이션 영구 폐기). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[460px] w-[460px] rounded-full bg-white/[0.08]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 lg:py-12">
        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* 좌측 = 칩 2건 + 메인타이틀 + 서브타이틀 (정정 5 보존). */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex max-w-xl flex-col gap-3.5 lg:gap-4"
          >
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-[#111418]"
                style={{ backgroundColor: ACCENT_YELLOW }}
              >
                Editor&apos;s Pick
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-[#111418]"
                style={{ backgroundColor: ACCENT_YELLOW }}
              >
                매주 업데이트
              </span>
            </div>

            <h1 className="text-[28px] font-extrabold leading-[1.25] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[44px]">
              분석 자료까지,{" "}
              <span style={{ color: ACCENT_YELLOW }}>무료로 드립니다.</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-white lg:text-[18px]">
              경매 입찰 전 알아야 할 모든 자료를 한 곳에 모았습니다.
            </p>
          </motion.div>

          {/* 우측 = Live Data Panel (첫 카드 stats 직접 시각 / stats 부재 시점 fallback). */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <DataPanel post={editorsPick} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DataPanel({ post }: { post: InsightCardData }) {
  return (
    <Link
      href={post.href}
      className="group block w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-5 text-left shadow-[0_20px_50px_-12px_rgba(0,0,0,0.30)] transition-colors hover:border-[var(--brand-green)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-green)] lg:p-6"
    >
      {/* Top label. */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold tracking-wide text-[var(--brand-green)]">
          Editor&apos;s Pick
        </span>
        <span className="text-[12px] font-semibold text-[var(--color-ink-500)]">
          · {categoryLabel(post.insightSlug)}
        </span>
      </div>

      {/* 큰 숫자 + 단계 trend line (stats 부재 시점 fallback). */}
      {post.stats ? (
        <>
          <BigRatio ratio={post.stats.appraisedRatio} />
          <div className="mt-5">
            <StageTrendLine stats={post.stats} />
          </div>
        </>
      ) : (
        <div className="mt-4" />
      )}

      {/* 제목. */}
      <h2 className="mt-5 line-clamp-2 text-[18px] font-extrabold leading-snug tracking-[-0.01em] text-[#111418] lg:text-[20px]">
        {post.title}
      </h2>

      {/* CTA. */}
      <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--brand-green)] px-5 py-2.5 text-[14px] font-bold text-white transition-colors lg:text-[15px]">
        지금 보러 가기
        <ArrowRightIcon
          size={17}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function BigRatio({ ratio }: { ratio: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setValue(ratio), 600);
    return () => clearTimeout(t);
  }, [ratio]);
  return (
    <div className="mt-4">
      <p className="text-[60px] font-black leading-none tracking-[-0.02em] text-[#111418] tabular-nums lg:text-[72px]">
        <NumberFlow value={value} />
        <span className="ml-1 text-[var(--brand-green)]">%</span>
      </p>
      <p className="mt-2 text-[13px] font-medium text-[var(--color-ink-500)]">
        감정가 대비 최저가
      </p>
    </div>
  );
}

function StageTrendLine({ stats }: { stats: InsightPostStats }) {
  const prices = stats.stagePrices;
  const max = Math.max(...prices);
  const W = 360;
  const H = 140;
  const padX = 28;
  const padTop = 22;
  const padBottom = 30;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;
  const stepX = innerW / Math.max(1, prices.length - 1);

  const points = prices.map((p, i) => {
    const x = padX + i * stepX;
    const y = padTop + innerH * (1 - p / max);
    return { x, y, p };
  });

  const d = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`유찰 단계별 가격: ${prices.map((p) => formatPriceKR(p)).join(", ")}`}
    >
      {/* baseline. */}
      <line
        x1={padX}
        y1={H - padBottom}
        x2={W - padX}
        y2={H - padBottom}
        stroke="var(--color-border)"
        strokeWidth={1}
      />

      {/* 단계 trend line — SVG line draw (motion pathLength 0 → 1). */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--brand-green)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.8 }}
      />

      {/* dots + 단계 label. */}
      {points.map((pt, i) => (
        <g key={i}>
          <motion.circle
            cx={pt.x}
            cy={pt.y}
            r={4.5}
            fill="var(--brand-green)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.25,
              delay: 1.6 + i * 0.05,
              ease: "easeOut",
            }}
          />
          <text
            x={pt.x}
            y={H - 10}
            textAnchor="middle"
            fill="var(--color-ink-500)"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            {STAGE_LABELS[i] ?? ""}
          </text>
        </g>
      ))}

      {/* 시작·끝 가격 label (최소·최대 강조 / 중간 단계 = 시각 정리). */}
      <motion.text
        x={points[0].x}
        y={points[0].y - 8}
        textAnchor="middle"
        fill="#111418"
        style={{ fontSize: 11, fontWeight: 700 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
      >
        {formatPriceKR(points[0].p)}
      </motion.text>
      <motion.text
        x={points[points.length - 1].x}
        y={points[points.length - 1].y - 8}
        textAnchor="middle"
        fill="var(--brand-green)"
        style={{ fontSize: 11, fontWeight: 700 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.6 + (points.length - 1) * 0.05 }}
      >
        {formatPriceKR(points[points.length - 1].p)}
      </motion.text>
    </svg>
  );
}
