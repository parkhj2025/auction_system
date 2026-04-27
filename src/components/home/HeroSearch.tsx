"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, FileText, MapPin } from "lucide-react";
import { COURTS_ACTIVE, COURTS_COMING_SOON, FEES } from "@/lib/constants";
import { cn, formatKoreanWon } from "@/lib/utils";

type Mode = "case" | "address";

interface TypeaheadItem {
  docid: string;
  case_number: string;
  court_name: string;
  court_code: string;
  address_display: string | null;
  bid_date: string | null;
  min_bid_amount: number | null;
  usage_name: string | null;
}

export function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("case");
  const [court, setCourt] = useState<string>(COURTS_ACTIVE[0].value);
  const [caseNumber, setCaseNumber] = useState("");
  const [keyword, setKeyword] = useState("");

  // Typeahead state
  const [suggestions, setSuggestions] = useState<TypeaheadItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 디바운스 typeahead — 법원 무관 검색 (결과에 court_name 포함)
  useEffect(() => {
    if (mode !== "case" || caseNumber.trim().length < 4) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        // courtCode 파라미터 없이 전체 법원에서 검색
        const res = await fetch(
          `/api/court-listings/search?q=${encodeURIComponent(caseNumber.trim())}&limit=10`
        );
        const json = (await res.json()) as { results: TypeaheadItem[] };
        setSuggestions(json.results);
        setShowDropdown(json.results.length > 0 || caseNumber.trim().length >= 4);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [caseNumber, court, mode]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(item: TypeaheadItem) {
    setShowDropdown(false);
    setCaseNumber(item.case_number);
    const params = new URLSearchParams();
    params.set("case", item.case_number);
    // 사건의 실제 법원명으로 전달 (사용자가 선택한 법원이 아닌 데이터의 법원)
    params.set("court", item.court_name);
    params.set("docid", item.docid);
    router.push(`/apply?${params.toString()}`);
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIdx]);
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showDropdown, suggestions, activeIdx]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "case") {
      const params = new URLSearchParams();
      if (caseNumber.trim()) params.set("case", caseNumber.trim());
      if (court) params.set("court", court);
      router.push(`/apply?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("q", keyword.trim());
      const qs = params.toString();
      router.push(qs ? `/analysis?${qs}` : "/analysis");
    }
  }

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-ink-50)]0/30 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
        <p className="text-sm font-medium tracking-wide text-white/85">
          법원 안 가는 부동산 경매 입찰 대리
        </p>
        <h1 className="mt-3 text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl">
          입찰은 맡기고,
          <br className="sm:hidden" /> 얼리버드{" "}
          <span className="text-[var(--color-accent-yellow)]">
            {(FEES.earlybird / 10000).toLocaleString("ko-KR")}만원
          </span>
          부터
        </h1>
        <p className="mt-4 max-w-xl text-white/85">
          공인중개사·서울보증보험 가입. 패찰 시 보증금 당일 즉시 반환.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-[var(--radius-xl)] bg-white p-4 shadow-[var(--shadow-lift)] sm:p-5"
        >
          {/* 탭 */}
          <div
            role="tablist"
            aria-label="검색 방식"
            className="flex gap-1 rounded-[var(--radius-md)] bg-[var(--color-ink-100)] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "case"}
              onClick={() => setMode("case")}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-sm font-bold transition",
                mode === "case"
                  ? "bg-white text-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
              )}
            >
              <FileText size={16} aria-hidden="true" />
              사건번호로 찾기
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "address"}
              onClick={() => setMode("address")}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-sm font-bold transition",
                mode === "address"
                  ? "bg-white text-[var(--color-ink-900)] shadow-[var(--shadow-card)]"
                  : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
              )}
            >
              <MapPin size={16} aria-hidden="true" />
              주소·단지명으로 찾기
            </button>
          </div>

          {/* 입력 영역 */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {mode === "case" ? (
              <>
                <label className="sr-only" htmlFor="hero-court">
                  법원 선택
                </label>
                <select
                  id="hero-court"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="h-12 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink-900)] sm:w-48"
                >
                  <optgroup label="서비스 중">
                    {COURTS_ACTIVE.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="서비스 준비 중">
                    {COURTS_COMING_SOON.map((c) => (
                      <option key={c.value} value={c.value} disabled>
                        {c.label}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="relative flex-1">
                  <label className="sr-only" htmlFor="hero-case">
                    사건번호
                  </label>
                  <input
                    ref={inputRef}
                    id="hero-case"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    placeholder="예: 2021타경521675"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                  />

                  {/* Typeahead 드롭다운 — 결과 있거나 검색 중일 때만 노출.
                      빈 결과(데이터 결핍 자인) 메시지 미노출 — Lessons Learned [B] UX 무언화 원칙 (2026-04-19). */}
                  {showDropdown &&
                    (suggestions.length > 0 || searching) && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lift)]"
                      >
                        {suggestions.length > 0
                          ? suggestions.map((item, idx) => (
                              <button
                                key={item.docid}
                                type="button"
                                onClick={() => selectSuggestion(item)}
                                className={cn(
                                  "flex w-full flex-col gap-0.5 border-b border-[var(--color-border)] px-4 py-3 text-left transition last:border-b-0",
                                  idx === activeIdx
                                    ? "bg-[var(--color-ink-50)]"
                                    : "hover:bg-[var(--color-surface-muted)]",
                                )}
                              >
                                <span className="text-sm font-bold text-[var(--color-ink-900)]">
                                  {item.case_number}
                                  <span className="ml-2 text-xs font-medium text-[var(--color-ink-500)]">
                                    {item.court_name}
                                  </span>
                                </span>
                                <span className="text-xs text-[var(--color-ink-500)]">
                                  {item.address_display}
                                </span>
                                <span className="text-xs text-[var(--color-ink-500)]">
                                  {item.bid_date}
                                  {item.min_bid_amount != null &&
                                    ` · 최저가 ${formatKoreanWon(item.min_bid_amount)}`}
                                </span>
                              </button>
                            ))
                          : (
                              <p className="px-4 py-3 text-xs text-[var(--color-ink-500)]">
                                검색 중...
                              </p>
                            )}
                      </div>
                    )}
                </div>
              </>
            ) : (
              <>
                <label className="sr-only" htmlFor="hero-keyword">
                  주소 또는 단지명
                </label>
                <input
                  id="hero-keyword"
                  type="search"
                  inputMode="search"
                  placeholder="예: 인천 미추홀구 주안동 · 덕산하이츠"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-12 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                />
              </>
            )}

            <button
              type="submit"
              className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-ink-900)] px-6 text-base font-bold text-white shadow-[var(--shadow-card)] transition hover:bg-black"
            >
              <Search size={18} aria-hidden="true" />
              찾아보기
            </button>
          </div>

          <p className="mt-3 text-xs text-[var(--color-ink-500)]">
            {mode === "case" ? (
              <>
                사건번호를 알고 계신 경우, 해당 물건 상세로 바로 이동합니다.
                <span className="mt-0.5 block">
                  수원·대전·부산·대구 법원은 오픈 예정입니다. 오픈 시 공지사항에서
                  안내드립니다.
                </span>
              </>
            ) : (
              "경매 초보자라면 지역이나 단지명으로 최신 분석을 찾아보세요."
            )}
          </p>
        </form>

        <p className="mt-6 text-sm text-white/85">
          수수료 체계 ·{" "}
          <a
            href="#pricing"
            className="font-bold text-white underline decoration-[var(--color-ink-300)] underline-offset-4 hover:decoration-white"
          >
            얼리버드 5만 · 일반 7만 · 급건 10만
          </a>
        </p>
      </div>
    </section>
  );
}
