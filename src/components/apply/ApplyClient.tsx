"use client";

// cycle 1-D-A-4: matchedPost 폐기 (Cowork 콘텐츠 source / 대법원 fetch 단독).
// cycle 1-D-A-4-2: handleVerified + onVerified prop + manualEntry + console.log 광역 영구 폐기.
// cycle 1-D-A-4-2 paradigm 회수: ApplyPropertySidebar 영구 폐기 + max-w-[640px] wrapper paradigm
//   (모바일 + 데스크탑 광역 동일 paradigm / §A-9 + §A-12 정합).
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  ApplyFormData,
  ApplyBidInfo,
  ApplyDocuments,
} from "@/types/apply";
import { INITIAL_APPLY_DATA } from "@/types/apply";
import { APPLY_STEPS, COURTS_ALL, type ApplyStepId } from "@/lib/constants";
import { ApplyStepIndicator } from "./ApplyStepIndicator";
import { Step1Property } from "./steps/Step1Property";
import { Step2BidInfo } from "./steps/Step2BidInfo";
import { Step3Documents } from "./steps/Step3Documents";
import { Step4Confirm } from "./steps/Step4Confirm";
import { Step5Payment } from "./steps/Step5Payment";
import { Step5Complete } from "./steps/Step5Complete";

const STEP_ORDER: ApplyStepId[] = APPLY_STEPS.map((s) => s.id);

export function ApplyClient() {
  const searchParams = useSearchParams();
  const initialCase = searchParams.get("case") ?? "";
  // Phase 6.5-POST 작업 1: court 영문/courtCode/한글 무엇이 와도 한글 label로 정규화.
  // 매칭 실패 시 빈 문자열 → INITIAL_APPLY_DATA.court 기본값(="인천지방법원") 유지.
  const initialCourtRaw = searchParams.get("court") ?? "";
  const initialCourt = initialCourtRaw
    ? COURTS_ALL.find(
        (c) => c.label === initialCourtRaw || c.courtCode === initialCourtRaw,
      )?.label ?? ""
    : "";

  const [data, setData] = useState<ApplyFormData>({
    ...INITIAL_APPLY_DATA,
    caseNumber: initialCase,
    ...(initialCourt ? { court: initialCourt } : {}),
  });
  const [currentStep, setCurrentStep] = useState<ApplyStepId>("property");
  // cycle 1-D-A-2: completed state는 setter만 사용 (5 step 원 paradigm 폐기 / 추후 진행 추적 영역).
  const [, setCompleted] = useState<Set<ApplyStepId>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  // Phase 6.5-POST 작업 6: PDF 단계 부분 실패 시 좀비 orders 회복.
  // /api/apply 성공 후 lastOrderId 보존 → 재시도 시 /api/apply 스킵, PDF 단계만 재호출.
  // PDF 성공 시 null clear. /api/apply 실패 시 lastOrderId 미set 상태 유지.
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // cycle 1-D-A-4: initialCase 자동 매칭 폐기 (Cowork 콘텐츠 source paradigm 폐기).
  // URL ?case= = caseNumber state 단독 prefill (위 useState 정합).

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

  const setDepositorName = (depositorName: string) =>
    setData((d) => ({ ...d, depositorName }));

  // cycle 1-D-A-4-7 신규: bidConfirmed ApplyClient drilling paradigm.
  // 직전 cycle Step2BidInfo internal state → Step navigation 회귀 시점 false 회귀 NG 식별 → drilling 정정.
  const setBidConfirmed = (bidConfirmed: boolean) =>
    setData((d) => ({ ...d, bidConfirmed }));

  function goNext() {
    const i = STEP_ORDER.indexOf(currentStep);
    if (i < 0 || i >= STEP_ORDER.length - 1) return;
    const nextStep = STEP_ORDER[i + 1];
    // Phase 4-CONFIRM 회귀 수정: property → 이후 모든 step 전환 시 bidDate + caseConfirmedByUser 게이트 적용.
    // Step1 → Step2 race condition 무방비 진입 차단 — 이중 방어.
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
    // cycle 1-D-A-4-5: Step5(payment) 진입 직전 재확인 = 위임 동의 3건 + 서명 정합 의무.
    if (
      nextStep === "payment" &&
      (!data.agreedDelegation ||
        !data.agreedPrivacy ||
        !data.agreedTerms ||
        !data.signature)
    ) {
      setSubmitError(
        "Step4에서 위임 계약 동의와 서명을 완료해주세요.",
      );
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
      // Phase 6.5-POST 작업 6: lastOrderId 분기로 부분 실패 회복.
      // 신규: /api/apply 호출 + lastOrderId 보존 → PDF 단계 호출
      // 재시도: /api/apply 스킵 + PDF 단계만 재호출 (좀비 orders 회복)
      let orderId = lastOrderId;

      if (!orderId) {
        const form = new FormData();
        form.set("caseNumber", data.caseNumber);
        form.set("court", data.court);
        // cycle 1-D-A-4-2: manualEntry paradigm 영구 폐기 → server backward compat 영구 false 강제.
        // server route + DB column 정리는 후속 cycle 영역.
        form.set("manualEntry", "false");
        // cycle 1-D-A-4: matchedSlug/Title 폐기 (Cowork 콘텐츠 source 분리).
        form.set("bidDate", data.bidDate);
        form.set("propertyType", data.propertyType);
        form.set("propertyAddress", data.propertyAddress);
        // Phase 6.7.6 — 매각회차 (listing 매칭 시 listing.auction_round 자동 / 매칭 단독 paradigm)
        form.set("auctionRound", String(data.auctionRound));
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
        // cycle 1-D-A-4-5: 입금자명 (Step5Payment / 사용자 입력 또는 applicantName default).
        form.set(
          "depositorName",
          data.depositorName || data.bidInfo.applicantName,
        );
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
          throw new Error(
            "로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.",
          );
        }
        if (res.status === 409) {
          throw new Error(
            json.error ??
              "해당 물건은 이미 다른 고객의 접수가 진행 중입니다. 중복 접수는 불가합니다.",
          );
        }
        if (!json.ok || !json.applicationId || !json.orderId) {
          throw new Error(json.error ?? "접수 처리 중 오류가 발생했습니다.");
        }
        orderId = json.orderId;
        setLastOrderId(orderId);
        setApplicationId(json.applicationId);
      }

      // 위임장 PDF 생성 + Storage 업로드 (재시도 가능 단계)
      const pdfRes = await fetch(
        `/api/orders/${orderId}/generate-delegation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ssnBack: data.bidInfo.ssnBack,
            signatureDataUrl: data.signature,
          }),
        },
      );
      if (!pdfRes.ok) {
        const pdfErr = await pdfRes
          .json()
          .catch(() => ({ error: "위임장 PDF 생성 중 오류가 발생했습니다." }));
        throw new Error(
          pdfErr.error ??
            "위임장 PDF 생성에 실패했습니다. '이 PDF로 제출' 버튼을 다시 눌러 재시도하면 PDF 단계만 재호출됩니다.",
        );
      }

      // 성공: ssnBack 메모리 클리어 + lastOrderId clear + complete 진입
      mergeBidInfo({ ssnBack: "" });
      setLastOrderId(null);
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
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
      // PDF 단계 실패 시 lastOrderId 유지 (재시도 가능). /api/apply 단계 실패 시 미set 상태 유지.
    } finally {
      setSubmitting(false);
    }
  }

  const stepView = useMemo(() => {
    switch (currentStep) {
      case "property":
        return (
          <Step1Property data={data} onChange={merge} onNext={goNext} />
        );
      case "bid-info":
        return (
          <Step2BidInfo
            data={data}
            onBidInfoChange={mergeBidInfo}
            onBidConfirmedChange={setBidConfirmed}
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
            onNext={goNext}
            onBack={goBack}
          />
        );
      case "payment":
        return (
          <Step5Payment
            data={data}
            onDepositorNameChange={setDepositorName}
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
  }, [currentStep, data, submitting, submitError, applicationId]);

  return (
    <>
      {/* cycle 1-D-A-2 = 하단 fixed bar paradigm. */}
      <ApplyStepIndicator current={currentStep} />
      <section
        className="container-app pt-10 lg:pt-16"
        style={{
          paddingBottom:
            "calc(var(--apply-bottom-bar-h) + env(safe-area-inset-bottom) + 24px)",
        }}
      >
        {/* cycle 1-D-A-4-2 paradigm 회수: 사이드바 영구 폐기 + max-w-[640px] mx-auto wrapper paradigm.
            모바일 + 데스크탑 광역 동일 dom (§A-9 + §A-12 정합).
            모바일 = full width minus padding / 데스크탑 = narrow column 광역 중앙 정렬. */}
        <div className="mx-auto w-full max-w-[640px]">{stepView}</div>
      </section>
    </>
  );
}
