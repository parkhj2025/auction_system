/* work-012 정정 2 — /insight 카테고리 구조 정정 + mock 데이터.
 * 구조: 4 독립 카테고리 + 1 그룹("무료 물건분석") + 그룹 하위 8 종류.
 * 카테고리 아이콘 = Gemini PNG (public/illustrations/insight/{slug}.png).
 * 메인 URL 308 redirect 호환 = analysis / guide / glossary / data slug 보존. */

/* 독립 4 + 그룹 하위 8 = leaf 카테고리 (실제 콘텐츠가 속하는 단위). */
export type InsightLeafSlug =
  | "process"
  | "glossary"
  | "data"
  | "guide"
  | "apartment"
  | "officetel"
  | "villa"
  | "house"
  | "dagagu"
  | "dasedae"
  | "store"
  | "etc";

/* 그룹 카테고리 (콘텐츠가 직접 속하지 않음 / 하위 8 종류를 묶음). */
export type InsightGroupSlug = "analysis";

export type InsightCatSlug = InsightLeafSlug | InsightGroupSlug;

/* nav 선택 상태 = 전체 / 그룹 / leaf. */
export type NavSelection = "all" | InsightCatSlug;

/* "무료 물건분석" 그룹 하위 8 종류. */
export const ANALYSIS_SUB: { slug: InsightLeafSlug; label: string }[] = [
  { slug: "apartment", label: "아파트" },
  { slug: "officetel", label: "오피스텔" },
  { slug: "villa", label: "빌라" },
  { slug: "house", label: "단독주택" },
  { slug: "dagagu", label: "다가구" },
  { slug: "dasedae", label: "다세대" },
  { slug: "store", label: "상가" },
  { slug: "etc", label: "기타" },
];

const ANALYSIS_SUB_SLUGS = new Set<string>(ANALYSIS_SUB.map((s) => s.slug));

export function isAnalysisSub(slug: string): boolean {
  return ANALYSIS_SUB_SLUGS.has(slug);
}

/* 카테고리 nav = 그룹 1건 + 독립 4건. 노출 순서 = nav 배치 순서. */
export type InsightNavItem =
  | {
      kind: "group";
      slug: InsightGroupSlug;
      label: string;
      children: { slug: InsightLeafSlug; label: string }[];
    }
  | { kind: "leaf"; slug: InsightLeafSlug; label: string };

export const INSIGHT_NAV: InsightNavItem[] = [
  {
    kind: "group",
    slug: "analysis",
    label: "무료 물건분석",
    children: ANALYSIS_SUB,
  },
  { kind: "leaf", slug: "process", label: "경매 과정" },
  { kind: "leaf", slug: "glossary", label: "용어 정리" },
  { kind: "leaf", slug: "data", label: "빅데이터" },
  { kind: "leaf", slug: "guide", label: "경매 시작 가이드" },
];

const LABELS: Record<string, string> = {
  analysis: "무료 물건분석",
  process: "경매 과정",
  glossary: "용어 정리",
  data: "빅데이터",
  guide: "경매 시작 가이드",
  apartment: "아파트",
  officetel: "오피스텔",
  villa: "빌라",
  house: "단독주택",
  dagagu: "다가구",
  dasedae: "다세대",
  store: "상가",
  etc: "기타",
};

export function categoryLabel(slug: string): string {
  return LABELS[slug] ?? "인사이트";
}

/* 모든 유효 카테고리 slug (?cat= 검증용). */
export const ALL_CAT_SLUGS = new Set<string>([
  "analysis",
  ...INSIGHT_NAV.filter((n) => n.kind === "leaf").map((n) => n.slug),
  ...ANALYSIS_SUB.map((s) => s.slug),
]);

/* Gemini PNG 일러스트 경로 (정정 영역 2). */
export function iconPath(slug: string): string {
  return `/illustrations/insight/${slug}.png`;
}

export type InsightMockPost = {
  id: string;
  category: InsightLeafSlug;
  title: string;
  preview: string;
  publishedAt: string; // YYYY-MM-DD
  featured?: boolean;
};

/* mock 데이터 = 4 독립 카테고리 + "무료 물건분석" 하위 8 종류 분포.
 * 페르소나 = 경매 관심 + 용어 헷갈림. 어휘 강조 = "헷갈리는" + "정확하게" + "정리".
 * 비전문 지칭 어휘 사용 0. featured:true 단독 = villa-01 (Editor's Pick). */
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
    publishedAt: "2026-05-11",
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

  // ── 무료 물건분석 / 아파트 (apartment) ──
  {
    id: "apartment-01",
    category: "apartment",
    title: "아파트 경매, 무엇을 먼저 확인해야 하나",
    preview: "실거주와 투자의 체크포인트",
    publishedAt: "2026-05-12",
  },
  {
    id: "apartment-02",
    category: "apartment",
    title: "전용면적과 공급면적, 헷갈리는 두 면적을 정리",
    preview: "분양 면적과 무엇이 다른가",
    publishedAt: "2026-05-01",
  },

  // ── 무료 물건분석 / 오피스텔 (officetel) ──
  {
    id: "officetel-01",
    category: "officetel",
    title: "오피스텔 경매에서 자주 놓치는 것들",
    preview: "주거용과 업무용의 차이부터",
    publishedAt: "2026-05-08",
  },
  {
    id: "officetel-02",
    category: "officetel",
    title: "오피스텔 경매, 관리비 체납액부터 확인합니다",
    preview: "낙찰 후 떠안는 비용을 정확하게",
    publishedAt: "2026-04-27",
  },

  // ── 무료 물건분석 / 빌라 (villa) ──
  {
    id: "villa-01",
    category: "villa",
    title: "유찰 세 번 빌라, 가격이 싼 데는 이유가 있습니다",
    preview: "권리·시세·수익률을 숫자로 정리",
    publishedAt: "2026-05-13",
    featured: true,
  },
  {
    id: "villa-02",
    category: "villa",
    title: "빌라 경매, 시세 파악이 가장 어렵습니다",
    preview: "거래가 드문 물건의 시세 잡는 법",
    publishedAt: "2026-04-29",
  },

  // ── 무료 물건분석 / 단독주택 (house) ──
  {
    id: "house-01",
    category: "house",
    title: "단독주택 경매, 토지와 건물을 따로 봅니다",
    preview: "감정가 구성부터 정리",
    publishedAt: "2026-05-05",
  },
  {
    id: "house-02",
    category: "house",
    title: "단독주택 경매에서 확인할 경계와 도로",
    preview: "맹지 여부가 가격을 가른다",
    publishedAt: "2026-04-22",
  },

  // ── 무료 물건분석 / 다가구 (dagagu) ──
  {
    id: "dagagu-01",
    category: "dagagu",
    title: "다가구주택 경매, 임차인이 여럿이면 무엇을 보나",
    preview: "전입세대 열람의 중요성",
    publishedAt: "2026-05-02",
  },

  // ── 무료 물건분석 / 다세대 (dasedae) ──
  {
    id: "dasedae-01",
    category: "dasedae",
    title: "다세대주택, 다가구와 권리관계가 어떻게 다른가",
    preview: "혼동하기 쉬운 두 유형을 정리",
    publishedAt: "2026-04-24",
  },

  // ── 무료 물건분석 / 상가 (store) ──
  {
    id: "store-01",
    category: "store",
    title: "상가 경매, 임대차 관계부터 확인합니다",
    preview: "상가건물임대차보호법의 핵심",
    publishedAt: "2026-05-09",
  },
  {
    id: "store-02",
    category: "store",
    title: "상가 경매에서 권리금은 어떻게 되나",
    preview: "낙찰자와 권리금의 관계를 정확하게",
    publishedAt: "2026-04-20",
  },

  // ── 무료 물건분석 / 기타 (etc) ──
  {
    id: "etc-01",
    category: "etc",
    title: "토지·공장·지분 경매, 일반 물건과 다른 점",
    preview: "기타 물건의 분석 포인트",
    publishedAt: "2026-04-18",
  },
];

/* 정렬 = 최신순 default (정정 영역 5). */
export function sortedPosts(posts: InsightMockPost[]): InsightMockPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/* 날짜 표기 = YYYY.MM.DD. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/* Editor's Pick (정정 3 영역 1): featured:true 단독 → fallback = 최신.
 * Hero 안 대표 article 카드로 직접 노출. 사전 정정 2 villa-01 채택 보존. */
export function getEditorsPick(): InsightMockPost {
  return (
    INSIGHT_MOCK_POSTS.find((p) => p.featured) ??
    sortedPosts(INSIGHT_MOCK_POSTS)[0]
  );
}

/* 콘텐츠 list 페이지네이션 (정정 3 영역 4): 10건 / 페이지. */
export const INSIGHT_PAGE_SIZE = 10;
