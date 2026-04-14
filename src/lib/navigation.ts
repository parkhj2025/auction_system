export type NavLink = {
  href: string;
  label: string;
  /** 모바일 드로어에서 부가 설명 표시용 */
  description?: string;
};

/**
 * 상단 GNB — Segment A와 B 모두의 진입점이 한 줄에 있어야 한다.
 * 순서: 무료 물건분석 · 경매 인사이트 · 경매가이드 · 서비스 안내
 * 이용요금은 GNB가 아닌 홈 #pricing 앵커 또는 /service 하위에서 처리한다.
 */
export const PRIMARY_NAV: NavLink[] = [
  {
    href: "/analysis",
    label: "무료 물건분석",
    description: "경매 물건 7섹션 무료 분석",
  },
  {
    href: "/news",
    label: "경매 인사이트",
    description: "시황·동향·칼럼",
  },
  {
    href: "/guide",
    label: "경매가이드",
    description: "초보부터 실전까지",
  },
  {
    href: "/service",
    label: "서비스 안내",
    description: "진행 절차와 수수료",
  },
];

/** 푸터 열별 링크. 3열 구성에 맞춰 분할. */
export const FOOTER_SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "서비스",
    links: [
      { href: "/apply", label: "입찰 대리 신청" },
      { href: "/service", label: "진행 절차" },
      { href: "/#pricing", label: "수수료 안내" },
      { href: "/faq", label: "자주 묻는 질문" },
    ],
  },
  {
    title: "콘텐츠",
    links: [
      { href: "/analysis", label: "무료 물건분석" },
      { href: "/guide", label: "경매가이드" },
      { href: "/news", label: "경매 인사이트" },
      { href: "/notice", label: "공지사항" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/about", label: "대표 소개" },
      { href: "/contact", label: "문의하기" },
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/refund", label: "환불 정책" },
    ],
  },
];

/** 주 CTA. 어느 페이지에서도 2클릭 이내. */
export const PRIMARY_CTA = {
  href: "/apply",
  label: "입찰 대리 신청",
} as const;
