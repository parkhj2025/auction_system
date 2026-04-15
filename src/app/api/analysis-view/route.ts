import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * 물건분석 열람 기록 + 소프트 게이팅 판정.
 *
 * 흐름:
 * 1. 사용자 세션 확인 (로그인 여부)
 * 2. 로그인 사용자: user_id로 INSERT, 항상 `gated: false` 반환 (무제한)
 * 3. 비로그인: fingerprint로 INSERT, 과거 distinct slug 수 집계,
 *    2건 이상이면 `gated: true` 반환
 *
 * 설계 원칙 (플랜 P2-5):
 * - 소프트 게이팅은 "부드러운 유도"이지 강제 차단이 아니다.
 * - fingerprint는 localStorage 기반이라 우회 가능 — 의도된 동작.
 * - IP 추적·디바이스 지문 같은 과도한 방어 로직 금지.
 * - SERVICE_ROLE_KEY 미설정 시 gated: false로 graceful fallback
 *   (사이트 전체 장애 방지).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { fingerprint?: string; slug?: string }
      | null;
    const fingerprint = body?.fingerprint?.trim() ?? "";
    const slug = body?.slug?.trim() ?? "";

    if (!slug) {
      return NextResponse.json(
        { gated: false, error: "invalid_input" },
        { status: 400 }
      );
    }

    // 사용자 세션 확인 (로그인이면 게이팅 자체를 건너뜀)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let admin;
    try {
      admin = createAdminClient();
    } catch (err) {
      // SERVICE_ROLE_KEY 미설정 → graceful fallback
      console.error("[analysis-view] admin client unavailable", err);
      return NextResponse.json({ gated: false, distinctCount: 0 });
    }

    if (user) {
      // 로그인 사용자: 기록만 남기고 게이팅 없음
      await admin.from("analysis_views").insert({
        user_id: user.id,
        fingerprint: null,
        slug,
      });
      return NextResponse.json({ gated: false, distinctCount: 0 });
    }

    if (!fingerprint) {
      return NextResponse.json(
        { gated: false, error: "missing_fingerprint" },
        { status: 400 }
      );
    }

    // 비로그인: 이번 열람 기록
    await admin.from("analysis_views").insert({
      user_id: null,
      fingerprint,
      slug,
    });

    // 이 fingerprint가 열람한 distinct slug 수 집계
    const { data: views, error: selectError } = await admin
      .from("analysis_views")
      .select("slug")
      .eq("fingerprint", fingerprint);

    if (selectError) {
      console.error("[analysis-view] select failed", selectError);
      return NextResponse.json({ gated: false, distinctCount: 0 });
    }

    const distinctSlugs = new Set((views ?? []).map((v) => v.slug));
    const distinctCount = distinctSlugs.size;
    const gated = distinctCount >= 2;

    return NextResponse.json({ gated, distinctCount });
  } catch (err) {
    console.error("[analysis-view]", err);
    // 에러 시에도 게이팅 해제 (사이트 정상 작동 우선)
    return NextResponse.json({ gated: false, distinctCount: 0 });
  }
}
