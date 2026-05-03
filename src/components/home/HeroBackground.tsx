/* Phase 1.2 (A-1-2) v6 — HeroBackground.
 * charcoal dark + animated mesh gradient (CSS conic + radial + 미세 motion).
 * Hero typography-driven paradigm 본질 (일러스트 광역 폐기).
 * Code 자유 #1·#2 — CSS-only / no Three.js / no Canvas (성능 + 접근성). */

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="hero-mesh-bg pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* mesh orbs — 미세 motion (3개 / blur 80 / opacity 0.45). */}
      <div
        className="hero-mesh-orb"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          top: "-15%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(0,200,83,0.85) 0%, rgba(0,200,83,0) 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="hero-mesh-orb"
        style={{
          width: "55vw",
          height: "55vw",
          maxWidth: "720px",
          maxHeight: "720px",
          bottom: "-20%",
          right: "-15%",
          background:
            "radial-gradient(circle, rgba(0,150,64,0.7) 0%, rgba(0,150,64,0) 70%)",
          animationDelay: "-7s",
          animationDirection: "reverse",
        }}
      />
      <div
        className="hero-mesh-orb"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "520px",
          maxHeight: "520px",
          top: "30%",
          right: "20%",
          background:
            "radial-gradient(circle, rgba(255,212,0,0.35) 0%, rgba(255,212,0,0) 70%)",
          animationDelay: "-14s",
          opacity: 0.25,
        }}
      />
      {/* 미세 noise overlay (texture / charcoal 균질화). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
