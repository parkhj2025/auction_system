import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import type { AnalysisFrontmatter, AnalysisMeta } from "@/types/content";
import { MdxTable, MdxThead, MdxTr } from "./MdxTableElements";
import { Section01Overview } from "./sections/Section01Overview";
import { Section02BidHistory } from "./sections/Section02BidHistory";
import { Section03Rights } from "./sections/Section03Rights";
import { Section04Market } from "./sections/Section04Market";
import { Section05Investment } from "./sections/Section05Investment";
import { Section06SaleHistory } from "./sections/Section06SaleHistory";
import { Section07Opinion } from "./sections/Section07Opinion";
import { TimelineSection } from "./TimelineSection";
import { RightsAnalysisSection } from "./RightsAnalysisSection";
import { MarketCompareCard } from "./MarketCompareCard";
import { InvestmentInteractive } from "./InvestmentInteractive";
import { SaleAreaSummary } from "./SaleAreaSummary";
import { CheckpointList as CheckpointListClient } from "./CheckpointList";
import { MdxP, MdxUl, MdxOl } from "./MdxBodyElements";
import { PropertyOverviewCard } from "./PropertyOverviewCard";
import { ScenarioComparisonHighlight } from "./ScenarioComparisonHighlight";

/**
 * next-mdx-remote components 오버라이드.
 *
 * 단계 3-1 G1 보강 (불변):
 *  - Img → null (본문 사진 차단, Hero/PhotoGalleryStrip 일원화)
 *  - del/s → passthrough (취소선 차단; remark-gfm singleTilde:false 와 함께)
 *  - Td 콘텐츠 기반 정렬: 금액·% → text-right tabular-nums nowrap
 *  - Tr 행 색 분기: 말소기준·인수·미납·매각 강조
 *  - SectionHeader badge 폐기 (sub-label chip 0)
 *  - H3 "체크포인트" 강조 / "시나리오 X" → ScenarioCard wrap (remark plugin)
 *
 * 단계 3-3 신규:
 *  - H2 dispatcher 가 meta · fm 인자 수신 후 SectionXX 직후 신규 컴포넌트 자연스러운 흐름 삽입
 *      02 → TimelineSection (meta.bidding)
 *      03 → RightsCallout (meta.rights)
 *      04 → MarketCompareCard (meta.market)
 *      05 → ScenarioCardsBoard (meta.investment)
 *  - meta 누락 시 신규 컴포넌트 0건 렌더 (mdx body fallback — 단계 3-1 baseline)
 */

function extractText(children: ReactNode): string {
  if (children == null || children === false || children === true) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children
  ) {
    const p = (children as { props?: { children?: ReactNode } }).props;
    return extractText(p?.children);
  }
  return "";
}

function H1() {
  return null;
}

function buildH2(
  meta: AnalysisMeta | null | undefined,
  fm: AnalysisFrontmatter
) {
  return function H2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
    const text = extractText(children);
    const match = /^(\d{2})\s+(.+)$/.exec(text.trim());
    if (match) {
      const [, num, title] = match;
      switch (num) {
        case "01":
          return <Section01Overview title={title} />;
        case "02":
          return (
            <>
              <Section02BidHistory title={title} />
              {meta?.bidding ? (
                <TimelineSection history={meta.bidding.history} />
              ) : null}
            </>
          );
        case "03":
          return (
            <>
              <Section03Rights title={title} />
              {meta?.rights ? <RightsAnalysisSection rights={meta.rights} /> : null}
            </>
          );
        case "04":
          return (
            <>
              <Section04Market title={title} />
              {meta?.market ? (
                <MarketCompareCard
                  market={meta.market}
                  appraisal={fm.appraisal}
                  minPrice={fm.minPrice}
                  round={fm.round}
                  percent={fm.percent}
                  bidding={meta.bidding}
                />
              ) : null}
            </>
          );
        case "05":
          return (
            <>
              <Section05Investment title={title} />
              {meta?.investment ? (
                <InvestmentInteractive
                  investment={meta.investment}
                  appraisal={fm.appraisal}
                  minPrice={fm.minPrice}
                />
              ) : null}
            </>
          );
        case "06":
          return (
            <>
              <Section06SaleHistory title={title} />
              {meta?.market ? (
                <SaleAreaSummary
                  market={meta.market}
                  appraisal={fm.appraisal}
                  minPrice={fm.minPrice}
                  percent={fm.percent}
                  saleRateRange={resolveSaleRateRange(fm.slug)}
                  bidCountRange={resolveBidCountRange(fm.slug)}
                />
              ) : null}
            </>
          );
        case "07":
          return <Section07Opinion title={title} />;
        default:
          return (
            <h2
              id={`section-${num}`}
              className="mt-16 flex scroll-mt-24 items-baseline gap-4 first:mt-0 sm:mt-24"
            >
              <span className="text-caption font-black uppercase tracking-[0.24em] text-[var(--color-ink-500)] tabular-nums">
                {num}
              </span>
              <span className="text-h2 font-black tracking-tight leading-[var(--lh-h2)] text-[var(--color-ink-900)]">
                {title}
              </span>
            </h2>
          );
      }
    }
    return (
      <h2
        className="mt-16 scroll-mt-24 text-h3 font-black tracking-tight text-[var(--color-ink-900)] first:mt-0 sm:text-h2"
        {...rest}
      >
        {children}
      </h2>
    );
  };
}

function H3({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
  const text = extractText(children).trim();
  if (text === "체크포인트" || text.startsWith("체크포인트")) {
    return (
      <h3
        className="mt-10 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)] py-2 pl-4 pr-5 text-lg font-black tracking-tight text-[var(--color-ink-900)] sm:text-xl"
        {...rest}
      >
        {children}
      </h3>
    );
  }
  return (
    <h3
      className="mt-10 text-lg font-black tracking-tight text-[var(--color-ink-900)] sm:text-xl"
      {...rest}
    >
      {children}
    </h3>
  );
}

// P — client 모듈 (MdxBodyElements.MdxP) 로 분리. 룰 13 mdx reveal 적용.

function Strong({ children, ...rest }: ComponentPropsWithoutRef<"strong">) {
  return (
    <strong
      className="font-black text-[var(--color-ink-900)]"
      {...rest}
    >
      {children}
    </strong>
  );
}

function Em({ children, ...rest }: ComponentPropsWithoutRef<"em">) {
  return (
    <em
      className="font-semibold italic text-[var(--color-ink-900)]"
      {...rest}
    >
      {children}
    </em>
  );
}

/** 취소선 차단 — del/s 모두 passthrough (효과 0, 텍스트만 노출) */
function PassThrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

// Ul·Ol — client 모듈 (MdxBodyElements.MdxUl/MdxOl) 로 분리. 룰 13 mdx reveal 적용.

function Li({ children, ...rest }: ComponentPropsWithoutRef<"li">) {
  return (
    <li className="pl-1" {...rest}>
      {children}
    </li>
  );
}

// Table·Thead·Tr 는 client API (motion·useInView·context) 활용 위해 MdxTableElements.tsx 로 분리.

/**
 * 룰 11 표 정렬 글로벌:
 *  - 텍스트 (제목·라벨) → left
 *  - 숫자 (가격·비율·건수·인수) → right (tabular-nums)
 *  - 결과·태그·뱃지·날짜·회차 → center
 *  - thead 정렬 = tbody 셀 정렬 동일
 *
 * 룰 14-B Typography:
 *  - thead = caption 600 ink-700 uppercase
 *  - tbody td 텍스트 = body-sm 400 ink-700
 *  - tbody td 숫자 = body-sm 500 ink-900 tabular-nums
 */
function Th({ children, ...rest }: ComponentPropsWithoutRef<"th">) {
  const text = extractText(children).trim();
  const cls = thHeaderClass(text);
  return (
    <th
      className={`border-b border-[var(--color-border)] px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-700)] md:px-4 md:py-3 md:text-[length:var(--text-caption)] ${cls}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function thHeaderClass(text: string): string {
  if (/^(채권금액|보증금|최저가|감정가|평균|매도가|매각가|낙찰가|취득세|법무사|예상|건수|입찰인수|매각가율|비율)/.test(text)) {
    return "md:text-right md:whitespace-nowrap";
  }
  if (/^(회차|매각기일|접수일|대항력|기간|결과|소멸\s*여부|구분)$/.test(text)) {
    return "md:text-center md:whitespace-nowrap";
  }
  return "md:text-left";
}

function Td({ children, ...rest }: ComponentPropsWithoutRef<"td">) {
  const text = extractText(children).trim();
  const align = detectTdAlign(text);
  const isNumber = align.kind === "number";
  // 룰 19 (단계 5-4-2-fix-6): table-cell default (card stack 폐기).
  // 룰 19-B: mobile px-2 py-2 (캡션) / desktop px-4 py-3 (body-sm) 폰트·패딩 축소.
  // cell wrap: whitespace-normal break-words 긴 텍스트 영역 (정렬 영역 외).
  return (
    <td
      className={`border-b border-[var(--color-border)] px-2 py-2 align-top text-[10px] leading-relaxed md:px-4 md:py-3 md:text-[length:var(--text-body-sm)] md:leading-6 ${
        isNumber
          ? "font-semibold tabular-nums text-[var(--color-ink-900)]"
          : "text-[var(--color-ink-700)] break-words"
      } ${align.cls}`}
      {...rest}
    >
      {children}
    </td>
  );
}

function detectTdAlign(text: string): { kind: "text" | "number" | "tag"; cls: string } {
  if (!text) return { kind: "text", cls: "" };
  // 회차 ("1차"·"2차") → center (desktop only)
  if (/^\d+차$/.test(text)) {
    return { kind: "tag", cls: "md:text-center md:whitespace-nowrap font-semibold" };
  }
  // 날짜 (yyyy-mm-dd) → center
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(text)) {
    return { kind: "tag", cls: "md:text-center md:whitespace-nowrap tabular-nums" };
  }
  // % 비율 → right (desktop only)
  if (/^[\d.,]+\s*%$/.test(text)) {
    return { kind: "number", cls: "md:text-right tabular-nums md:whitespace-nowrap" };
  }
  // 가격 (원·만원·억) → right (desktop only)
  if (
    /^[\d,.\s]+(원|만원?|억(?:\s*[\d,]+만(?:원)?)?)$/.test(text) ||
    /^\d+억(\s*[\d,]+만(?:원)?)?$/.test(text)
  ) {
    return { kind: "number", cls: "md:text-right tabular-nums md:whitespace-nowrap" };
  }
  // 건수·명·평·㎡·회 → right
  if (/^[\d.,]+\s*(건|명|평|㎡|회|개)$/.test(text)) {
    return { kind: "number", cls: "md:text-right tabular-nums md:whitespace-nowrap" };
  }
  // 결과·태그 → center
  if (
    /^(있음|없음|유찰|매각|소멸|인수|미상|진행|예정|변경|신청|미신청|—|낙찰|미납)$/.test(
      text
    )
  ) {
    return { kind: "tag", cls: "md:text-center md:whitespace-nowrap" };
  }
  return { kind: "text", cls: "" };
}

function Blockquote({
  children,
  ...rest
}: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="mt-6 border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/60 px-5 py-4 text-[length:var(--text-body)] leading-7 text-[var(--color-ink-700)]"
      {...rest}
    >
      {children}
    </blockquote>
  );
}

function Hr(props: ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      className="my-12 border-0 border-t border-[var(--color-border)]"
      {...props}
    />
  );
}

function A({ children, href = "#", ...rest }: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      href={href}
      className="text-[var(--color-ink-900)] underline decoration-[var(--color-ink-300)] underline-offset-2 transition hover:text-black hover:decoration-[var(--color-ink-900)]"
      {...rest}
    >
      {children}
    </a>
  );
}

export function AnalysisCoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 768px, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}

function Img() {
  return null;
}

/**
 * 단계 5-4-2-fix-3 룰 6: 사건별 매각가율·입찰인수 range hardcoded fallback.
 * raw-content schema 에 byPeriod 4 기간 부재 (Cowork v2.9 보강 영역).
 * 본 patch 단일 사건 본질 평가용 hardcoded — 4 사건 확장 시 schema 보강 후 props 전달.
 */
function resolveSaleRateRange(slug: string): { min: number; max: number } | undefined {
  if (slug === "2026타경500459") return { min: 56, max: 67 };
  return undefined;
}

function resolveBidCountRange(slug: string): { min: number; max: number } | undefined {
  if (slug === "2026타경500459") return { min: 2.71, max: 3.33 };
  return undefined;
}

/**
 * 단계 5-4-2-fix-3 룰 3 (Q2 (가)): ScenarioCard mdx override 비활성.
 * mdx 본문 4 시나리오 카드 영역 미렌더 — 단계 5-4-2-fix-9 ScenarioCarousel 폐기 후
 * ScenarioComparisonBox 한 축으로 일원화.
 * 기존 단계 5-2/4-1 ScenarioCard 디테일 (parseScenarioKey·SCENARIO_ICONS·SCENARIO_BASE_THEME·
 * DISABLED_THEME·detectScenarioDisabled·splitScenarioTitle) 일괄 폐기.
 */
function ScenarioCard() {
  return null;
}

function ConclusionCallout({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-6 rounded-r-[var(--radius-md)] border-l-4 border-[var(--color-ink-900)] bg-[var(--color-ink-50)] px-5 py-4 sm:px-8 sm:py-5">
      <span className="inline-flex items-center rounded-[var(--radius-xs)] bg-[var(--color-ink-900)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
        결론
      </span>
      <div className="mt-2 [&>p]:!mt-0 [&>p]:text-[var(--color-ink-900)] [&>p]:font-semibold">
        {children}
      </div>
    </div>
  );
}

// CheckpointList — client 모듈 (CheckpointList.tsx)로 분리. 단계 5-4-2-fix-2 Phase 4 단락 fade-in stagger.

/**
 * mdx components 빌더.
 * 단계 3-3: meta + fm 을 받아 H2 dispatcher 가 신규 컴포넌트 자연스러운 흐름 삽입.
 * 인자 누락 시 단계 3-1 baseline 동작 (meta=null → 신규 컴포넌트 0 렌더).
 */
export function buildAnalysisMdxComponents(
  meta?: AnalysisMeta | null,
  fm?: AnalysisFrontmatter
) {
  // fm 누락 시 fallback 더미 (component 호출 시 0 effect — meta 가 null 이므로 신규 컴포넌트 분기 미진입)
  const fmSafe: AnalysisFrontmatter = fm ?? ({
    type: "analysis",
    slug: "",
    title: "",
    region: "incheon",
    court: "",
    caseNumber: "",
    appraisal: 0,
    minPrice: 0,
    round: 0,
    percent: 0,
    bidDate: "",
    address: "",
    propertyType: "기타",
    auctionType: "임의경매",
    areaM2: 0,
    areaPyeong: 0,
    tags: [],
    publishedAt: "",
    updatedAt: "",
    status: "published",
  } as AnalysisFrontmatter);

  // PropertyOverviewCard — fm/meta closure 캡처 (mdx remark plugin 이 emit 하는 wrap 컴포넌트)
  function PropertyOverviewCardEnhanced({ children }: { children?: ReactNode }) {
    return (
      <PropertyOverviewCard fm={fmSafe} meta={meta ?? null}>
        {children}
      </PropertyOverviewCard>
    );
  }

  return {
    h1: H1,
    h2: buildH2(meta ?? null, fmSafe),
    h3: H3,
    p: MdxP,
    strong: Strong,
    em: Em,
    del: PassThrough,
    s: PassThrough,
    ul: MdxUl,
    ol: MdxOl,
    li: Li,
    table: MdxTable,
    thead: MdxThead,
    tr: MdxTr,
    th: Th,
    td: Td,
    blockquote: Blockquote,
    hr: Hr,
    a: A,
    img: Img,
    ScenarioCard,
    ConclusionCallout,
    CheckpointList: CheckpointListClient,
    PropertyOverviewCard: PropertyOverviewCardEnhanced,
    ScenarioComparisonHighlight,
  };
}
