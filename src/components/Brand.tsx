import { BRAND_NAME } from "@/lib/constants";

/* Phase 1.2 (A-1-2) v4 — Brand 컴포넌트 (시안 정합 본질).
 * 번개 SVG mark (green gradient #00C853 → #00A040 + 노랑 motion trail 3 line #FFD400) +
 * wordmark "경매퀵" Pretendard 800 italic.
 * size variant: sm (TopNav 24x21) / md (Footer 28x24) / lg (Hero 44x38) / xl (Brand block 56x48).
 * mode variant: light (Charcoal wordmark / 흰 배경) / dark (흰 wordmark / 다크 배경 / Q1 결정) / mono (Charcoal mark + Charcoal wordmark / 강조 0). */

type BrandSize = "sm" | "md" | "lg" | "xl";
type BrandMode = "light" | "dark" | "mono";

const SIZE_MAP: Record<
  BrandSize,
  { mark: number; gap: string; text: string }
> = {
  sm: { mark: 28, gap: "gap-2", text: "text-[19px] lg:text-[20px]" },
  md: { mark: 32, gap: "gap-2.5", text: "text-[22px] lg:text-[24px]" },
  lg: { mark: 44, gap: "gap-3", text: "text-[36px] lg:text-[44px]" },
  xl: { mark: 56, gap: "gap-3", text: "text-[48px] lg:text-[64px]" },
};

const TEXT_COLOR: Record<BrandMode, string> = {
  light: "text-[var(--text-primary)]",
  dark: "text-white",
  mono: "text-[var(--text-primary)]",
};

export function Brand({
  size = "sm",
  mode = "light",
  className,
  showWordmark = true,
}: {
  size?: BrandSize;
  mode?: BrandMode;
  className?: string;
  showWordmark?: boolean;
}) {
  const { mark, gap, text } = SIZE_MAP[size];
  const isMono = mode === "mono";

  return (
    <span
      className={[
        "inline-flex items-center",
        gap,
        className ?? "",
      ].join(" ")}
      aria-label={BRAND_NAME}
    >
      <BoltMark size={mark} mono={isMono} />
      {showWordmark && (
        <span
          className={[
            "font-extrabold italic tracking-[-0.03em]",
            text,
            TEXT_COLOR[mode],
          ].join(" ")}
          style={{ fontWeight: 800, fontStyle: "italic" }}
        >
          {BRAND_NAME}
        </span>
      )}
    </span>
  );
}

/* 번개 SVG mark — green gradient + 노랑 trail 3 line.
 * mode "mono" 시 mark = Charcoal 단색 (강조 0 영역). */
function BoltMark({ size, mono }: { size: number; mono: boolean }) {
  const gradId = `bolt-grad-${size}`;
  const ratio = 32 / 28;
  return (
    <svg
      viewBox="0 0 36 32"
      width={size * ratio}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? "#111418" : "#00E66B"} />
          <stop offset="100%" stopColor={mono ? "#111418" : "#00A040"} />
        </linearGradient>
      </defs>

      {/* 노랑 motion trail (우측 후방 3 line) — mono 시 본질 0. */}
      {!mono && (
        <g>
          <path
            d="M24 8 L34 8"
            stroke="#FFD400"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M24 16 L36 16"
            stroke="#FFD400"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M24 24 L32 24"
            stroke="#FFD400"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      )}

      {/* 번개 본질 (메인 면) — Z-shape lightning bolt. */}
      <path
        d="M18 0 L4 18 L12 18 L9 32 L24 12 L15 12 Z"
        fill={`url(#${gradId})`}
      />
      {/* 번개 본질 (두 번째 면 — 입체 본질, 약간 어두운 shade). */}
      {!mono && (
        <path
          d="M18 0 L12 18 L4 18 Z"
          fill="#00A040"
          opacity="0.35"
        />
      )}
    </svg>
  );
}
