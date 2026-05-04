import Link from "next/link";

/* Phase 1.2 (A-1-2) v27 — Logo 컴포넌트 (SoT 정합).
 * 번개 SVG (A3 sharp + 좌상단 깃털 ㅁ + 노란 코어) + IBM Plex Sans KR Bold 700 텍스트.
 * variant: light (#111418 / 깃털 stroke #FFFFFF) / dark (#FFFFFF / 깃털 stroke #111418).
 * skewX(-8deg) + letter-spacing -0.02em + line-height 1 (SoT §3 / §9 정합). */

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const textColor = variant === "dark" ? "#FFFFFF" : "#111418";
  const featherStroke = variant === "dark" ? "#111418" : "#FFFFFF";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 lg:gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]/40 focus-visible:ring-offset-2"
      aria-label="경매퀵 홈"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 100 100"
        className="lg:w-6 lg:h-6 flex-shrink-0"
        aria-hidden="true"
      >
        <polygon
          points="6,26 32,15 40,28 18,38"
          fill="#00C853"
          stroke={featherStroke}
          strokeWidth="2"
          strokeLinejoin="miter"
        />
        <polygon
          points="65,5 20,52 40,55 25,97 80,38 55,40"
          fill="#00C853"
        />
        <polygon
          points="40,55 26,82 45,70 43,55"
          fill="#FFD43B"
        />
      </svg>
      <span
        className="text-[20px] lg:text-[22px] leading-none inline-block"
        style={{
          fontFamily: "'IBM Plex Sans KR', sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: textColor,
          transform: "skewX(-8deg)",
        }}
      >
        경매퀵
      </span>
    </Link>
  );
}
