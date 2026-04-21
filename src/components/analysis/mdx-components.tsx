import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Image from "next/image";
import { AnalysisMdxImage } from "./AnalysisMdxImage";

/**
 * next-mdx-remote components 오버라이드.
 * Cowork 산출물은 순수 마크다운(커스텀 MDX 태그 없음)이므로,
 * h2/h3/table/p/strong/ul/ol/li/a/img/blockquote만 경매퀵 톤으로 교체한다.
 *
 * h2 특수 처리:
 *   "## 01 물건 개요" 형태를 파싱하여 "01" 라벨 + "물건 개요" 제목으로 분리.
 *   번호 없는 h2("## 면책 고지")는 일반 제목 스타일로 렌더.
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
 * (Cowork 산출물은 상단에 자체 H1을 포함하지만, 상세 페이지의 DetailHero가 페이지 H1 역할)
 */
function H1() {
  return null;
}

function H2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  const text = extractText(children);
  const match = /^(\d{2})\s+(.+)$/.exec(text.trim());
  if (match) {
    const [, num, title] = match;
    return (
      <h2
        id={`section-${num}`}
        className="mt-20 flex scroll-mt-24 items-baseline gap-4 border-t border-[var(--color-border)] pt-10 first:mt-0 first:border-t-0 first:pt-0"
      >
        <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-600">
          {num}
        </span>
        <span className="text-2xl font-black tracking-tight text-[var(--color-ink-900)] sm:text-3xl">
          {title}
        </span>
      </h2>
    );
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

function H3({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
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

function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table
        className="w-full min-w-[32rem] border-separate border-spacing-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
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

function Tr({ children, ...rest }: ComponentPropsWithoutRef<"tr">) {
  return <tr {...rest}>{children}</tr>;
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
      className="border-b border-[var(--color-border)] px-4 py-3 align-top text-sm leading-6 text-[var(--color-ink-700)] tabular-nums"
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
 * MDX components 오버라이드를 생성.
 * v2: category 인자 폐기 (원칙 5 — 내부 분류 라벨 비노출).
 * 사용처: `<MDXRemote components={buildAnalysisMdxComponents()} />`
 */
export function buildAnalysisMdxComponents() {
  function Img({ src, alt }: ComponentPropsWithoutRef<"img">) {
    const safeSrc = typeof src === "string" ? src : undefined;
    return <AnalysisMdxImage src={safeSrc} alt={alt ?? ""} />;
  }

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
