import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import { Section01Overview } from "./sections/Section01Overview";
import { Section02BidHistory } from "./sections/Section02BidHistory";
import { Section03Rights } from "./sections/Section03Rights";
import { Section04Market } from "./sections/Section04Market";
import { Section05Investment } from "./sections/Section05Investment";
import { Section06SaleHistory } from "./sections/Section06SaleHistory";
import { Section07Opinion } from "./sections/Section07Opinion";

/**
 * next-mdx-remote components 오버라이드.
 * 본문 사진은 Hero 갤러리로 일원화 — 본문 inline img 노출 0건 (mdx Img → null).
 * 표는 horizontal lines only + tabular-nums(숫자 cell) + 행 색 분기(매각/미납/말소기준/인수).
 *
 * H2 dispatcher: "## NN 제목" → SectionXX, 번호 없는 H2 → 일반 헤더.
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

/**
 * 마크다운 본문의 H1은 페이지 H1과 중복되므로 렌더하지 않는다.
 */
function H1() {
  return null;
}

function H2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  const text = extractText(children);
  const match = /^(\d{2})\s+(.+)$/.exec(text.trim());
  if (match) {
    const [, num, title] = match;
    switch (num) {
      case "01":
        return <Section01Overview title={title} />;
      case "02":
        return <Section02BidHistory title={title} />;
      case "03":
        return <Section03Rights title={title} />;
      case "04":
        return <Section04Market title={title} />;
      case "05":
        return <Section05Investment title={title} />;
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
}

/**
 * H3 — "체크포인트" 또는 "시나리오 X" 패턴은 강조 스타일.
 * 카드 wrapping 은 remark plugin 없이 불가하므로 헤더 수준 시각 강화만 적용.
 */
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

/**
 * Table — horizontal lines only, tabular-nums on data cells, header surface-muted bg.
 * 세로선 0. 행 사이 가로선만.
 */
function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table
        className="w-full min-w-[32rem] border-collapse text-sm tabular-nums"
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

/**
 * Tr — 행 텍스트 키워드로 사실 신호 색 분기.
 *  - "말소기준" → brand-50 (기준점 강조)
 *  - "**인수**" 또는 "인수(" / "인수," → danger-soft (권리 인수)
 *  - "미납" → warning-soft (대금 미납)
 *  - "매각" + "**" (낙찰 강조) → success-soft
 *  - 그 외 → 기본
 *
 * thead·tfoot 의 행은 영향 안 받음 (배경 thead 별도 지정).
 */
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
  // "매각" + 굵은 강조 (**낙찰** / **매각**) — 매각 결과 행
  if (/\*\*\s*매각\s*\*\*|\*\*\s*낙찰\s*\*\*/.test(text)) {
    return "bg-[var(--color-success-soft)]";
  }
  return "";
}

function Tr({ children, ...rest }: ComponentPropsWithoutRef<"tr">) {
  // thead 내부 tr 은 부모 background 가 surface-muted 이므로 detectRowToneClass 효과 없음 — OK
  const text = extractText(children);
  const toneCls = detectRowToneClass(text);
  return (
    <tr className={toneCls} {...rest}>
      {children}
    </tr>
  );
}

function Th({ children, ...rest }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-[var(--color-border)] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink-500)]"
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({ children, ...rest }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-[var(--color-border)] px-4 py-3 align-top text-sm leading-6 text-[var(--color-ink-700)]"
      {...rest}
    >
      {children}
    </td>
  );
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
    <hr className="my-12 border-0 border-t border-[var(--color-border)]" {...props} />
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

/** next/image 기반 커버 이미지(로드 성공 가정). 포스트 상세 히어로에서 사용. */
export function AnalysisCoverImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
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

/**
 * 본문 인라인 이미지 차단 — 사진은 Hero 갤러리로 일원화.
 * post.md 의 ![](...) 노출 0건. data 는 frontmatter / meta.json 으로 보존.
 */
function Img() {
  return null;
}

export function buildAnalysisMdxComponents() {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    strong: Strong,
    em: Em,
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
  };
}
