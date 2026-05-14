/* work-012 — /insight 풀 신규 재제작 mock 데이터.
 * Phase 1 = 콘텐츠 부재 = mock 단독. 콘텐츠 산출 사후 동일 규칙 직접 노출.
 * 카테고리 slug = 메인 URL 308 redirect 호환 (analysis / guide / glossary / data 보존). */

export type InsightCategorySlug =
  | "process"
  | "glossary"
  | "usage"
  | "analysis"
  | "data"
  | "guide";

export type InsightCategory = {
  slug: InsightCategorySlug;
  label: string;
};

/* 6 카테고리 (정정 영역 2). 노출 순서 = nav 배치 순서. */
export const INSIGHT_CATEGORIES: InsightCategory[] = [
  { slug: "process", label: "경매 과정" },
  { slug: "glossary", label: "용어 정리" },
  { slug: "usage", label: "용도별 물건" },
  { slug: "analysis", label: "물건 분석" },
  { slug: "data", label: "빅데이터" },
  { slug: "guide", label: "경매 시작 가이드" },
];

export function categoryLabel(slug: string): string {
  return INSIGHT_CATEGORIES.find((c) => c.slug === slug)?.label ?? "인사이트";
}

export type InsightMockPost = {
  id: string;
  category: InsightCategorySlug;
  title: string;
  preview: string;
  publishedAt: string; // YYYY-MM-DD
  featured?: boolean;
};

/* mock 데이터 = 6 카테고리 × 3~5건. 페르소나 = 경매 관심 + 용어 헷갈림.
 * 어휘 강조 = "헷갈리는" + "정확하게" + "정리". 비전문 지칭 어휘 사용 0. */
export const INSIGHT_MOCK_POSTS: InsightMockPost[] = [
  // ── 경매 과정 (process) ──
  {
    id: "process-01",
    category: "process",
    title: "경매 한 건이 끝나기까지, 전체 흐름을 정리했습니다",
    preview: "권리분석부터 명도까지 여섯 단계로",
    publishedAt: "2026-05-12",
  },
  {
    id: "process-02",
    category: "process",
    title: "입찰 당일 법원에서 벌어지는 일, 순서대로",
    preview: "도착부터 개찰, 결과 발표까지",
    publishedAt: "2026-05-06",
  },
  {
    id: "process-03",
    category: "process",
    title: "낙찰 후 잔금 납부, 언제까지 무엇을 해야 하나",
    preview: "기한과 절차를 날짜순으로 정리",
    publishedAt: "2026-04-28",
  },
  {
    id: "process-04",
    category: "process",
    title: "명도, 어디서부터 시작해야 할까요",
    preview: "인도명령과 협의의 차이를 정확하게",
    publishedAt: "2026-04-21",
  },

  // ── 용어 정리 (glossary) ──
  {
    id: "glossary-01",
    category: "glossary",
    title: "감정가와 최저가, 무엇이 다른가요",
    preview: "헷갈리는 두 금액을 정확하게",
    publishedAt: "2026-05-13",
  },
  {
    id: "glossary-02",
    category: "glossary",
    title: "대항력과 우선변제권, 한 번에 정리했습니다",
    preview: "임차인 권리의 핵심 두 가지",
    publishedAt: "2026-05-09",
  },
  {
    id: "glossary-03",
    category: "glossary",
    title: "말소기준권리, 이 한 줄로 정리됩니다",
    preview: "인수와 소멸을 가르는 기준",
    publishedAt: "2026-05-04",
  },
  {
    id: "glossary-04",
    category: "glossary",
    title: "유찰과 취하, 비슷해 보이지만 다릅니다",
    preview: "사건이 멈추는 두 가지 경우",
    publishedAt: "2026-04-26",
  },
  {
    id: "glossary-05",
    category: "glossary",
    title: "보증금과 입찰보증금, 같은 말이 아닙니다",
    preview: "혼동하기 쉬운 두 보증금을 구분",
    publishedAt: "2026-04-19",
  },

  // ── 용도별 물건 (usage) ──
  {
    id: "usage-01",
    category: "usage",
    title: "아파트 경매, 무엇을 먼저 확인해야 하나",
    preview: "실거주와 투자의 체크포인트",
    publishedAt: "2026-05-11",
  },
  {
    id: "usage-02",
    category: "usage",
    title: "오피스텔 경매에서 자주 놓치는 것들",
    preview: "주거용과 업무용의 차이부터",
    publishedAt: "2026-05-05",
  },
  {
    id: "usage-03",
    category: "usage",
    title: "다세대와 다가구, 이름은 비슷하지만 권리는 다릅니다",
    preview: "혼동하기 쉬운 두 유형을 정리",
    publishedAt: "2026-04-29",
  },
  {
    id: "usage-04",
    category: "usage",
    title: "상가 경매, 임대차 관계부터 확인합니다",
    preview: "상가건물임대차보호법의 핵심",
    publishedAt: "2026-04-22",
  },

  // ── 물건 분석 (analysis) ──
  {
    id: "analysis-01",
    category: "analysis",
    title: "유찰 세 번 빌라, 가격이 싼 데는 이유가 있습니다",
    preview: "권리·시세·수익률을 숫자로 정리",
    publishedAt: "2026-05-13",
    featured: true,
  },
  {
    id: "analysis-02",
    category: "analysis",
    title: "감정가의 49%까지 떨어진 물건, 함정은 어디에",
    preview: "최저가만 보면 놓치는 것",
    publishedAt: "2026-05-08",
  },
  {
    id: "analysis-03",
    category: "analysis",
    title: "임차보증금 인수 물건, 실제 비용은 얼마인가",
    preview: "표시 가격과 실질 비용의 차이",
    publishedAt: "2026-05-02",
  },
  {
    id: "analysis-04",
    category: "analysis",
    title: "권리관계가 깨끗한 물건도 따져봐야 할 것",
    preview: "안전해 보여도 확인할 항목",
    publishedAt: "2026-04-24",
  },

  // ── 빅데이터 (data) ──
  {
    id: "data-01",
    category: "data",
    title: "인천 낙찰가율, 최근 흐름을 정리했습니다",
    preview: "지역별·유형별 데이터로",
    publishedAt: "2026-05-10",
  },
  {
    id: "data-02",
    category: "data",
    title: "응찰자 수로 보는 경쟁 강도",
    preview: "어떤 물건에 사람이 몰리나",
    publishedAt: "2026-05-03",
  },
  {
    id: "data-03",
    category: "data",
    title: "유찰이 반복되는 물건의 공통점",
    preview: "데이터가 보여주는 패턴",
    publishedAt: "2026-04-25",
  },

  // ── 경매 시작 가이드 (guide) ──
  {
    id: "guide-01",
    category: "guide",
    title: "경매, 어디서부터 시작해야 할지 정리했습니다",
    preview: "처음 한 건의 전체 흐름",
    publishedAt: "2026-05-12",
  },
  {
    id: "guide-02",
    category: "guide",
    title: "권리분석이 어렵게 느껴진다면",
    preview: "꼭 봐야 할 세 가지부터",
    publishedAt: "2026-05-07",
  },
  {
    id: "guide-03",
    category: "guide",
    title: "입찰표 작성, 실수하기 쉬운 칸들",
    preview: "현장에서 자주 틀리는 부분을 정리",
    publishedAt: "2026-04-30",
  },
  {
    id: "guide-04",
    category: "guide",
    title: "법원에 가지 않고 입찰하는 방법",
    preview: "대리입찰의 절차와 비용",
    publishedAt: "2026-04-23",
  },
];

/* 정렬 = 최신순 default (정정 영역 5). */
export function sortedPosts(posts: InsightMockPost[]): InsightMockPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/* Editor's Pick (정정 영역 4): featured:true 단독 → fallback = 최신 article. */
export function getEditorsPick(): InsightMockPost {
  const featured = INSIGHT_MOCK_POSTS.find((p) => p.featured);
  if (featured) return featured;
  return sortedPosts(INSIGHT_MOCK_POSTS)[0];
}

/* Hero 자동 슬라이드 (정정 영역 1). sub 카피 0. CTA 진입 대상 정확. */
export type InsightSlideCta = "scroll-list" | "featured" | "cat-glossary";

export type InsightSlide = {
  id: number;
  copy: string;
  ctaLabel: string;
  cta: InsightSlideCta;
  theme: "charcoal" | "green" | "surface";
};

export const INSIGHT_SLIDES: InsightSlide[] = [
  {
    id: 1,
    copy: "필요한 분석 자료, 모두 무료입니다.",
    ctaLabel: "분석 자료 둘러보기",
    cta: "scroll-list",
    theme: "charcoal",
  },
  {
    id: 2,
    copy: "지금 봐야 할 분석 자료.",
    ctaLabel: "지금 보러 가기",
    cta: "featured",
    theme: "green",
  },
  {
    id: 3,
    copy: "헷갈리는 경매 용어, 정확하게 정리했습니다.",
    ctaLabel: "용어 정리 보기",
    cta: "cat-glossary",
    theme: "surface",
  },
];
