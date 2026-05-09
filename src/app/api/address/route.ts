import { NextResponse } from "next/server";

/* Stage 2 cycle 1-A 보강 4 — 행안부 도로명주소 검색 API proxy.
 * 광역 정수: 승인키 server-side 단독 (process.env.JUSO_API_KEY) + 클라이언트 노출 0.
 * endpoint: business.juso.go.kr/addrlink/addrLinkApi.do
 * 응답: 도로명주소 + 지번 + 우편번호 + 시도/시군구/읍면동 광역. */

export const dynamic = "force-dynamic";

const JUSO_ENDPOINT = "https://business.juso.go.kr/addrlink/addrLinkApi.do";

interface JusoApiJuso {
  roadAddr: string;
  jibunAddr: string;
  zipNo: string;
  siNm: string;
  sggNm: string;
  emdNm: string;
  bdNm?: string;
}

interface JusoApiCommon {
  errorCode: string;
  errorMessage: string;
  totalCount: string;
  currentPage: string;
  countPerPage: string;
}

interface JusoApiResponse {
  results: {
    common: JusoApiCommon;
    juso: JusoApiJuso[] | null;
  };
}

export async function GET(req: Request) {
  const apiKey = process.env.JUSO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "주소 검색 서비스가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const keyword = (searchParams.get("keyword") ?? "").trim();
  const page = Number(searchParams.get("page") ?? "1");

  if (keyword.length < 2) {
    return NextResponse.json(
      { ok: false, error: "검색어를 두 글자 이상 입력해주세요." },
      { status: 400 },
    );
  }

  const url = new URL(JUSO_ENDPOINT);
  url.searchParams.set("confmKey", apiKey);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("currentPage", String(page));
  url.searchParams.set("countPerPage", "10");
  url.searchParams.set("resultType", "json");

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "주소 검색에 실패했습니다." },
        { status: 502 },
      );
    }
    const data = (await res.json()) as JusoApiResponse;
    const common = data.results.common;
    if (common.errorCode !== "0") {
      return NextResponse.json(
        { ok: false, error: common.errorMessage || "주소 검색에 실패했습니다." },
        { status: 400 },
      );
    }

    const items = (data.results.juso ?? []).map((j) => ({
      full: j.roadAddr,
      jibun: j.jibunAddr,
      zipCode: j.zipNo,
      sido: j.siNm,
      sigungu: j.sggNm,
      eupmyeondong: j.emdNm,
      buildingName: j.bdNm ?? "",
    }));

    return NextResponse.json({
      ok: true,
      items,
      totalCount: Number(common.totalCount),
      currentPage: Number(common.currentPage),
      countPerPage: Number(common.countPerPage),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "주소 검색 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
