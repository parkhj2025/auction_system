export type PropertyType =
  | "아파트"
  | "다세대주택"
  | "빌라"
  | "오피스텔"
  | "단독주택"
  | "토지"
  | "상가"
  | "공장"
  | "기타";
export type AuctionType = "강제경매" | "임의경매";
export type PostStatus = "draft" | "published" | "archived";

export interface MarketData {
  avgSalePrice?: number;
  avgLeasePrice?: number;
  saleCount?: number;
  leaseCount?: number;
  avgRentDeposit?: number;
  avgRentMonthly?: number;
  rentCount?: number;
  dataDate?: string;
  source?: string;
}

export interface AnalysisFrontmatter {
  type: "analysis";
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  region: string;
  court: string;
  /** 예: "경매9계" */
  courtDivision?: string;
  caseNumber: string;
  appraisal: number;
  minPrice: number;
  round: number;
  percent: number;
  bidDate: string;
  /** 예: "10:00" */
  bidTime?: string;
  address: string;
  sido?: string;
  sigungu?: string;
  dong?: string;
  buildingName?: string;
  ho?: string;
  propertyType: PropertyType;
  areaM2: number;
  areaPyeong: number;
  landAreaM2?: number;
  landAreaPyeong?: number;
  /** 발행자가 직접 포맷한 한글 금액. 비어 있으면 utils의 formatKoreanWon 사용 */
  appraisalDisplay?: string;
  minPriceDisplay?: string;
  auctionType: AuctionType;
  /** v2: 단순 문자열 배열. 분류 의미 부여 금지 (category·riskLevel 폐기와 동일 원칙). */
  tags: string[];
  seoTags?: string[];
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  status: PostStatus;
  marketData?: MarketData;
}

export interface GuideFrontmatter {
  type: "guide";
  slug: string;
  title: string;
  subtitle?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: PostStatus;
}

export interface NewsFrontmatter {
  type: "news";
  slug: string;
  title: string;
  subtitle?: string;
  region?: string;
  publishedAt: string;
  status: PostStatus;
}

export interface DataFrontmatter {
  type: "data";
  slug: string;
  title: string;
  subtitle?: string;
  region?: string;
  publishedAt: string;
  status: PostStatus;
}

export interface NoticeFrontmatter {
  type: "notice";
  slug: string;
  title: string;
  publishedAt: string;
  status: PostStatus;
}

export interface LoadedPost<T> {
  frontmatter: T;
  content: string;
}

export type AnalysisPost = LoadedPost<AnalysisFrontmatter>;
export type GuidePost = LoadedPost<GuideFrontmatter>;
export type NewsPost = LoadedPost<NewsFrontmatter>;
export type DataPost = LoadedPost<DataFrontmatter>;
export type NoticePost = LoadedPost<NoticeFrontmatter>;

/**
 * 단계 3-3 — content/analysis/{slug}.meta.json 어댑터 출력 스키마.
 *
 * publish CLI 가 raw-content/{caseNumber}/meta.json 을 평탄화하여 산출.
 * Cowork v2.6.2 schema (sections.bidding/rights/market/investment) +
 * legacy v2.5 schema (registry / market_data) 양쪽 모두 흡수.
 *
 * 모든 섹션 optional. 누락 시 컴포넌트는 mdx body fallback (단계 3-1 baseline).
 */
export interface AnalysisMetaHighlight {
  label: string;
  value: string;
}

export interface BiddingHistoryEntry {
  round: number | null;
  date: string;
  minimum: number | null;
  rate: number | null;
  result: string;
}

export interface RightsTenant {
  name: string;
  move_in_date: string;
  deposit: number | null;
  opposing_power: boolean | null;
  analysis: string;
}

export interface RightsMeta {
  basis_date: string;
  basis_type: string;
  basis_holder: string;
  total_claims: number | null;
  tenants: RightsTenant[];
}

export interface MarketMeta {
  sale_avg: number | null;
  sale_median: number | null;
  sale_count: number | null;
  lease_avg: number | null;
  lease_count: number | null;
  rent_count: number | null;
}

export interface ScenarioFields {
  label?: string;
  [key: string]: unknown;
}

export interface InvestmentMeta {
  real_acquisition_cost: number | null;
  scenario_a: ScenarioFields | null;
  scenario_b: ScenarioFields | null;
  scenario_c1: ScenarioFields | null;
  scenario_c2: ScenarioFields | null;
}

export interface AnalysisMeta {
  slug: string;
  highlights?: AnalysisMetaHighlight[];
  bidding?: { history: BiddingHistoryEntry[] };
  rights?: RightsMeta;
  market?: MarketMeta;
  investment?: InvestmentMeta;
  photos?: string[];
}
