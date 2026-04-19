"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  ApplyFormData,
  ApplyBidInfo,
  ApplyDocuments,
} from "@/types/apply";
import { INITIAL_APPLY_DATA } from "@/types/apply";
import type { AnalysisFrontmatter } from "@/types/content";
import { APPLY_STEPS, type ApplyStepId } from "@/lib/constants";
import { ApplyStepIndicator } from "./ApplyStepIndicator";
import { Step1Property } from "./steps/Step1Property";
import { Step2BidInfo } from "./steps/Step2BidInfo";
import { Step3Documents } from "./steps/Step3Documents";
import { Step4Confirm } from "./steps/Step4Confirm";
import { Step5Complete } from "./steps/Step5Complete";
import { StickyPropertyBar } from "./StickyPropertyBar";

const STEP_ORDER: ApplyStepId[] = APPLY_STEPS.map((s) => s.id);

export function ApplyClient({ posts }: { posts: AnalysisFrontmatter[] }) {
  const searchParams = useSearchParams();
  const initialCase = searchParams.get("case") ?? "";
  const initialCourt = searchParams.get("court") ?? "";

  const [data, setData] = useState<ApplyFormData>({
    ...INITIAL_APPLY_DATA,
    caseNumber: initialCase,
    ...(initialCourt ? { court: initialCourt } : {}),
  });
  const [currentStep, setCurrentStep] = useState<ApplyStepId>("property");
  const [completed, setCompleted] = useState<Set<ApplyStepId>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // URL ?case= 로 들어왔을 때 자동 매칭 (Phase 4-CONFIRM: bidDate 등 자동 복사 포함)
  useEffect(() => {
    if (initialCase && !data.matchedPost) {
      const match = posts.find((p) => p.caseNumber === initialCase);
      if (match) {
        setData((d) => ({
          ...d,
          matchedPost: match,
          caseNumber: match.caseNumber,
          court: match.court,
          bidDate: match.bidDate,
          propertyType: match.propertyType,
          propertyAddress: match.address,
          caseConfirmedByUser: false,
          caseConfirmedAt: null,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const merge = (patch: Partial<ApplyFormData>) =>
    setData((d) => ({ ...d, ...patch }));

  const mergeBidInfo = (patch: Partial<ApplyBidInfo>) =>
    setData((d) => ({ ...d, bidInfo: { ...d.bidInfo, ...patch } }));

  const mergeDocuments = (patch: Partial<ApplyDocuments>) =>
    setData((d) => ({ ...d, documents: { ...d.documents, ...patch } }));

  const setSignature = (signature: string | null) =>
    setData((d) => ({ ...d, signature }));

  const setAgreement = (
    key: "agreedDelegation" | "agreedPrivacy" | "agreedTerms",
    value: boolean,
  ) => setData((d) => ({ ...d, [key]: value }));

  const handleVerified = (
    result: import("@/lib/auth/phoneVerify").PhoneVerifyResult,
    verifiedName: string,
  ) =>
    setData((d) => ({
      ...d,
      verified: result.ok,
      verifiedName: result.ok ? verifiedName : null,
      verifiedAt: result.ok ? (result.mockedAt ?? null) : null,
    }));

  function goNext() {
    const i = STEP_ORDER.indexOf(currentStep);
    if (i < 0 || i >= STEP_ORDER.length - 1) return;
    const nextStep = STEP_ORDER[i + 1];
    // Phase 4-CONFIRM 회귀 수정: property → 이후 모든 step 전환 시 bidDate + caseConfirmedByUser 게이트 적용.
    // 기존(Phase 4-CONFIRM 1차)는 nextStep === "confirm"에서만 발동했으나,
    // Step1 → Step2 race condition으로 manualEntry 경로가 무방비 진입 가능 → 이중 방어.
    // Step1Property 강제 모달이 1차 방어선, 본 가드가 2차 방어선.
    if (
      currentStep === "property" &&
      (!data.bidDate || !data.caseConfirmedByUser)
    ) {
      setSubmitError(
        "Step1에서 매각기일 확인 + 사건 정보 동의를 완료해주세요.",
      );
      // 이미 property 단계이므로 setCurrentStep 호출 불필요 — 진입 차단만.
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    // Step4(confirm) 진입 직전 재확인 (3차 방어 — 이전 단계에서 reset된 경우 차단)
    if (nextStep === "confirm" && (!data.bidDate || !data.caseConfirmedByUser)) {
      setSubmitError(
        "Step1에서 매각기일 확인 + 사건 정보 동의 체크박스를 모두 완료해주세요.",
      );
      setCurrentStep("property");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    setSubmitError(null);
    setCompleted((prev) => new Set(prev).add(currentStep));
    setCurrentStep(nextStep);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    const i = STEP_ORDER.indexOf(currentStep);
    if (i <= 0) return;
    setCurrentStep(STEP_ORDER[i - 1]);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const form = new FormData();
      form.set("caseNumber", data.caseNumber);
      form.set("court", data.court);
      form.set("manualEntry", String(data.manualEntry));
      if (data.matchedPost) {
        form.set("matchedSlug", data.matchedPost.slug);
        form.set("matchedTitle", data.matchedPost.title);
      }
      // Phase 4-CONFIRM: 사건 정보 4종을 모든 경로에서 전송 (manualEntry 시 사용자 입력값 보장)
      form.set("bidDate", data.bidDate);
      form.set("propertyType", data.propertyType);
      form.set("propertyAddress", data.propertyAddress);
      if (data.caseConfirmedAt) {
        form.set("caseConfirmedAt", data.caseConfirmedAt);
      }
      form.set("bidAmount", data.bidInfo.bidAmount);
      form.set("applicantName", data.bidInfo.applicantName);
      form.set("phone", data.bidInfo.phone);
      form.set("ssnFront", data.bidInfo.ssnFront);
      form.set("jointBidding", String(data.bidInfo.jointBidding));
      if (data.bidInfo.jointBidding) {
        form.set("jointApplicantName", data.bidInfo.jointApplicantName);
        form.set("jointApplicantPhone", data.bidInfo.jointApplicantPhone);
      }
      form.set("isRebid", String(data.bidInfo.rebid));
      if (data.documents.eSignFile)
        form.set("eSignFile", data.documents.eSignFile);
      if (data.documents.idFile) form.set("idFile", data.documents.idFile);

      const res = await fetch("/api/apply", { method: "POST", body: form });
      const json = (await res.json()) as {
        ok: boolean;
        applicationId?: string;
        orderId?: string;
        error?: string;
      };
      if (res.status === 401) {
        throw new Error("로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.");
      }
      if (res.status === 409) {
        throw new Error(
          json.error ??
            "해당 물건은 이미 다른 고객의 접수가 진행 중입니다. 중복 접수는 불가합니다."
        );
      }
      if (!json.ok || !json.applicationId || !json.orderId) {
        throw new Error(json.error ?? "접수 처리 중 오류가 발생했습니다.");
      }

      // 위임장 PDF 생성 + Storage 업로드. ssnBack은 이 호출의 응답이 ok일 때만 클리어.
      // 네트워크/서버 오류로 업로드 실패 시 ssnBack을 보존하여 재시도 가능하게 한다.
      const pdfRes = await fetch(
        `/api/orders/${json.orderId}/generate-delegation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ssnBack: data.bidInfo.ssnBack,
            signatureDataUrl: data.signature,
          }),
        }
      );
      if (!pdfRes.ok) {
        const pdfErr = await pdfRes
          .json()
          .catch(() => ({ error: "위임장 PDF 생성 중 오류가 발생했습니다." }));
        throw new Error(
          pdfErr.error ?? "위임장 PDF 생성 중 오류가 발생했습니다.",
        );
      }
      // Storage 업로드 완료 → ssnBack을 메모리에서 즉시 클리어.
      mergeBidInfo({ ssnBack: "" });

      setApplicationId(json.applicationId);
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add("confirm");
        next.add("documents");
        next.add("bid-info");
        next.add("property");
        return next;
      });
      setCurrentStep("complete");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const stepView = useMemo(() => {
    switch (currentStep) {
      case "property":
        return (
          <Step1Property
            data={data}
            posts={posts}
            onChange={merge}
            onNext={goNext}
          />
        );
      case "bid-info":
        return (
          <Step2BidInfo
            data={data}
            onBidInfoChange={mergeBidInfo}
            onVerified={handleVerified}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case "documents":
        return (
          <Step3Documents
            data={data}
            onDocumentsChange={mergeDocuments}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case "confirm":
        return (
          <Step4Confirm
            data={data}
            onSignatureChange={setSignature}
            onAgreementChange={setAgreement}
            onSubmit={submit}
            onBack={goBack}
            submitting={submitting}
            submitError={submitError}
          />
        );
      case "complete":
        return applicationId ? (
          <Step5Complete data={data} applicationId={applicationId} />
        ) : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, data, submitting, submitError, applicationId, posts]);

  const showStickyBar = currentStep !== "property" && currentStep !== "complete";

  return (
    <>
      <ApplyStepIndicator current={currentStep} completed={completed} />
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {showStickyBar && (
          <StickyPropertyBar
            listing={data.matchedListing}
            caseNumber={data.caseNumber}
            manualEntry={data.manualEntry}
            court={data.court}
            bidDate={data.bidDate}
          />
        )}
        {stepView}
      </section>
    </>
  );
}
