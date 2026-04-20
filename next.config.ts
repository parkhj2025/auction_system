import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Phase 6.7 — LAN IP로 dev 접속 시 Turbopack HMR/static chunks cross-origin 차단 해제.
  allowedDevOrigins: ["192.168.219.46"],
  // @mdx-js/mdx 등 ESM 전용 MDX 도구를 Next 서버 번들에서 외부화해
  // 개발 모드 워커에서 ESM/CJS 인터옵 크래시를 방지한다.
  // pdfkit/fontkit: Phase 6.5 회귀 수정 (2026-04-19) — 번들링 시 내장 .afm 파일
  // (Helvetica.afm 등) fs.readFileSync 경로 깨짐 (ENOENT C:\ROOT\node_modules\...) 차단.
  serverExternalPackages: [
    "@mdx-js/mdx",
    "next-mdx-remote",
    "remark-gfm",
    "remark-parse",
    "remark-rehype",
    "sharp",
    "pdfkit",
    "fontkit",
  ],
};

export default nextConfig;
