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
export type NoticePost = LoadedPost<NoticeFrontmatter>;
