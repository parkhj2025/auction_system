import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/my/ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 정보",
  description: "연락처 정보를 수정합니다.",
};

export default async function MyProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  const meta = user.user_metadata ?? {};
  const displayName =
    profile?.display_name ||
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    user.email ||
    "사용자";
  const email = profile?.email ?? user.email ?? null;
  const phone = profile?.phone ?? "";

  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-500)]"
      >
        <Link href="/my" className="hover:text-[var(--color-ink-900)]">
          마이페이지
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-[var(--color-ink-700)]">내 정보</span>
      </nav>

      <header className="mt-6">
        <p className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-900)]">
          Profile
        </p>
        <h1 className="mt-2 text-h2 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h1">
          내 정보
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
          접수 시 자동으로 채워지는 연락처 정보를 관리합니다. 알림 설정·서류
          관리 등의 고급 설정은 추후 지원 예정입니다.
        </p>
      </header>

      <div className="mt-10">
        <ProfileForm
          initialPhone={phone}
          email={email}
          displayName={displayName}
        />
      </div>
    </section>
  );
}
