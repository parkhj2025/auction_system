import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import { Home, TrendingUp, Users, RefreshCw, Ban } from "lucide-react";
import type { AnalysisFrontmatter, AnalysisMeta } from "@/types/content";
import { Section01Overview } from "./sections/Section01Overview";
import { Section02BidHistory } from "./sections/Section02BidHistory";
import { Section03Rights } from "./sections/Section03Rights";
import { Section04Market } from "./sections/Section04Market";
import { Section05Investment } from "./sections/Section05Investment";
import { Section06SaleHistory } from "./sections/Section06SaleHistory";
import { Section07Opinion } from "./sections/Section07Opinion";
import { TimelineSection } from "./TimelineSection";
import { RightsCallout } from "./RightsCallout";
import { MarketCompareCard } from "./MarketCompareCard";
import { ScenarioCardsBoard } from "./ScenarioCardsBoard";
import { PropertyOverviewCard } from "./PropertyOverviewCard";

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
              {meta?.rights ? <RightsCallout rights={meta.rights} /> : null}
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
                />
              ) : null}
            </>
          );
        case "05":
          return (
            <>
              <Section05Investment title={title} />
              {meta?.investment ? (
                <ScenarioCardsBoard inv={meta.investment} />
              ) : null}
            </>
          );
        case "06":
          return <Section06SaleHistory title={title} />;
        case "07":
          return <Section07Opinion title={title} />;
        default:
          return (
            <h2
              id={`section-${num}`}
              className="mt-20 flex scroll-mt-24 items-baseline gap-4 border-t border-[var(--color-border)] pt-10 first:mt-0 first:border-t-0 first:pt-0"
            >
              <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-600 tabular-nums">
                {num}
              </span>
              <span className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
                {title}
              </span>
            </h2>
          );
      }
    }
    return (
      <h2
        className="mt-16 scroll-mt-24 text-2xl font-black tracking-tight text-[var(--color-ink-900)] first:mt-0 sm:text-3xl"
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
        className="mt-10 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-l-4 border-brand-600 bg-[var(--color-brand-50)] py-2 pl-4 pr-5 text-lg font-black tracking-tight text-[var(--color-brand-700)] sm:text-xl"
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

function P({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className="mt-5 text-base leading-[1.8] text-[var(--color-ink-700)]"
      {...rest}
    >
      {children}
    </p>
  );
}

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
      className="font-medium italic text-[var(--color-ink-900)]"
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

function Ul({ children, ...rest }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className="mt-5 flex list-disc flex-col gap-2 pl-6 text-base leading-[1.8] text-[var(--color-ink-700)] marker:text-brand-600"
      {...rest}
    >
      {children}
    </ul>
  );
}

function Ol({ children, ...rest }: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className="mt-5 flex list-decimal flex-col gap-2 pl-6 text-base leading-[1.8] text-[var(--color-ink-700)] marker:font-bold marker:text-brand-600"
      {...rest}
    >
      {children}
    </ol>
  );
}

function Li({ children, ...rest }: ComponentPropsWithoutRef<"li">) {
  return (
    <li className="pl-1" {...rest}>
      {children}
    </li>
  );
}

function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table
        className="w-full min-w-[36rem] border-collapse text-sm tabular-nums"
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

function Thead({ children, ...rest }: ComponentPropsWithoutRef<"thead">) {
  return (
    <thead className="bg-[var(--color-surface-muted)]" {...rest}>
      {children}
    </thead>
  );
}

function detectRowToneClass(text: string): string {
  if (/말소기준/.test(text)) {
    return "bg-[var(--color-brand-50)]";
  }
  if (/\*\*\s*인수\s*\*\*|\b인수\s*\(|\b인수\s*,/.test(text)) {
    return "bg-[var(--color-danger-soft)]";
  }
  if (/미납/.test(text)) {
    return "bg-[var(--color-warning-soft)]";
  }
  if (/\*\*\s*매각\s*\*\*|\*\*\s*낙찰\s*\*\*/.test(text)) {
    return "bg-[var(--color-success-soft)]";
  }
  return "";
}

function Tr({ children, ...rest }: ComponentPropsWithoutRef<"tr">) {
  const text = extractText(children);
  const toneCls = detectRowToneClass(text);
  return (
    <tr className={toneCls} {...rest}>
      {children}
    </tr>
  );
}

function Th({ children, ...rest }: ComponentPropsWithoutRef<"th">) {
  const text = extractText(children).trim();
  const cls = thHeaderClass(text);
  return (
    <th
      className={`border-b border-[var(--color-border)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)] ${cls}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function thHeaderClass(text: string): string {
  if (/^(채권금액|보증금|최저가|감정가|평균|매도가|매각가|낙찰가|취득세|법무사|예상)/.test(text)) {
    return "text-right whitespace-nowrap";
  }
  if (/^(회차|매각기일|비율|접수일|대항력|기간)$/.test(text)) {
    return "text-center whitespace-nowrap";
  }
  return "text-left";
}

function Td({ children, ...rest }: ComponentPropsWithoutRef<"td">) {
  const text = extractText(children).trim();
  const cls = tdContentClass(text);
  return (
    <td
      className={`border-b border-[var(--color-border)] px-4 py-3 align-top text-sm leading-6 text-[var(--color-ink-700)] ${cls}`}
      {...rest}
    >
      {children}
    </td>
  );
}

function tdContentClass(text: string): string {
  if (!text) return "";
  if (/^\d+차$/.test(text)) {
    return "text-center whitespace-nowrap font-medium";
  }
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(text)) {
    return "whitespace-nowrap";
  }
  if (/^[\d.,]+\s*%$/.test(text)) {
    return "text-right tabular-nums whitespace-nowrap";
  }
  if (
    /^[\d,.\s]+(원|만원?|억(?:\s*[\d,]+만(?:원)?)?)$/.test(text) ||
    /^\d+억(\s*[\d,]+만(?:원)?)?$/.test(text)
  ) {
    return "text-right tabular-nums whitespace-nowrap";
  }
  if (
    /^(있음|없음|유찰|매각|소멸|인수|미상|진행|예정|변경|신청|미신청|—)$/.test(
      text
    )
  ) {
    return "text-center whitespace-nowrap";
  }
  return "";
}

function Blockquote({
  children,
  ...rest
}: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote
      className="mt-6 border-l-4 border-brand-600 bg-brand-50/40 px-5 py-4 text-base leading-7 text-[var(--color-ink-700)]"
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
      className="text-brand-600 underline decoration-brand-300 underline-offset-2 transition hover:text-brand-700 hover:decoration-brand-600"
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

/* ─── remark-analysis-blocks 가 emit 하는 신규 컴포넌트 ─── */

/**
 * 단계 4-1: 시나리오 헤더에서 키 (A·B·C-1·C-2) 추출.
 *  지원 패턴:
 *   - "시나리오 A — 실거주 매입"
 *   - "시나리오 C-1 전세 갭투자" (정규화 후)
 *   - "시나리오 C-1 — 지분 임대 (단독 운용 불가)"
 */
function parseScenarioKey(title: string): string | null {
  const m = title.match(/^시나리오\s+([A-Z](?:-\d+)?)/);
  return m ? m[1] : null;
}

/** 단계 5-2 #1: 시나리오 카드 — 색상 의존 폐기 (CLAUDE.md §13 절대 규칙 준수).
 *  4 카드 모두 동일 무채색. 시나리오 구분은 아이콘 + 본문 헤더 텍스트.
 *  disabled 카드 (적용 불가) 만 별도 회색 + opacity 표현 유지. */
const SCENARIO_ICONS: Record<string, typeof Home> = {
  A: Home,
  B: TrendingUp,
  "C-1": Users,
  "C-2": RefreshCw,
};

const SCENARIO_BASE_THEME = {
  border: "border-l-[var(--color-brand-600)]",
  bg: "bg-[var(--color-surface)]",
  chip: "bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]",
  iconColor: "text-[var(--color-brand-600)]",
};

const DISABLED_THEME = {
  icon: Ban,
  border: "border-l-[var(--color-ink-300)]",
  bg: "bg-[var(--color-surface-muted)]",
  chip: "bg-[var(--color-ink-100)] text-[var(--color-ink-500)]",
  iconColor: "text-[var(--color-ink-500)]",
};

/** 시나리오 본문에 "단독 운용 불가" / "적용하지 않습니다" / "본 사건 적용 불가" 키워드 감지 */
function detectScenarioDisabled(title: string, children: ReactNode): boolean {
  const titleHit = /(단독\s*운용\s*불가|적용\s*불가)/.test(title ?? "");
  if (titleHit) return true;
  const txt = extractText(children);
  return /(단독\s*운용\s*불가|본\s*사건에서\s*적용하지\s*않습니다|적용하지\s*않습니다)/.test(
    txt
  );
}

function ScenarioCard({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  const [name, summary] = splitScenarioTitle(title ?? "");
  const key = parseScenarioKey(title ?? "") ?? "";
  const disabled = detectScenarioDisabled(title ?? "", children);
  // 단계 5-2 #1: disabled 카드만 별도 theme. 일반 카드는 무채색 base + 키별 아이콘.
  const Icon = disabled ? DISABLED_THEME.icon : SCENARIO_ICONS[key] ?? Home;
  const borderCls = disabled ? DISABLED_THEME.border : SCENARIO_BASE_THEME.border;
  const bgCls = disabled ? DISABLED_THEME.bg : SCENARIO_BASE_THEME.bg;
  const chipCls = disabled ? DISABLED_THEME.chip : SCENARIO_BASE_THEME.chip;
  const iconColorCls = disabled ? DISABLED_THEME.iconColor : SCENARIO_BASE_THEME.iconColor;

  return (
    <div
      className={`mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] border-l-4 ${borderCls} ${bgCls}`}
    >
      <div className="flex items-start gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/60 px-5 py-4 sm:px-6">
        <span
          className={`mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white ${iconColorCls}`}
          aria-hidden="true"
        >
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-black tracking-tight text-[var(--color-ink-900)] sm:text-lg">
            {name}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            {summary ? (
              <p className="text-sm text-[var(--color-ink-500)]">{summary}</p>
            ) : null}
            {disabled ? (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${chipCls}`}
              >
                본 사건 적용 불가
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={`px-5 py-4 sm:px-6 sm:py-5 [&>*:first-child]:mt-0 ${disabled ? "text-[var(--color-ink-500)]" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function splitScenarioTitle(title: string): [string, string] {
  // 단계 4-1 fix: em-dash(—)·en-dash(–) 만 separator. ASCII hyphen(-) 는 "C-1" 같은
  // 시나리오 키 구분자라 separator 로 매칭하면 잘못 split.
  const m = title.match(/^(.+?)\s*[—–]\s*(.+)$/);
  if (m) return [m[1].trim(), m[2].trim()];
  return [title.trim(), ""];
}

function ConclusionCallout({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-6 rounded-r-[var(--radius-md)] border-l-4 border-brand-600 bg-[var(--color-brand-50)] px-5 py-4 sm:px-6 sm:py-5">
      <span className="inline-flex items-center rounded-[var(--radius-xs)] bg-brand-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
        결론
      </span>
      <div className="mt-2 [&>p]:!mt-0 [&>p]:text-[var(--color-ink-900)] [&>p]:font-medium">
        {children}
      </div>
    </div>
  );
}

function CheckpointList({ children }: { children?: ReactNode }) {
  return <div className="checkpoint-list mt-5">{children}</div>;
}

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
    p: P,
    strong: Strong,
    em: Em,
    del: PassThrough,
    s: PassThrough,
    ul: Ul,
    ol: Ol,
    li: Li,
    table: Table,
    thead: Thead,
    tr: Tr,
    th: Th,
    td: Td,
    blockquote: Blockquote,
    hr: Hr,
    a: A,
    img: Img,
    ScenarioCard,
    ConclusionCallout,
    CheckpointList,
    PropertyOverviewCard: PropertyOverviewCardEnhanced,
  };
}
