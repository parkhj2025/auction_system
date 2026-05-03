/* Phase 1.2 (A-1-2) v16 — PricingTimeline (원 ↔ 줄 absolute positioning 정합).
 * 정정 (Plan v16):
 * 1. 가로 줄 = absolute top-1/2 + h-2px + linear-gradient green → yellow → orange
 * 2. 원 = absolute / left % positioning / w-4 h-4 / 3px border / white bg
 * 3. 원 ↔ 줄 정합 = absolute top-1/2 + -translate-y-1/2 (광역 정렬). */

const POINTS = [
  { label: "7일+ 전", position: 16, color: "#00C853" },
  { label: "7~2일 전", position: 50, color: "#FFB800" },
  { label: "2일 이내", position: 84, color: "#F97316" },
];

export function PricingTimeline() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* 가로 줄 — green → yellow → orange. */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
        style={{
          background:
            "linear-gradient(to right, #00C853 0%, #FFB800 50%, #F97316 100%)",
        }}
      />

      {/* 원 3건 — absolute / 줄 위 정합. */}
      <div className="relative h-12">
        {POINTS.map((point) => (
          <div
            key={point.label}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.position}%` }}
          >
            <div
              className="h-4 w-4 rounded-full border-[3px] bg-white"
              style={{ borderColor: point.color }}
            />
          </div>
        ))}
      </div>

      {/* 라벨 3건. */}
      <div className="relative mt-2 h-6">
        {POINTS.map((point) => (
          <div
            key={point.label}
            className="absolute -translate-x-1/2 text-[12px] font-semibold lg:text-[14px]"
            style={{ left: `${point.position}%`, color: point.color }}
          >
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
}
