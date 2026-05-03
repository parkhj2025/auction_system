import { INSIGHT_CATEGORIES, type InsightCategoryKey } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v7 — InsightThumbnail (콘텐츠별 SVG 차별화 6건).
 * 광역 paradigm: 카테고리 색 base (gradient) + 콘텐츠 정수 영역 SVG (도식·다이어그램·아이콘).
 * 6건 차별화 — 광역 동일 0. */

export type ThumbnailKind =
  | "hug-deposit" /* 카드 1: HUG 말소동의 / 보증금 1.88억 → 1.25억 변환 */
  | "price-drop" /* 카드 2: 감정가 -27% / 가격 변화 그래프 */
  | "bid-criteria" /* 카드 3: 입찰가 산정 3가지 기준 다이어그램 */
  | "process-flow" /* 카드 4: 절차 4단계 플로우 */
  | "market-trend" /* 카드 5: 시장 인사이트 / 트렌드 그래프 */
  | "auction-trophy"; /* 카드 6: 낙찰 사례 / 트로피 + 가격 */

export function InsightThumbnail({
  cat,
  kind,
  large = false,
}: {
  cat: InsightCategoryKey;
  kind: ThumbnailKind;
  large?: boolean;
}) {
  const category = INSIGHT_CATEGORIES[cat];
  const color = category.color;

  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      {/* gradient bg base. */}
      <defs>
        <linearGradient id={`grad-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#grad-${kind})`} />

      {/* 콘텐츠 정수별 SVG 차별화. */}
      {kind === "hug-deposit" && <HugDeposit large={large} />}
      {kind === "price-drop" && <PriceDrop large={large} />}
      {kind === "bid-criteria" && <BidCriteria />}
      {kind === "process-flow" && <ProcessFlow />}
      {kind === "market-trend" && <MarketTrend />}
      {kind === "auction-trophy" && <AuctionTrophy />}
    </svg>
  );
}

/* 카드 1 (HUG 말소동의 / 보증금 변환) — large featured 카드 본질. */
function HugDeposit({ large }: { large: boolean }) {
  return (
    <g>
      {/* 오피스텔 building (좌). */}
      <g transform={large ? "translate(50 50)" : "translate(40 50)"}>
        <rect x="0" y="0" width="60" height="100" fill="white" opacity="0.95" rx="4" />
        <g fill="white" opacity="0.6">
          <rect x="8" y="14" width="12" height="10" />
          <rect x="28" y="14" width="12" height="10" />
          <rect x="48" y="14" width="6" height="10" />
          <rect x="8" y="32" width="12" height="10" />
          <rect x="28" y="32" width="12" height="10" />
          <rect x="48" y="32" width="6" height="10" />
          <rect x="8" y="50" width="12" height="10" />
          <rect x="28" y="50" width="12" height="10" />
          <rect x="48" y="50" width="6" height="10" />
          <rect x="8" y="68" width="12" height="10" />
          <rect x="28" y="68" width="12" height="10" />
          <rect x="48" y="68" width="6" height="10" />
        </g>
      </g>
      {/* 화살표 + 가격 변환. */}
      <g transform={large ? "translate(140 90)" : "translate(120 90)"}>
        <path
          d="M0 0 L40 0 M30 -8 L40 0 L30 8"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* 보증금 분리 / down 영역 시각. */}
      <g transform={large ? "translate(200 60)" : "translate(180 60)"}>
        <circle cx="30" cy="30" r="28" fill="white" opacity="0.95" />
        <path
          d="M20 20 L20 40 L40 40 M30 28 L40 40"
          stroke={INSIGHT_CATEGORIES.analysis.color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* 카드 2 (감정가 -27% / 가격 변화 그래프). */
function PriceDrop({ large: _large = false }: { large?: boolean }) {
  /* large 영역 보존 (현 시점 미사용 / 추후 본질 강조 영역). */
  void _large;
  return (
    <g>
      <g transform="translate(60 60)">
        {/* 그래프 axis. */}
        <line x1="0" y1="0" x2="0" y2="80" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="0" y1="80" x2="200" y2="80" stroke="white" strokeWidth="2" opacity="0.5" />
        {/* 가격 line drop. */}
        <polyline
          points="0,10 60,30 120,55 180,72"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* drop arrow + 강조 dot. */}
        <circle cx="180" cy="72" r="6" fill="white" />
        <circle cx="0" cy="10" r="6" fill="white" opacity="0.5" />
      </g>
    </g>
  );
}

/* 카드 3 (입찰가 산정 3가지 기준 다이어그램). */
function BidCriteria() {
  return (
    <g transform="translate(80 50)">
      {/* 중심 노드. */}
      <circle cx="80" cy="50" r="22" fill="white" />
      <text
        x="80"
        y="56"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill={INSIGHT_CATEGORIES.guide.color}
      >
        3
      </text>
      {/* 3 branch. */}
      <g stroke="white" strokeWidth="2.5" opacity="0.85">
        <line x1="80" y1="28" x2="80" y2="0" />
        <line x1="58" y1="62" x2="20" y2="86" />
        <line x1="102" y1="62" x2="140" y2="86" />
      </g>
      {/* branch nodes. */}
      <g fill="white">
        <circle cx="80" cy="0" r="8" />
        <circle cx="20" cy="86" r="8" />
        <circle cx="140" cy="86" r="8" />
      </g>
    </g>
  );
}

/* 카드 4 (절차 4단계 플로우). */
function ProcessFlow() {
  return (
    <g transform="translate(40 75)">
      {/* 4 단계 노드 + 화살표. */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 60} 0)`}>
          <circle cx="20" cy="25" r="14" fill="white" />
          <text
            x="20"
            y="30"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill={INSIGHT_CATEGORIES.guide.color}
          >
            {i + 1}
          </text>
          {i < 3 && (
            <path
              d="M40 25 L52 25 M48 21 L52 25 L48 29"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          )}
        </g>
      ))}
    </g>
  );
}

/* 카드 5 (시장 인사이트 / 트렌드 그래프 + bar). */
function MarketTrend() {
  return (
    <g transform="translate(60 50)">
      {/* bars. */}
      <g fill="white" opacity="0.85">
        <rect x="0" y="60" width="20" height="40" />
        <rect x="30" y="40" width="20" height="60" />
        <rect x="60" y="20" width="20" height="80" />
        <rect x="90" y="0" width="20" height="100" />
      </g>
      {/* trend line. */}
      <polyline
        points="10,75 40,55 70,35 100,15"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 강조 dot. */}
      <circle cx="100" cy="15" r="6" fill="white" />
      {/* 화살표. */}
      <path
        d="M120 15 L150 15 M145 10 L150 15 L145 20"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* 카드 6 (낙찰 사례 / 트로피 + 가격). */
function AuctionTrophy() {
  return (
    <g transform="translate(110 40)">
      {/* trophy cup. */}
      <path
        d="M30 0 L70 0 L68 50 Q68 65 50 70 Q32 65 32 50 Z"
        fill="white"
      />
      {/* trophy handles. */}
      <path
        d="M30 12 L18 18 L18 32 L30 32 M70 12 L82 18 L82 32 L70 32"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      {/* trophy base. */}
      <rect x="42" y="78" width="16" height="14" fill="white" opacity="0.9" />
      <rect x="34" y="92" width="32" height="10" fill="white" opacity="0.8" rx="2" />
      {/* 별 강조. */}
      <circle cx="50" cy="35" r="14" fill={INSIGHT_CATEGORIES.cases.color} />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="white"
      >
        ★
      </text>
    </g>
  );
}
