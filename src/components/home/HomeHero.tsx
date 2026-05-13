"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  FileText,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ImageOff,
  MessageCircle,
} from "lucide-react";
import type { CourtListingSummary } from "@/types/apply";
import { COMPANY } from "@/lib/constants";

/* cycle 1-G-γ-α-δ — Hero 사건 조회 + 물건 선택 + 자동 진입 paradigm:
 * - input 형식 검증 (CASE_NUMBER_PATTERN) + CTA "조회하기" → /api/auction/lookup GET fetch
 * - inline 결과 카드 (listings 1건 단독) + inline 물건 선택 (listings 다건)
 * - NG 안내 (status closed + not_found)
 * - sessionStorage 보존 (key + TTL 1시간) + /apply?case=XXX&prefill=1 진입. */

const CASE_NUMBER_PATTERN = /^\d{4}타경\d+$/;
const COURT_CODE = "B000240"; // Phase 1 = 인천지방법원 단독
const SESSION_KEY = "auctionquick:hero-lookup";
// SESSION_TTL_MS = ApplyClient.tsx 단독 사용 (1시간 / Hero 안 영역 0).

type LookupStatus =
  | "idle"
  | "loading"
  | "active-single"
  | "active-multi"
  | "closed"
  | "not-found"
  | "invalid"
  | "error"
  | "fetch-failed"
  | "already-taken"; // work-005 정정 3 = 1물건 1고객 race 회피 1차 단계 신규.

type SessionPayload = {
  caseNumber: string;
  selectedDocid: string | null;
  listings: CourtListingSummary[];
  lookupAt: number;
};

function saveSession(payload: SessionPayload) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage 영역 0 시점 = silent fallback.
  }
}

function formatWon(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return `${n.toLocaleString()}원`;
}

function formatBidDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export function HomeHero({ caseNumbers: _caseNumbers }: { caseNumbers: string[] }) {
  void _caseNumbers; // 사전 paradigm 호환 (사후 cycle 광역 제거 영역).
  const router = useRouter();
  const [value, setValue] = useState("");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [listings, setListings] = useState<CourtListingSummary[]>([]);
  const [selectedDocid, setSelectedDocid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().normalize("NFC");
    if (!trimmed) return;

    if (!CASE_NUMBER_PATTERN.test(trimmed)) {
      setLookupStatus("invalid");
      setListings([]);
      setSelectedDocid(null);
      setErrorMessage("사건번호 형식: 2024타경XXX (한글 '타경' 포함)");
      return;
    }

    setLookupStatus("loading");
    setListings([]);
    setSelectedDocid(null);
    setErrorMessage(null);

    try {
      const url = `/api/auction/lookup?caseNumber=${encodeURIComponent(trimmed)}&courtCode=${COURT_CODE}`;
      const res = await fetch(url);
      const json = (await res.json()) as {
        status: string;
        listings?: CourtListingSummary[];
      };

      if (json.status === "active" && json.listings && json.listings.length > 0) {
        setListings(json.listings);
        if (json.listings.length === 1) {
          setSelectedDocid(json.listings[0].docid);
          setLookupStatus("active-single");
        } else {
          setLookupStatus("active-multi");
        }
        return;
      }

      // work-005 정정 3 = 1물건 1고객 race 회피 1차 단계 (Hero 비로그인 시점).
      if (json.status === "already_taken") {
        setLookupStatus("already-taken");
        setErrorMessage(
          "이 사건은 이미 다른 고객의 신청이 진행 중입니다. 같은 회차는 중복 접수가 불가합니다. 다음 회차 진행 시점 재 진입 가능합니다.",
        );
        return;
      }

      if (json.status === "closed") {
        setLookupStatus("closed");
        setErrorMessage("이 사건은 매각이 종결됐습니다.");
        return;
      }

      if (json.status === "fetch_failed") {
        setLookupStatus("fetch-failed");
        setErrorMessage(
          "사건 정보 확인이 일시적으로 어렵습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      if (json.status === "not_found") {
        setLookupStatus("not-found");
        setErrorMessage(
          "사건 정보를 확인할 수 없습니다. 사건번호를 다시 확인해주세요.",
        );
        return;
      }

      setLookupStatus("error");
      setErrorMessage("조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } catch {
      setLookupStatus("error");
      setErrorMessage("조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function handleApply() {
    if (!selectedDocid) return;
    const trimmed = value.trim().normalize("NFC");
    const payload: SessionPayload = {
      caseNumber: trimmed,
      selectedDocid,
      listings,
      lookupAt: Date.now(),
    };
    saveSession(payload);
    router.push(
      `/apply?case=${encodeURIComponent(trimmed)}&prefill=1`,
    );
  }

  function handleRetry() {
    setLookupStatus("idle");
    setListings([]);
    setSelectedDocid(null);
    setErrorMessage(null);
  }

  const isLoading = lookupStatus === "loading";
  const hasResult =
    lookupStatus === "active-single" || lookupStatus === "active-multi";
  const hasError =
    lookupStatus === "closed" ||
    lookupStatus === "not-found" ||
    lookupStatus === "invalid" ||
    lookupStatus === "error" ||
    lookupStatus === "fetch-failed" ||
    lookupStatus === "already-taken";
  const ctaDisabled =
    isLoading || (lookupStatus === "active-multi" && !selectedDocid);
  const ctaLabel = isLoading
    ? "조회 중..."
    : hasResult
    ? "신청하기"
    : hasError
    ? "다시 조회하기"
    : "조회하기";

  function handleCtaClick() {
    if (hasResult) {
      handleApply();
    } else if (hasError) {
      handleRetry();
    }
    // idle / loading 시점 = form onSubmit 광역 진입 paradigm.
  }

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center overflow-hidden bg-[#111418] px-6 lg:min-h-[calc(100dvh-80px)]">
      <HeroFlowBackgroundDesktop />
      <HeroFlowBackgroundMobile />

      <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-6 text-center lg:gap-14">
        {/* h1. */}
        <h1
          className="w-full text-[44px] font-extrabold leading-[1.1] tracking-[-0.015em] text-white [text-wrap:balance] lg:text-[88px]"
          style={{
            fontWeight: 800,
            textShadow:
              "0 4px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          법원에 가지 않고,<br />
          {/* cycle 1-G-γ-α-θ 정정 5+6 = green 본문 + yellow 마침표 단독 paradigm (textShadow 옵션 D).
              h2 강조 단계 (Pricing + Insight + Reviews + TrustCTA) 통일 정합:
              - green 본문 = brand primary 직접 노출 + flat (textShadow 광역 = 그림자 단독 / glow 영역 0)
              - yellow 마침표 단독 강조 = 사전 yellow glow 광역 paradigm 보존 (사용자 시각 흐름 자연 유도). */}
          <span
            style={{
              color: "var(--brand-green)",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            경매를 시작하세요
          </span>
          <span
            style={{
              color: "#FFD43B",
              textShadow:
                "0 0 16px rgba(255, 212, 59, 0.4), 0 0 32px rgba(255, 212, 59, 0.25), 0 4px 16px rgba(0, 0, 0, 0.5)",
            }}
          >
            .
          </span>
        </h1>

        {/* 모바일 subtext. */}
        <p
          className="lg:hidden text-[17px] text-white/90 font-medium leading-[1.6] text-center"
          style={{
            textShadow:
              "0 2px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          사건번호만 주시면, 법원은 저희가 갑니다.
        </p>

        {/* 모바일 chip 2건. */}
        <div className="lg:hidden flex items-center justify-center gap-7">
          <div className="flex items-center gap-2">
            <Building2
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              법원 방문 없음
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText
              strokeWidth={2.2}
              className="w-[18px] h-[18px] flex-shrink-0 text-green-400"
            />
            <span
              className="text-[14px] text-white/95 font-semibold whitespace-nowrap"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              서류 비대면
            </span>
          </div>
        </div>

        {/* cycle 1-G-γ-α-ι-1 정정 2 = Liquid Glass 박스 불투명 약화 paradigm.
            사전 (0.35/0.20 + blur 40px + border 0.3 + shadow inset 0.5 + 32px/80px/0.35) →
            신규 (0.15/0.08 + blur 20px + border 0.20 + shadow inset 0.30 + 24px/60px/0.25).
            사용자 시각 단계 = 박스 자체 가벼움 + 백그라운드 일러스트 직접 노출 paradigm 회복. */}
        <div
          className="flex w-full flex-col items-center gap-5 rounded-[28px] px-6 py-7 lg:gap-8 lg:px-10 lg:py-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.20)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.30), 0 24px 60px -16px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* 데스크탑 박스 안 subtext. */}
          <p
            className="hidden lg:block text-center text-[24px] font-medium leading-[1.6] text-white/90"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)" }}
          >
            사건번호만 주시면, 법원은 저희가 갑니다.
          </p>

          {/* form (모바일 vertical + 데스크탑 horizontal). */}
          <form
            onSubmit={handleLookup}
            role="search"
            aria-label="사건번호 조회"
            className="flex w-full flex-col gap-3 lg:flex-row lg:max-w-[600px] lg:items-center lg:rounded-2xl lg:bg-white lg:p-1.5 lg:shadow-md"
          >
            <label htmlFor="hero-case" className="sr-only">
              사건번호
            </label>
            <input
              id="hero-case"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={isLoading}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (lookupStatus !== "idle") {
                  setLookupStatus("idle");
                  setListings([]);
                  setSelectedDocid(null);
                  setErrorMessage(null);
                }
              }}
              placeholder="사건번호 입력 (예: 2024타경569067)"
              className="w-full h-16 rounded-2xl bg-white px-5 text-[16px] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] outline-none shadow-md transition-shadow duration-150 focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:shadow-[0_0_0_3px_rgba(0,200,83,0.2)] disabled:cursor-not-allowed disabled:opacity-60 lg:h-16 lg:flex-1 lg:bg-transparent lg:px-6 lg:text-[18px] lg:shadow-none lg:focus:shadow-none"
            />
            <button
              type={hasResult || hasError ? "button" : "submit"}
              onClick={hasResult || hasError ? handleCtaClick : undefined}
              disabled={ctaDisabled}
              className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-green)] px-8 text-[16px] font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] active:scale-[0.98] active:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 lg:w-auto lg:rounded-xl lg:px-12 lg:text-[18px]"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {ctaLabel}
            </button>
          </form>

          {/* helper text. */}
          {lookupStatus === "idle" && (
            <p className="text-center text-xs text-white/60 lg:text-sm">
              한글 &apos;타경&apos; 포함 형식으로 입력해주세요
            </p>
          )}

          {/* inline 결과: status active. */}
          {hasResult && listings.length > 0 && (
            <div className="w-full">
              {lookupStatus === "active-multi" && (
                <p className="mb-3 text-sm text-white/80">
                  이 사건은 {listings.length}개 물건으로 구성됩니다. 신청하실 물건을 선택해주세요.
                </p>
              )}
              {lookupStatus === "active-single" && listings[0] && (
                <SingleListingCard listing={listings[0]} />
              )}
              {lookupStatus === "active-multi" && (
                <div className="flex flex-col gap-2">
                  {listings.map((l) => (
                    <ListingPickerCard
                      key={l.docid}
                      listing={l}
                      selected={selectedDocid === l.docid}
                      onClick={() => setSelectedDocid(l.docid)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NG 안내: closed + not-found + invalid + error = red / fetch-failed + already-taken = amber.
              work-005 정정 3 = already-taken 분기 = amber alert + 대안 carrier (카카오톡 + 다른 사건 button). */}
          {hasError && errorMessage && (
            <div
              className={
                lookupStatus === "fetch-failed" ||
                lookupStatus === "already-taken"
                  ? "flex w-full flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"
                  : "flex w-full items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
              }
            >
              <div className="flex items-start gap-3">
                {lookupStatus === "fetch-failed" ||
                lookupStatus === "already-taken" ? (
                  <AlertTriangle
                    size={20}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    size={20}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                )}
                <p className="text-sm font-medium leading-6 text-white">
                  {errorMessage}
                </p>
              </div>

              {/* work-005 정정 3 = already-taken 분기 대안 carrier (카카오톡 + 다른 사건 button). */}
              {lookupStatus === "already-taken" && (
                <div className="flex flex-wrap gap-2 pl-8">
                  <a
                    href={COMPANY.kakaoChannelUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-100 transition-colors duration-150 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  >
                    <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" />
                    카카오톡 상담
                  </a>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    다른 사건 검색
                  </button>
                </div>
              )}
            </div>
          )}

          {/* cycle 1-G-γ-α-ι-1 정정 3 = chip 2건 데스크탑 회복 paradigm.
              사전 `lookupStatus === "idle"` 분기 광역 폐기 → 광역 상태 (idle + loading + active + error)
              광역 데스크탑 chip 광역 광역 표시 paradigm. 모바일 chip 2건 (L233-259) 광역 정합 통일. */}

          {/* 데스크탑 강점 2건. */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Building2
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                법원 방문 없음
              </span>
            </div>
            <div className="h-5 w-px flex-shrink-0 bg-white/30" />
            <div className="flex items-center gap-2">
              <FileText
                strokeWidth={2}
                className="h-5 w-5 flex-shrink-0 text-green-400"
              />
              <span className="whitespace-nowrap text-[15px] font-semibold text-white/95">
                서류 비대면
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// inline 결과 카드.

function SingleListingCard({ listing }: { listing: CourtListingSummary }) {
  // cycle 1-G-γ-α-θ 정정 1 = η 정정 9 (Card image render) 폐기.
  // Hero 안 사진 표기 = fetch duration NG + 사용자 체감 NG 직접 source = placeholder 단독 단계 영구 보존.
  // DB photos column 광역 paradigm (η 정정 6+7+8) 광역 = 사후 별개 page (분석 + 카드 상세) 광역 사용 paradigm 영구 보존.
  return (
    <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
      <span className="inline-flex items-center rounded-full bg-[var(--brand-green)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
        조회 완료
      </span>
      <div className="mt-4 grid grid-cols-[88px_1fr] gap-4 lg:grid-cols-[120px_1fr]">
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/5"
        >
          <ImageOff
            size={32}
            className="text-white/40"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-2 text-left">
          {listing.usage_name && (
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-green)]">
              {listing.usage_name}
            </p>
          )}
          <p className="text-base font-medium leading-snug text-white">
            {listing.address_display ?? listing.case_title ?? "주소 정보 미수신"}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-white/80 sm:text-sm">
            <div>
              <p className="text-white/60">감정가</p>
              <p className="tabular-nums text-white">
                {formatWon(listing.appraisal_amount)}
              </p>
            </div>
            <div>
              <p className="text-white/60">최저가</p>
              <p className="tabular-nums text-white">
                {formatWon(listing.min_bid_amount)}
              </p>
            </div>
            <div>
              <p className="text-white/60">입찰일</p>
              <p className="tabular-nums text-white">
                {formatBidDate(listing.bid_date)}
              </p>
            </div>
            <div>
              <p className="text-white/60">유찰 횟수</p>
              <p className="tabular-nums text-white">{listing.failed_count}회</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ListingPickerCard({
  listing,
  selected,
  onClick,
}: {
  listing: CourtListingSummary;
  selected: boolean;
  onClick: () => void;
}) {
  // cycle 1-G-γ-α-θ 정정 1 = η 정정 9 (신규 image 영역) 폐기. 사전 사실 영역 0 paradigm 영구 회복 (text 단독 paradigm).
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-150 " +
        (selected
          ? "border-[var(--brand-green)] bg-[var(--brand-green)]/15"
          : "border-white/15 bg-white/5 hover:bg-white/10")
      }
    >
      <span
        aria-hidden="true"
        className={
          selected
            ? "h-2 w-2 shrink-0 rounded-full bg-[var(--brand-green)]"
            : "h-2 w-2 shrink-0 rounded-full bg-white/30"
        }
      />
      <span className="flex-1 text-sm text-white/90 tabular-nums">
        <span className="font-bold text-white">#{listing.item_sequence}</span>
        {listing.usage_name && (
          <span className="ml-2 text-white/70">{listing.usage_name}</span>
        )}
        {listing.address_display && (
          <span className="ml-2 text-white/60">
            · {listing.address_display}
          </span>
        )}
        <span className="ml-2 text-white/80">
          · {formatWon(listing.appraisal_amount)}
        </span>
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 자체 SVG 백그라운드 (continuous loop / cycle 1-G-γ-α-β + γ + θ + ι-1 paradigm).
// cycle 1-G-γ-α-ι-1 정정 1 = 모바일 SVG 광역 별개 컴포넌트 분기 paradigm (옵션 A 채택).
// HeroFlowBackgroundDesktop = 사전 1600x900 광역 lg:block (cycle θ scale 1.4 광역 폐기).
// HeroFlowBackgroundMobile = 신규 800x1200 viewBox + element 광역 재배치 paradigm.

function HeroFlowBackgroundDesktop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111418" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#111418" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#111418" stopOpacity="0.32" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="800"
          cy="450"
          r="500"
          fill="url(#hero-glow)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "800px 450px" }}
        />

        <g opacity="0.72">
          <rect x="120" y="640" width="80" height="160" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="220" y="580" width="100" height="220" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="340" y="620" width="70" height="180" fill="none" stroke="#00C853" strokeWidth="2" />
          <g>
            <rect x="700" y="500" width="200" height="300" fill="none" stroke="#00C853" strokeWidth="2.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={720 + i * 32}
                y1="560"
                x2={720 + i * 32}
                y2="780"
                stroke="#00C853"
                strokeWidth="2"
              />
            ))}
            <path
              d="M 690 500 L 800 440 L 910 500 Z"
              fill="none"
              stroke="#00C853"
              strokeWidth="2.5"
            />
            <circle cx="800" cy="470" r="6" fill="#FFD43B" />
          </g>
          <rect x="1000" y="600" width="90" height="200" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="1110" y="640" width="80" height="160" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="1210" y="580" width="100" height="220" fill="none" stroke="#00C853" strokeWidth="2" />
          <rect x="1330" y="620" width="70" height="180" fill="none" stroke="#00C853" strokeWidth="2" />
        </g>

        <motion.line
          x1="100"
          y1="180"
          x2="1500"
          y2="180"
          stroke="#00C853"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          opacity="0.7"
          animate={{ strokeDashoffset: [-20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="100"
          y1="720"
          x2="1500"
          y2="720"
          stroke="#00C853"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          opacity="0.7"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <motion.g
          opacity="0.75"
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "1380px 220px" }}
        >
          <rect x="1320" y="160" width="120" height="40" rx="6" fill="none" stroke="#00C853" strokeWidth="2.5" />
          <rect x="1370" y="200" width="20" height="80" rx="3" fill="none" stroke="#00C853" strokeWidth="2.5" />
          <circle cx="1380" cy="180" r="5" fill="#FFD43B" />
        </motion.g>

        <g opacity="0.75">
          <rect x="160" y="160" width="260" height="56" rx="14" fill="none" stroke="#00C853" strokeWidth="2.5" />
          <motion.rect
            x="180"
            y="180"
            width="120"
            height="6"
            rx="3"
            fill="#FFD43B"
            animate={{ width: [120, 180, 120] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="180" y="196" width="80" height="3" rx="1.5" fill="#00C853" opacity="0.7" />
        </g>

        {[
          { cx: 280, cy: 380, r: 4, delay: 0 },
          { cx: 520, cy: 280, r: 5, delay: 0.4 },
          { cx: 1120, cy: 340, r: 4, delay: 0.8 },
          { cx: 1280, cy: 480, r: 6, delay: 1.2 },
          { cx: 460, cy: 540, r: 4, delay: 1.6 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#FFD43B"
            opacity="0.9"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.5, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
            style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
          />
        ))}

        <rect width="1600" height="900" fill="url(#hero-fade)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroFlowBackgroundMobile — cycle 1-G-γ-α-ι-1 정정 1 신규.
// viewBox 800x1200 (3:4.5 광역 모바일 viewport 광역 광역 paradigm) + element 광역 재배치 +
// 광역 element 광역 크기 광역 (skyline + chart bar + dot + search bar + laptop) + center 광역 paradigm.
// 모바일 viewport (375px + 430px 양측) 광역 광역 element 자체 직접 인지 + 움직임 직접 인지 paradigm 정합.

function HeroFlowBackgroundMobile() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden lg:hidden"
    >
      <svg
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="hero-fade-mobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111418" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#111418" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#111418" stopOpacity="0.32" />
          </linearGradient>
          <radialGradient id="hero-glow-mobile" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="400"
          cy="600"
          r="400"
          fill="url(#hero-glow-mobile)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "400px 600px" }}
        />

        {/* skyline 광역 = 광역 4 building paradigm (광역 광역 광역 + center 광역 광역). */}
        <g opacity="0.72">
          <rect x="60" y="850" width="120" height="350" fill="none" stroke="#00C853" strokeWidth="2.5" />
          <rect x="220" y="780" width="140" height="420" fill="none" stroke="#00C853" strokeWidth="2.5" />
          <g>
            {/* center 광역 광역 = court building paradigm (광역 광역 광역 광역). */}
            <rect x="400" y="700" width="200" height="500" fill="none" stroke="#00C853" strokeWidth="3" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={420 + i * 30}
                y1="780"
                x2={420 + i * 30}
                y2="1180"
                stroke="#00C853"
                strokeWidth="2"
              />
            ))}
            <path
              d="M 390 700 L 500 620 L 610 700 Z"
              fill="none"
              stroke="#00C853"
              strokeWidth="3"
            />
            <circle cx="500" cy="660" r="8" fill="#FFD43B" />
          </g>
          <rect x="640" y="820" width="120" height="380" fill="none" stroke="#00C853" strokeWidth="2.5" />
        </g>

        <motion.line
          x1="40"
          y1="240"
          x2="760"
          y2="240"
          stroke="#00C853"
          strokeWidth="2"
          strokeDasharray="10 14"
          opacity="0.7"
          animate={{ strokeDashoffset: [-24, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="40"
          y1="980"
          x2="760"
          y2="980"
          stroke="#00C853"
          strokeWidth="2"
          strokeDasharray="10 14"
          opacity="0.7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* laptop motion.g (광역 광역 광역 광역 광역). */}
        <motion.g
          opacity="0.75"
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "600px 320px" }}
        >
          <rect x="520" y="240" width="160" height="56" rx="8" fill="none" stroke="#00C853" strokeWidth="3" />
          <rect x="590" y="296" width="28" height="100" rx="4" fill="none" stroke="#00C853" strokeWidth="3" />
          <circle cx="600" cy="268" r="7" fill="#FFD43B" />
        </motion.g>

        {/* search bar (광역 광역 광역). */}
        <g opacity="0.75">
          <rect x="60" y="60" width="340" height="80" rx="20" fill="none" stroke="#00C853" strokeWidth="3" />
          <motion.rect
            x="84"
            y="88"
            width="160"
            height="8"
            rx="4"
            fill="#FFD43B"
            animate={{ width: [160, 240, 160] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="84" y="108" width="110" height="4" rx="2" fill="#00C853" opacity="0.7" />
        </g>

        {[
          { cx: 120, cy: 480, r: 5, delay: 0 },
          { cx: 280, cy: 380, r: 6, delay: 0.4 },
          { cx: 560, cy: 460, r: 5, delay: 0.8 },
          { cx: 680, cy: 540, r: 7, delay: 1.2 },
          { cx: 200, cy: 660, r: 5, delay: 1.6 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="#FFD43B"
            opacity="0.9"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.5, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
            style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
          />
        ))}

        <rect width="800" height="1200" fill="url(#hero-fade-mobile)" />
      </svg>
    </div>
  );
}
