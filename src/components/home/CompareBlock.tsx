import Image from "next/image";

/* Phase 1.2 (A-1-2) v7 — CompareBlock (Manako compare-flow 일러스트 + h2 카피 v5).
 * h2 "법원 가는 3시간, 물건 보는 시간으로." (보존)
 * 시각: Manako compare-flow.png (좌 stressed → 화살표 → 우 happy 본질 정수). */

export function CompareBlock() {
  return (
    <section
      aria-labelledby="compare-heading"
      className="bg-[var(--bg-primary)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="compare-heading"
            className="text-[var(--text-h2)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
            style={{ fontWeight: 800 }}
          >
            법원 가는{" "}
            <span className="text-[var(--text-tertiary)]">3시간</span>,
            <br className="hidden sm:block" />
            물건 보는{" "}
            <span className="text-[var(--brand-green)]">시간으로.</span>
          </h2>
        </div>

        {/* Manako compare-flow 일러스트 — 좌 stressed → 화살표 → 우 happy. */}
        <div className="relative mx-auto mt-12 aspect-square w-full max-w-[720px] lg:mt-16">
          <Image
            src="/illustrations/compare-flow.png"
            alt="법원에 가던 사람이 모바일로 편하게 신청하는 변화"
            width={720}
            height={720}
            sizes="(max-width: 768px) 90vw, 720px"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
