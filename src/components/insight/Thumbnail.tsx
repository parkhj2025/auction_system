import Image from "next/image";
import { iconPath } from "@/lib/insightMock";

/* work-012 정정 3 — /insight 썸네일 placeholder (카테고리 Gemini PNG 풀컬러).
 * large = Hero Editor's Pick 카드 / 기본 = 콘텐츠 list 1-col 120×80. */
export function Thumbnail({
  category,
  large,
}: {
  category: string;
  large?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-ink-100)] " +
        (large
          ? "aspect-[16/10] w-full lg:aspect-[4/3]"
          : "h-[80px] w-[120px]")
      }
    >
      <Image
        src={iconPath(category)}
        alt=""
        width={large ? 360 : 120}
        height={large ? 360 : 120}
        className="h-[82%] w-auto object-contain"
      />
    </div>
  );
}
