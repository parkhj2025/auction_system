"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

/* Stage 2 cycle 1-A 보강 5 — 활성 모드 단일 paradigm.
 * paradigm: 검색 input + 검색 버튼(charcoal outline) + 결과 list + 사용자 선택 → onSelect callback.
 * /api/address proxy 광역 호출 (승인키 server-side 단독).
 * 두 단계 진입(readonly→활성 전환) paradigm 광역 폐기 / "검색 취소" 링크 폐기. */

export type AddressSearchResult = {
  full: string;
  jibun: string;
  zipCode: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  buildingName: string;
};

interface Props {
  onSelect: (address: AddressSearchResult) => void;
}

export function AddressSearch({ onSelect }: Props) {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<AddressSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function search() {
    const q = keyword.trim();
    if (q.length < 2) {
      setError("검색어를 두 글자 이상 입력해주세요.");
      return;
    }
    setError(null);
    setSearching(true);
    try {
      const res = await fetch(`/api/address?keyword=${encodeURIComponent(q)}`);
      const data = (await res.json()) as
        | { ok: true; items: AddressSearchResult[] }
        | { ok: false; error: string };
      if (!data.ok) {
        setError(data.error);
        setItems([]);
      } else {
        setItems(data.items);
      }
      setSearched(true);
    } catch {
      setError("주소 검색 중 오류가 발생했습니다.");
      setItems([]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="예: 미추홀구 주안동 또는 도로명 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void search();
            }
          }}
          className="h-[var(--input-h-app)] w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-[var(--color-ink-900)] placeholder:text-gray-400 transition-colors duration-150 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 sm:flex-1"
        />
        <button
          type="button"
          onClick={() => void search()}
          disabled={searching}
          className="inline-flex h-[var(--input-h-app)] w-full items-center justify-center gap-2 rounded-full border border-[var(--color-ink-900)] bg-white px-5 text-sm font-bold text-[var(--color-ink-900)] transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 sm:w-auto sm:shrink-0"
        >
          {searching ? (
            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
          ) : (
            <Search size={16} aria-hidden="true" />
          )}
          {searching ? "검색 중..." : "검색"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-[var(--color-accent-red)]">{error}</p>
      )}

      {searched && !error && items.length === 0 && !searching && (
        <p className="mt-3 text-xs text-gray-500">검색 결과가 없습니다.</p>
      )}

      {items.length > 0 && (
        <ul className="mt-3 flex max-h-64 flex-col gap-1 overflow-y-auto">
          {items.map((item, i) => (
            <li key={`${item.full}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex w-full flex-col items-start gap-0.5 rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors duration-150 hover:border-[var(--brand-green)] hover:bg-[var(--brand-green)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
              >
                <p className="text-sm font-bold text-[var(--color-ink-900)]">{item.full}</p>
                {item.jibun && (
                  <p className="text-xs text-gray-500">
                    [지번] {item.jibun}
                  </p>
                )}
                {item.zipCode && (
                  <p className="text-xs text-gray-400">우편번호 {item.zipCode}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
