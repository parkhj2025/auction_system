import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // @mdx-js/mdx 등 ESM 전용 MDX 도구를 Next 서버 번들에서 외부화해
  // 개발 모드 워커에서 ESM/CJS 인터옵 크래시를 방지한다.
  serverExternalPackages: [
    "@mdx-js/mdx",
    "next-mdx-remote",
    "remark-gfm",
    "remark-parse",
    "remark-rehype",
  ],
};

export default nextConfig;
