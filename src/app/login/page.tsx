import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/auth/LoginButton";
import { createClient } from "@/lib/supabase/server";
import { BRAND_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "로그인",
  description: `${BRAND_NAME}에 로그인하고 입찰 대리를 신청하세요. 신청 내역과 진행 상태를 한 곳에서 확인할 수 있습니다.`,
};

type SearchParams = Promise<{ redirect?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { redirect: redirectParam, error } = await searchParams;

  // 이미 로그인된 사용자는 리다이렉트
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(redirectParam && redirectParam.startsWith("/") ? redirectParam : "/");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--color-surface-muted)] px-5 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
          <h1 className="text-h3 font-black tracking-tight text-[var(--color-ink-900)] sm:text-h2">
            로그인
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
            처음이신가요? 소셜 로그인 시 자동으로 가입됩니다.
          </p>

          {error && (
            <div
              className="mt-6 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
              role="alert"
            >
              로그인 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}

          <div className="mt-8">
            <LoginButton redirect={redirectParam} />
          </div>

          <p className="mt-8 text-xs leading-5 text-[var(--color-ink-500)]">
            로그인하면{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              이용약관
            </Link>{" "}
            및{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-[var(--color-ink-700)]"
            >
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주합니다.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink-500)]">
          {BRAND_NAME}은 공인중개사법에 따른 매수신청 대리 업무만 수행합니다.
        </p>
      </div>
    </main>
  );
}
