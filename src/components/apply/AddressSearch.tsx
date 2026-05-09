"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

/* Stage 2 cycle 1-A 보강 4 — 행안부 도로명주소 검색 광역.
 * paradigm: 검색 input + 검색 버튼 + 결과 list + 사용자 선택 → onSelect callback.
 * /api/address proxy 광역 호출 (승인키 server-side 단독). */

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
  onCancel?: () => void;
}

export function AddressSearch({ onSelect, onCancel }: Props) {
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
          className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-[#111418] placeholder:text-gray-400 transition-colors duration-150 focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 sm:flex-1"
        />
        <button
          type="button"
          onClick={() => void search()}
          disabled={searching}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-green)] px-5 text-sm font-bold text-white transition-colors duration-150 hover:bg-[var(--brand-green-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:w-auto sm:shrink-0"
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
                <p className="text-sm font-bold text-[#111418]">{item.full}</p>
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

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-[#111418]"
        >
          검색 취소
        </button>
      )}
    </div>
  );
}
