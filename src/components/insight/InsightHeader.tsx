/* /insight 헤더 (work-012 제로베이스 재구축).
 * 좌측 정렬 단독 + H1 + 보조 카피 paradigm. 잡지 paradigm 안 시각 임팩트 = 사이즈 + 여백 강조 정수. */
export function InsightHeader() {
  return (
    <header className="pt-16 pb-12 md:pt-20 md:pb-14 lg:pt-28 lg:pb-20">
      <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111418] md:text-[48px] lg:text-[64px]">
        경매 자료
      </h1>
      <p className="mt-5 text-[17px] leading-[1.55] text-gray-600 lg:mt-7 lg:text-[20px]">
        인천법원 경매 자료를 직접 정리하여 무료로 드립니다.
      </p>
    </header>
  );
}
