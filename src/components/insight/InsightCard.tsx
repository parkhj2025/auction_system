import Link from "next/link";
import Image from "next/image";
import type { InsightCardData } from "@/lib/content";

/* /insight 카드 (work-012 제로베이스 재구축).
 * 분기 트리거 = coverImage 사실 (정의 = 미디어 카드 / undefined = 텍스트 카드).
 * 미디어 카드 = analysis 단독 (frontmatter.coverImage 사실). 텍스트 카드 = guide + news + data.
 * hover = 제목 단독 brand-green (미세 그린 포인트 paradigm / chip + 배경 + 미디어 변경 NG).
 * shadow 0건 (border 단독). */

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function Meta({ typeLabel, publishedAt }: { typeLabel: string; publishedAt: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-medium text-gray-700">
        {typeLabel}
      </span>
      <span className="text-[12px] font-medium text-gray-500">
        {formatDate(publishedAt)}
      </span>
    </div>
  );
}

export function InsightCard({ card }: { card: InsightCardData }) {
  const hasMedia = Boolean(card.coverImage);

  return (
    <Link
      href={card.href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/45 focus-visible:ring-offset-2"
    >
      {hasMedia ? (
        <>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={card.coverImage!}
              alt={card.title}
              fill
              sizes="(min-width: 1024px) 672px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4">
            <Meta typeLabel={card.typeLabel} publishedAt={card.publishedAt} />
            <h2 className="mt-3 line-clamp-2 text-[20px] font-bold leading-[1.35] tracking-[-0.01em] text-[#111418] transition-colors group-hover:text-[var(--brand-green)] lg:text-[24px]">
              {card.title}
            </h2>
            {card.subtitle && (
              <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-gray-600 lg:text-[15px]">
                {card.subtitle}
              </p>
            )}
          </div>
        </>
      ) : (
        <div>
          <Meta typeLabel={card.typeLabel} publishedAt={card.publishedAt} />
          <h2 className="mt-3 line-clamp-2 text-[24px] font-bold leading-[1.3] tracking-[-0.015em] text-[#111418] transition-colors group-hover:text-[var(--brand-green)] lg:text-[30px]">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-gray-600 lg:text-[16px]">
              {card.subtitle}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
