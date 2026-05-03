import { INSIGHT_CATEGORIES, type InsightCategoryKey } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v9 — InsightThumbnail (큰 숫자 typography + 미세 시각 도식 6건 차별화).
 * 기하학 SVG 광역 폐기 → 콘텐츠 정수 큰 숫자 우선 + 미세 도식 보조 영역.
 * 색 분배: green 2 (analysis) + blue 2 (guide) + orange 1 (insight) + purple 1 (cases).
 * isLarge = true → 큰 카드 (col-span-2 row-span-2 / typography 광역 ↑↑) */

export type ThumbnailKind =
  | "hug-deposit"     /* 카드 1 (큰): HUG 말소동의 / 보증금 변환 1.88억 → 1.25억 */
  | "price-drop"      /* 카드 2: 감정가 -27% */
  | "bid-criteria"    /* 카드 3: 입찰가 산정 3가지 기준 */
  | "process-flow"    /* 카드 4: 절차 4단계 */
  | "market-trend"    /* 카드 5: 낙찰가율 +4.2%p */
  | "auction-trophy"; /* 카드 6: 낙찰가 1.32억 */

export function InsightThumbnail({
  cat,
  kind,
  isLarge = false,
}: {
  cat: InsightCategoryKey;
  kind: ThumbnailKind;
  isLarge?: boolean;
}) {
  const category = INSIGHT_CATEGORIES[cat];
  const color = category.color;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}b3 100%)`,
      }}
      aria-hidden="true"
    >
      {/* 미세 도식 (배경 영역 / SVG 광역). */}
      <svg
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-30"
      >
        {kind === "hug-deposit" && <DotGridDecor />}
        {kind === "price-drop" && <LineGraphDecor direction="down" />}
        {kind === "bid-criteria" && <CheckListDecor />}
        {kind === "process-flow" && <FlowDotsDecor />}
        {kind === "market-trend" && <LineGraphDecor direction="up" />}
        {kind === "auction-trophy" && <SparkleDecor />}
      </svg>

      {/* 콘텐츠 정수 큰 숫자 typography (영역 우선). */}
      <div className="relative z-10 px-4 text-center text-white">
        {kind === "hug-deposit" && <HugDepositText isLarge={isLarge} />}
        {kind === "price-drop" && <PriceDropText isLarge={isLarge} />}
        {kind === "bid-criteria" && <BidCriteriaText isLarge={isLarge} />}
        {kind === "process-flow" && <ProcessFlowText isLarge={isLarge} />}
        {kind === "market-trend" && <MarketTrendText isLarge={isLarge} />}
        {kind === "auction-trophy" && <AuctionTrophyText isLarge={isLarge} />}
      </div>
    </div>
  );
}

/* ─── 콘텐츠별 큰 숫자 typography 6건 ───────────────────────── */

function HugDepositText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[44px] lg:text-[64px]" : "text-[28px] lg:text-[36px]"}`}>
        1.88억 <span className="opacity-70">→</span> 1.25억
      </div>
      <div className={`inline-flex rounded-full bg-white/25 px-3 py-1 font-bold ${isLarge ? "text-[15px] lg:text-[18px]" : "text-[12px] lg:text-[14px]"}`}>
        −51%
      </div>
    </div>
  );
}

function PriceDropText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[80px] lg:text-[120px]" : "text-[48px] lg:text-[64px]"}`}>
        −27<span className="opacity-80">%</span>
      </div>
      <div className={`font-medium opacity-85 ${isLarge ? "text-[15px] lg:text-[17px]" : "text-[12px] lg:text-[13px]"}`}>
        감정가 대비
      </div>
    </div>
  );
}

function BidCriteriaText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[80px] lg:text-[120px]" : "text-[48px] lg:text-[64px]"}`}>
        3
      </div>
      <div className={`font-bold ${isLarge ? "text-[18px] lg:text-[22px]" : "text-[13px] lg:text-[15px]"}`}>
        가지 기준
      </div>
    </div>
  );
}

function ProcessFlowText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[80px] lg:text-[120px]" : "text-[48px] lg:text-[64px]"}`}>
        4
      </div>
      <div className={`font-bold ${isLarge ? "text-[18px] lg:text-[22px]" : "text-[13px] lg:text-[15px]"}`}>
        단계
      </div>
    </div>
  );
}

function MarketTrendText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[60px] lg:text-[88px]" : "text-[36px] lg:text-[48px]"}`}>
        +4.2<span className="opacity-80">%p</span>
      </div>
      <div className={`font-medium opacity-85 ${isLarge ? "text-[15px] lg:text-[17px]" : "text-[12px] lg:text-[13px]"}`}>
        낙찰가율
      </div>
    </div>
  );
}

function AuctionTrophyText({ isLarge }: { isLarge: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`font-extrabold leading-none tracking-tight ${isLarge ? "text-[60px] lg:text-[88px]" : "text-[36px] lg:text-[48px]"}`}>
        1.32억
      </div>
      <div className={`inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 font-bold ${isLarge ? "text-[15px] lg:text-[18px]" : "text-[12px] lg:text-[14px]"}`}>
        ★ 낙찰 완료
      </div>
    </div>
  );
}

/* ─── 미세 시각 도식 6건 (배경 영역 / opacity 0.3) ─────────── */

function DotGridDecor() {
  const dots = [];
  for (let y = 16; y < 200; y += 24) {
    for (let x = 16; x < 320; x += 24) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="white" />);
    }
  }
  return <g>{dots}</g>;
}

function LineGraphDecor({ direction }: { direction: "up" | "down" }) {
  const points = direction === "down"
    ? "0,40 60,80 120,120 180,150 240,170 320,180"
    : "0,180 60,150 120,120 180,80 240,50 320,30";
  return (
    <g>
      <polyline
        points={points}
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function CheckListDecor() {
  return (
    <g fill="white">
      <circle cx="40" cy="60" r="4" />
      <circle cx="40" cy="100" r="4" />
      <circle cx="40" cy="140" r="4" />
      <rect x="60" y="56" width="120" height="2" rx="1" opacity="0.6" />
      <rect x="60" y="96" width="100" height="2" rx="1" opacity="0.6" />
      <rect x="60" y="136" width="140" height="2" rx="1" opacity="0.6" />
    </g>
  );
}

function FlowDotsDecor() {
  return (
    <g fill="white">
      {[40, 120, 200, 280].map((x) => (
        <circle key={x} cx={x} cy="100" r="4" />
      ))}
      {[80, 160, 240].map((x) => (
        <line key={x} x1={x} y1="100" x2={x + 40} y2="100" stroke="white" strokeWidth="1.5" opacity="0.5" />
      ))}
    </g>
  );
}

function SparkleDecor() {
  return (
    <g fill="white">
      <circle cx="60" cy="40" r="2" opacity="0.7" />
      <circle cx="240" cy="60" r="2.5" opacity="0.6" />
      <circle cx="280" cy="140" r="2" opacity="0.7" />
      <circle cx="40" cy="160" r="2.5" opacity="0.6" />
      <circle cx="160" cy="180" r="1.5" opacity="0.8" />
    </g>
  );
}
