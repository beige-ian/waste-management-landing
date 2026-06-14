import type { ReviewSubmission } from "@/types/review-submission";

export interface SubmittedReviewTextBlock {
  label: string;
  text: string;
}

export interface AiCouponDecision {
  recommendation: ReviewSubmission["aiPrecheck"]["recommendation"];
  label: string;
  confidenceLabel: string;
  amountLabel: string;
  summary: string;
  nextAction: string;
}

export interface ReviewStatusDisplay {
  label: string;
  source: "ai" | "operator" | "pending";
}

export interface ReviewActionOption {
  status: Exclude<ReviewSubmission["status"], "pending">;
  label: string;
  selected: boolean;
  disabled: boolean;
}

export interface CouponGrantDisplay {
  label: string;
  description: string;
  tone: "pending" | "eligible" | "hold" | "excluded";
}

export interface ReviewLoadErrorDisplay {
  title: string;
  description: string;
  action: "login" | "retry";
  actionLabel: string;
}

export interface AiReviewMetrics {
  total: number;
  targetReviewSuccessRate: number;
  autoReviewConfidenceThreshold: number;
  reviewSuccessCount: number;
  reviewSuccessRate: number;
  inconclusiveCount: number;
  inconclusiveRate: number;
  couponApprovalRecommendationCount: number;
  couponApprovalRecommendationRate: number;
  rejectionRecommendationCount: number;
  rejectionRecommendationRate: number;
  highConfidenceAutoReviewCount: number;
  highConfidenceAutoReviewRate: number;
  needsHumanReviewCount: number;
  needsHumanReviewRate: number;
  humanProcessedCount: number;
  humanProcessedRate: number;
  checkTotalCount: number;
  checkPassCount: number;
  checkPassRate: number;
}

export const AI_REVIEW_TARGETS = {
  reviewSuccessRate: 0.99,
  autoReviewConfidence: 0.9,
} as const;

const ADVISORY_AI_CHECK_KEYS = new Set([
  "reward_disclosure",
  "reward_disclosure_present",
  "promotional_signal",
]);

const AI_COUPON_LABELS: Record<ReviewSubmission["aiPrecheck"]["recommendation"], string> = {
  approve: "쿠폰 지급 권장",
  hold: "추가 확인 권장",
  reject: "지급 제외 권장",
};

const AI_COUPON_DEFAULT_SUMMARIES: Record<ReviewSubmission["aiPrecheck"]["recommendation"], string> = {
  approve: "커버링 이용 후기와 수거비 무료 쿠폰 보상 고지가 확인되었습니다.",
  hold: "쿠폰 지급 기준을 확정하려면 운영자 추가 확인이 필요합니다.",
  reject: "커버링 이용 후기 또는 쿠폰 지급 기준을 충족했다는 근거가 부족합니다.",
};

const AI_COUPON_DEFAULT_ACTIONS: Record<ReviewSubmission["aiPrecheck"]["recommendation"], string> = {
  approve: "운영자가 캡처를 최종 확인한 뒤 승인 처리합니다.",
  hold: "운영자가 제출 캡처와 URL을 다시 확인한 뒤 보류 처리합니다.",
  reject: "운영자가 반려 사유를 남기고 쿠폰 지급 대상에서 제외합니다.",
};

function normalizeText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function formatKoreanCurrency(value: number) {
  return `${Math.max(0, value).toLocaleString("ko-KR")}원`;
}

function formatCouponAmountLabel(value: number) {
  const amount = formatKoreanCurrency(value);
  return value === 2500
    ? `수거비 무료 ${amount} 쿠폰 지급 대상`
    : `${amount} 쿠폰 지급 대상`;
}

export function getSubmittedReviewTextBlocks(
  submission: Pick<ReviewSubmission, "contentSummary" | "extractedText" | "ocrText">,
): SubmittedReviewTextBlock[] {
  const blocks: SubmittedReviewTextBlock[] = [];
  const submittedSummary = normalizeText(submission.contentSummary);
  const extractedText = normalizeText(submission.extractedText);
  const ocrText = normalizeText(submission.ocrText);

  if (submittedSummary) {
    blocks.push({ label: "제출 내용", text: submittedSummary });
  }

  if (extractedText && extractedText !== submittedSummary) {
    blocks.push({ label: "링크 원문", text: extractedText });
  }

  if (ocrText && ocrText !== submittedSummary && ocrText !== extractedText) {
    blocks.push({ label: "캡처 내용", text: ocrText });
  }

  return blocks;
}

export function countSubmittedEvidence(
  submission: Pick<ReviewSubmission, "postUrl" | "screenshotUrls">,
) {
  return (submission.postUrl ? 1 : 0) + submission.screenshotUrls.length;
}

export function getReviewSubmitterLabel(
  submission: Pick<ReviewSubmission, "contentAuthorHandle" | "accountName" | "contentAuthorId">,
) {
  return (
    normalizeText(submission.contentAuthorHandle) ||
    normalizeText(submission.accountName) ||
    normalizeText(submission.contentAuthorId) ||
    "닉네임 없음"
  );
}

export function getPrimaryReviewScreenshotUrls(
  submission: Pick<ReviewSubmission, "screenshotUrls">,
) {
  return submission.screenshotUrls.slice(0, 2);
}

export function getAiCouponDecision(
  submission: Pick<ReviewSubmission, "aiPrecheck" | "couponAmount">,
): AiCouponDecision {
  const hasAiResult = hasStoredAiResult(submission);
  const recommendation = hasAiResult ? getFinalAiRecommendation(submission) : "hold";
  const confidence = Math.round(Math.max(0, Math.min(1, submission.aiPrecheck.confidence)) * 100);

  return {
    recommendation,
    label: hasAiResult ? AI_COUPON_LABELS[recommendation] : "AI 미결론",
    confidenceLabel: `${confidence}%`,
    amountLabel:
      !hasAiResult
        ? "AI 검수 결과 없음"
        : recommendation === "approve"
        ? formatCouponAmountLabel(submission.couponAmount)
        : "수거비 무료 쿠폰 지급 전 확인 필요",
    summary:
      !hasAiResult
        ? "AI 검수 결과가 저장되지 않았습니다."
        :
      normalizeText(submission.aiPrecheck.evidenceSummary) ||
      AI_COUPON_DEFAULT_SUMMARIES[recommendation],
    nextAction:
      !hasAiResult
        ? "AI 검수를 다시 실행하거나 운영자가 제출 캡처와 URL을 확인합니다."
        :
      normalizeText(submission.aiPrecheck.operatorNextAction) ||
      AI_COUPON_DEFAULT_ACTIONS[recommendation],
  };
}

export function getCouponGrantDisplay(
  submission: Pick<ReviewSubmission, "status" | "reviewedAt" | "reviewerEmail" | "couponAmount"> &
    Partial<Pick<ReviewSubmission, "operatorDecision" | "couponGrantStatus">>,
): CouponGrantDisplay {
  const couponGrantStatus = submission.couponGrantStatus || (
    submission.reviewedAt || submission.reviewerEmail
      ? submission.status === "approved"
        ? "eligible"
        : submission.status === "hold"
          ? "hold"
          : submission.status === "rejected"
            ? "excluded"
            : "not_decided"
      : "not_decided"
  );

  if (couponGrantStatus === "not_decided") {
    return {
      label: "쿠폰 미확정",
      description: "AI 권장일 뿐 운영자 최종 판단 전입니다.",
      tone: "pending",
    };
  }

  if (couponGrantStatus === "eligible") {
    return {
      label: `${formatCouponAmountLabel(submission.couponAmount).replace(" 쿠폰 지급 대상", " 지급 대상 확정")}`,
      description: "실제 쿠폰 발급은 별도 처리입니다.",
      tone: "eligible",
    };
  }

  if (couponGrantStatus === "issued") {
    return {
      label: `${formatCouponAmountLabel(submission.couponAmount).replace(" 쿠폰 지급 대상", " 발급 완료")}`,
      description: "쿠폰 발급이 완료된 상태입니다.",
      tone: "eligible",
    };
  }

  if (couponGrantStatus === "hold") {
    return {
      label: "추가 확인 중",
      description: "쿠폰 지급 대상 여부를 아직 확정하지 않았습니다.",
      tone: "hold",
    };
  }

  return {
    label: "지급 제외",
    description: "운영자 반려로 쿠폰 지급 대상이 아닙니다.",
    tone: "excluded",
  };
}

export function getReviewStatusDisplay(
  submission: Pick<ReviewSubmission, "status" | "reviewerEmail" | "reviewedAt">,
): ReviewStatusDisplay {
  const operatorReviewed = Boolean(submission.reviewedAt || submission.reviewerEmail);

  if (submission.status === "pending") {
    return { label: "검수 대기", source: "pending" };
  }

  if (operatorReviewed) {
    if (submission.status === "approved") return { label: "승인 처리됨", source: "operator" };
    if (submission.status === "hold") return { label: "보류 처리됨", source: "operator" };
    return { label: "반려 처리됨", source: "operator" };
  }

  if (submission.status === "approved") return { label: "AI 승인 권장", source: "ai" };
  if (submission.status === "hold") return { label: "AI 추가 확인 권장", source: "ai" };
  return { label: "AI 제외 권장", source: "ai" };
}

const ACTION_BASE_LABELS: Record<ReviewActionOption["status"], string> = {
  approved: "승인 처리",
  hold: "보류 처리",
  rejected: "반려 처리",
};

const ACTION_CURRENT_LABELS: Record<ReviewActionOption["status"], string> = {
  approved: "현재 승인",
  hold: "현재 보류",
  rejected: "현재 반려",
};

const ACTION_RECOMMENDED_LABELS: Record<ReviewActionOption["status"], string> = {
  approved: "AI 권장 승인",
  hold: "AI 권장 보류",
  rejected: "AI 권장 반려",
};

const ACTION_CHANGE_LABELS: Record<ReviewActionOption["status"], string> = {
  approved: "승인으로 변경",
  hold: "보류로 변경",
  rejected: "반려로 변경",
};

function recommendationToActionStatus(
  recommendation: ReviewSubmission["aiPrecheck"]["recommendation"],
): ReviewActionOption["status"] {
  if (recommendation === "approve") return "approved";
  if (recommendation === "hold") return "hold";
  return "rejected";
}

export function getReviewActionOptions(
  submission: Pick<ReviewSubmission, "status" | "reviewerEmail" | "reviewedAt" | "aiPrecheck">,
): ReviewActionOption[] {
  const operatorReviewed = Boolean(submission.reviewedAt || submission.reviewerEmail);
  const recommendedStatus = recommendationToActionStatus(submission.aiPrecheck.recommendation);
  const statuses: ReviewActionOption["status"][] = ["approved", "hold", "rejected"];

  return statuses.map((status) => {
    const current = operatorReviewed && submission.status === status;
    const recommended = !operatorReviewed && recommendedStatus === status;

    return {
      status,
      label: current
        ? ACTION_CURRENT_LABELS[status]
        : recommended
          ? ACTION_RECOMMENDED_LABELS[status]
          : operatorReviewed
            ? ACTION_CHANGE_LABELS[status]
            : ACTION_BASE_LABELS[status],
      selected: current || recommended,
      disabled: current,
    };
  });
}

export function getReviewLoadErrorDisplay(error: string | null): ReviewLoadErrorDisplay | null {
  if (!error) return null;

  if (error.includes("인증")) {
    return {
      title: "관리자 로그인이 필요합니다",
      description: "운영 저장소의 후기 목록은 관리자 로그인 후 볼 수 있습니다.",
      action: "login",
      actionLabel: "관리자 로그인",
    };
  }

  return {
    title: "후기 목록을 불러오지 못했습니다",
    description: "잠시 후 다시 시도하거나 관리자 권한과 네트워크 상태를 확인합니다.",
    action: "retry",
    actionLabel: "다시 시도",
  };
}

function hasStoredAiResult(
  submission: Pick<ReviewSubmission, "aiPrecheck">,
) {
  return (
    submission.aiPrecheck.confidence > 0 &&
    !submission.aiPrecheck.reasonCodes.includes("AI_DECISION_MISSING")
  );
}

function getFinalAiRecommendation(
  submission: Pick<ReviewSubmission, "aiPrecheck">,
) {
  return submission.aiPrecheck.recommendation;
}

function isBlockingAiCheck(check: ReviewSubmission["aiPrecheck"]["checks"][number]) {
  return !ADVISORY_AI_CHECK_KEYS.has(check.key);
}

export function getAiReviewFlagChecks(
  submission: Pick<ReviewSubmission, "aiPrecheck">,
) {
  return submission.aiPrecheck.checks.filter((check) => (
    ADVISORY_AI_CHECK_KEYS.has(check.key) && check.status !== "pass"
  ));
}

function hasFinalAiDecision(
  submission: Pick<ReviewSubmission, "aiPrecheck">,
) {
  return hasStoredAiResult(submission) && (
    getFinalAiRecommendation(submission) === "approve" ||
    getFinalAiRecommendation(submission) === "reject"
  );
}

function isHighConfidenceAutoReviewCandidate(
  submission: Pick<ReviewSubmission, "aiPrecheck">,
) {
  const blockingChecks = submission.aiPrecheck.checks.filter(isBlockingAiCheck);

  return (
    getFinalAiRecommendation(submission) === "approve" &&
    submission.aiPrecheck.confidence >= AI_REVIEW_TARGETS.autoReviewConfidence &&
    blockingChecks.length > 0 &&
    blockingChecks.every((check) => check.status === "pass")
  );
}

function rate(numerator: number, denominator: number) {
  return denominator > 0 ? numerator / denominator : 0;
}

export function getAiReviewMetrics(
  submissions: Pick<ReviewSubmission, "aiPrecheck" | "reviewedAt" | "reviewerEmail" | "status">[],
): AiReviewMetrics {
  const total = submissions.length;
  let reviewSuccessCount = 0;
  let couponApprovalRecommendationCount = 0;
  let rejectionRecommendationCount = 0;
  let highConfidenceAutoReviewCount = 0;
  let humanProcessedCount = 0;
  let checkTotalCount = 0;
  let checkPassCount = 0;

  for (const submission of submissions) {
    if (hasFinalAiDecision(submission)) {
      reviewSuccessCount += 1;
      if (getFinalAiRecommendation(submission) === "approve") {
        couponApprovalRecommendationCount += 1;
      } else {
        rejectionRecommendationCount += 1;
      }
    }
    if (isHighConfidenceAutoReviewCandidate(submission)) {
      highConfidenceAutoReviewCount += 1;
    }
    if (submission.reviewedAt || submission.reviewerEmail) {
      humanProcessedCount += 1;
    }

    for (const check of submission.aiPrecheck.checks.filter(isBlockingAiCheck)) {
      checkTotalCount += 1;
      if (check.status === "pass") checkPassCount += 1;
    }
  }

  const inconclusiveCount = total - reviewSuccessCount;
  const needsHumanReviewCount = total - highConfidenceAutoReviewCount;

  return {
    total,
    targetReviewSuccessRate: AI_REVIEW_TARGETS.reviewSuccessRate,
    autoReviewConfidenceThreshold: AI_REVIEW_TARGETS.autoReviewConfidence,
    reviewSuccessCount,
    reviewSuccessRate: rate(reviewSuccessCount, total),
    inconclusiveCount,
    inconclusiveRate: rate(inconclusiveCount, total),
    couponApprovalRecommendationCount,
    couponApprovalRecommendationRate: rate(couponApprovalRecommendationCount, total),
    rejectionRecommendationCount,
    rejectionRecommendationRate: rate(rejectionRecommendationCount, total),
    highConfidenceAutoReviewCount,
    highConfidenceAutoReviewRate: rate(highConfidenceAutoReviewCount, total),
    needsHumanReviewCount,
    needsHumanReviewRate: rate(needsHumanReviewCount, total),
    humanProcessedCount,
    humanProcessedRate: rate(humanProcessedCount, total),
    checkTotalCount,
    checkPassCount,
    checkPassRate: rate(checkPassCount, checkTotalCount),
  };
}
