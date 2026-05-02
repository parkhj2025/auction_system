import Link from "next/link";
import { getActiveInsightPosts, type InsightChipKey } from "@/lib/content";

/* Phase 1.2 (A-1-2) v2 — 인사이트 블록 (카드뉴스·뉴스레터 본질).
 * 변경:
 *  - chip-nav 4건 navigator 폐기 (시각 본질 ↓)
 *  - 카드뉴스 grid 본질 (썸네일 16:9 + chip 1건 + 제목 + 설명)
 *  - SVG 썸네일 4 카테고리 (도시·차트·신문·법원)
 *  - subtext 압축 ("경매에 필요한 모든 자료, 무료로.")
 *  - h1 보존 ("숫자로 읽는 경매") */

const CHIP_LABEL: Record<InsightChipKey, string> = {
  analysis: "무료 물건분석",
  insight: "시장 인사이트",
  news: "뉴스",
  guide: "경매 기본정보",
};

/* SVG 썸네일 본질 (Code 자유 / inline 본질). 카테고리별 추상 일러스트. */
function CategoryThumbnail({ chip }: { chip: InsightChipKey }) {
  if (chip === "analysis") {
    /* 무료 물건분석 = 도시·핀 일러스트 (Hero 우측 카드와 동일 본질). */
    return (
      <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#FAFAFA" />
        <g fill="#E4E4E7">
          <rect x="20" y="100" width="36" height="80" />
          <rect x="62" y="80" width="42" height="100" />
          <rect x="110" y="60" width="50" height="120" />
          <rect x="166" y="90" width="40" height="90" />
          <rect x="212" y="70" width="48" height="110" />
          <rect x="266" y="105" width="34" height="75" />
        </g>
        <g transform="translate(160 50)">
          <circle cx="0" cy="0" r="14" fill="#18181B" />
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          <path d="M0 14 L0 30" stroke="#18181B" strokeWidth="3" />
        </g>
      </svg>
    );
  }
  if (chip === "insight") {
    /* 시장 인사이트 = 차트·라인 일러스트. */
    return (
      <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#FAFAFA" />
        {/* 격자 */}
        <g stroke="#E4E4E7" strokeWidth="1">
          <line x1="40" y1="40" x2="40" y2="150" />
          <line x1="40" y1="150" x2="290" y2="150" />
        </g>
        {/* 바 차트 */}
        <g fill="#E4E4E7">
          <rect x="60" y="100" width="20" height="50" />
          <rect x="100" y="80" width="20" height="70" />
          <rect x="140" y="60" width="20" height="90" />
          <rect x="180" y="90" width="20" height="60" />
          <rect x="220" y="50" width="20" height="100" />
        </g>
        {/* 트렌드 라인 */}
        <polyline
          points="70,95 110,75 150,55 190,85 230,45 260,30"
          fill="none"
          stroke="#18181B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="260" cy="30" r="4" fill="#18181B" />
      </svg>
    );
  }
  if (chip === "news") {
    /* 뉴스 = 신문·문서 일러스트. */
    return (
      <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#FAFAFA" />
        {/* 신문 종이 */}
        <g>
          <rect x="80" y="30" width="160" height="120" rx="4" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="1.5" />
          {/* 헤드라인 */}
          <rect x="100" y="50" width="120" height="10" rx="2" fill="#18181B" />
          {/* 본문 라인 */}
          <g fill="#E4E4E7">
            <rect x="100" y="70" width="120" height="3" />
            <rect x="100" y="80" width="120" height="3" />
            <rect x="100" y="90" width="120" height="3" />
            <rect x="100" y="100" width="80" height="3" />
            <rect x="100" y="115" width="120" height="3" />
            <rect x="100" y="125" width="100" height="3" />
          </g>
        </g>
      </svg>
    );
  }
  /* 경매 기본정보 = 법원 기둥·문서 일러스트. */
  return (
    <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="180" fill="#FAFAFA" />
      {/* 법원 지붕 */}
      <polygon points="80,70 240,70 160,40" fill="#E4E4E7" />
      {/* 기둥 4개 */}
      <g fill="#D4D4D8">
        <rect x="90" y="70" width="14" height="80" />
        <rect x="118" y="70" width="14" height="80" />
        <rect x="188" y="70" width="14" height="80" />
        <rect x="216" y="70" width="14" height="80" />
      </g>
      {/* 바닥 */}
      <rect x="76" y="148" width="168" height="6" fill="#18181B" />
      {/* 정의의 저울 */}
      <g transform="translate(160 90)">
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#18181B" strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="#18181B" strokeWidth="2" />
        <circle cx="-20" cy="0" r="3" fill="#18181B" />
        <circle cx="20" cy="0" r="3" fill="#18181B" />
      </g>
    </svg>
  );
}

export function FreeAnalysisBlock() {
  const posts = getActiveInsightPosts().slice(0, 6);

  return (
    <section
      aria-labelledby="insight-heading"
      className="bg-[var(--bg-primary)] border-b border-[var(--border-1)]"
    >
      <div className="container-app py-[var(--section-py)]">
        <div className="max-w-2xl">
          <p className="section-eyebrow">경매 인사이트</p>
          <h2
            id="insight-heading"
            className="text-h1 mt-3 text-[var(--text-primary)]"
          >
            숫자로 읽는 경매
          </h2>
          <p className="text-body-lg mt-4 text-[var(--text-secondary)]">
            경매에 필요한 모든 자료, 무료로.
          </p>
        </div>

        {posts.length > 0 ? (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {posts.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-1)] bg-[var(--bg-primary)] transition-[transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-sm"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[var(--bg-secondary)]">
                    <CategoryThumbnail chip={item.chip} />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="text-meta inline-flex h-6 w-fit items-center rounded-full border border-[var(--border-1)] bg-[var(--bg-secondary)] px-2.5 text-[var(--text-secondary)]">
                      {CHIP_LABEL[item.chip]}
                    </span>
                    <h3 className="text-h3 text-[var(--text-primary)] group-hover:underline">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-body-sm line-clamp-2 text-[var(--text-secondary)]">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body mt-8 text-[var(--text-tertiary)]">
            콘텐츠가 곧 공개됩니다.
          </p>
        )}

        <div className="mt-10 flex justify-end">
          <Link
            href="/analysis"
            className="text-body-sm inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:underline"
          >
            경매 인사이트 전체 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
