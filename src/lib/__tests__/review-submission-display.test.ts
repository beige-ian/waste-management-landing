import { describe, expect, it } from "vitest";
import {
  countSubmittedEvidence,
  getAiReviewMetrics,
  getAiCouponDecision,
  getAiReviewFlagChecks,
  getCouponGrantDisplay,
  getPrimaryReviewScreenshotUrls,
  getReviewActionOptions,
  getReviewLoadErrorDisplay,
  getReviewSubmitterLabel,
  getReviewStatusDisplay,
  getSubmittedReviewTextBlocks,
} from "@/lib/review-submission-display";

describe("review-submission-display", () => {
  it("제출자가 남긴 후기 내용과 제출 증거 텍스트만 표시 대상으로 만든다", () => {
    const blocks = getSubmittedReviewTextBlocks({
      contentSummary: " 커버링 대형폐기물 수거를 이용한 후기입니다. ",
      extractedText: "블로그에 공개된 원문입니다.",
      ocrText: "캡처에서 읽은 후기입니다.",
    });

    expect(blocks).toEqual([
      { label: "제출 내용", text: "커버링 대형폐기물 수거를 이용한 후기입니다." },
      { label: "링크 원문", text: "블로그에 공개된 원문입니다." },
      { label: "캡처 내용", text: "캡처에서 읽은 후기입니다." },
    ]);
  });

  it("빈 값과 같은 원문 반복은 표시하지 않는다", () => {
    const blocks = getSubmittedReviewTextBlocks({
      contentSummary: "같은 후기",
      extractedText: "같은 후기",
      ocrText: "   ",
    });

    expect(blocks).toEqual([{ label: "제출 내용", text: "같은 후기" }]);
  });

  it("사용자가 제출한 링크와 캡처 개수만 센다", () => {
    expect(countSubmittedEvidence({
      postUrl: "https://example.com/review",
      screenshotUrls: ["https://example.com/1.png", "https://example.com/2.png"],
    })).toBe(3);
  });

  it("제출자 표시는 실명이 아니라 채널 닉네임과 ID를 우선 사용한다", () => {
    expect(getReviewSubmitterLabel({
      contentAuthorHandle: "talloe",
      accountName: "account-fallback",
      contentAuthorId: "id-fallback",
    })).toBe("talloe");

    expect(getReviewSubmitterLabel({
      contentAuthorHandle: null,
      accountName: "model_eung",
      contentAuthorId: "naver-model-eung",
    })).toBe("model_eung");

    expect(getReviewSubmitterLabel({
      contentAuthorHandle: null,
      accountName: null,
      contentAuthorId: "naver-only-id",
    })).toBe("naver-only-id");
  });

  it("운영 검수용 캡처는 제출 순서대로 최대 2장만 우선 표시한다", () => {
    expect(getPrimaryReviewScreenshotUrls({
      screenshotUrls: [
        "/demo-review-screenshots/review-001-1.png",
        "/demo-review-screenshots/review-001-2.png",
        "/demo-review-screenshots/review-001-3.png",
      ],
    })).toEqual([
      "/demo-review-screenshots/review-001-1.png",
      "/demo-review-screenshots/review-001-2.png",
    ]);
  });

  it("AI 승인 권장 판정을 쿠폰 지급 금액과 신뢰도로 표시한다", () => {
    const decision = getAiCouponDecision({
      couponAmount: 2500,
      aiPrecheck: {
        recommendation: "approve",
        confidence: 0.914,
        reasonCodes: [],
        evidenceSummary: "캡처 2장에서 커버링 이용 후기와 보상 고지가 확인됩니다.",
        operatorNextAction: "승인하면 쿠폰 지급 대상입니다.",
        checks: [],
      },
    });

    expect(decision.label).toBe("쿠폰 지급 권장");
    expect(decision.confidenceLabel).toBe("91%");
    expect(decision.amountLabel).toBe("수거비 무료 2,500원 쿠폰 지급 대상");
    expect(decision.summary).toContain("캡처 2장");
  });

  it("보상 고지와 홍보성 신호는 승인 차단이 아니라 주의 근거로 표시한다", () => {
    const flags = getAiReviewFlagChecks({
      aiPrecheck: {
        recommendation: "approve",
        confidence: 0.91,
        reasonCodes: ["REWARD_DISCLOSURE_NEEDS_REVIEW", "PROMOTIONAL_SIGNAL"],
        evidenceSummary: "",
        operatorNextAction: "",
        checks: [
          { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
          { key: "actual_large_waste_experience", label: "대형폐기물 이용 내용", status: "pass", evidence: [] },
          { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "needs_review", evidence: ["보상 문구 없음"] },
          { key: "promotional_signal", label: "홍보성 주의 신호", status: "needs_review", evidence: ["추천코드 포함"] },
        ],
      },
    });

    expect(flags.map((check) => check.key)).toEqual(["reward_disclosure", "promotional_signal"]);
  });

  it("기존 AI 보류 판정은 추가 확인 권장으로 표시한다", () => {
    const decision = getAiCouponDecision({
      couponAmount: 2500,
      aiPrecheck: {
        recommendation: "hold",
        confidence: 0.68,
        reasonCodes: ["SCREENSHOT_ONLY"],
        evidenceSummary: "",
        operatorNextAction: "",
        checks: [],
      },
    });

    expect(decision.label).toBe("추가 확인 권장");
    expect(decision.amountLabel).toBe("수거비 무료 쿠폰 지급 전 확인 필요");
    expect(decision.nextAction).toContain("보류");
  });

  it("AI 결과가 없으면 반려가 아니라 미결론으로 표시한다", () => {
    const decision = getAiCouponDecision({
      couponAmount: 2500,
      aiPrecheck: {
        recommendation: "hold",
        confidence: 0,
        reasonCodes: ["AI_DECISION_MISSING"],
        evidenceSummary: "",
        operatorNextAction: "",
        checks: [],
      },
    });

    expect(decision.label).toBe("AI 미결론");
    expect(decision.amountLabel).toBe("AI 검수 결과 없음");
    expect(decision.nextAction).toContain("AI 검수");
  });

  it("쿠폰 지급 상태는 AI 권장과 운영자 판단 뒤의 지급 대상 확정을 분리한다", () => {
    expect(getCouponGrantDisplay({
      status: "approved",
      reviewedAt: null,
      reviewerEmail: null,
      couponAmount: 2500,
    })).toMatchObject({
      label: "쿠폰 미확정",
      description: "AI 권장일 뿐 운영자 최종 판단 전입니다.",
    });

    expect(getCouponGrantDisplay({
      status: "approved",
      reviewedAt: "2026-06-09T01:00:00.000Z",
      reviewerEmail: "review-admin",
      couponAmount: 2500,
    })).toMatchObject({
      label: "수거비 무료 2,500원 지급 대상 확정",
      description: "실제 쿠폰 발급은 별도 처리입니다.",
    });

    expect(getCouponGrantDisplay({
      status: "hold",
      reviewedAt: "2026-06-09T01:00:00.000Z",
      reviewerEmail: "review-admin",
      couponAmount: 2500,
    }).label).toBe("추가 확인 중");

    expect(getCouponGrantDisplay({
      status: "rejected",
      reviewedAt: "2026-06-09T01:00:00.000Z",
      reviewerEmail: "review-admin",
      couponAmount: 2500,
    }).label).toBe("지급 제외");
  });


  it("AI 판정과 운영자 처리 상태를 구분해서 표시한다", () => {
    expect(getReviewStatusDisplay({
      status: "approved",
      reviewerEmail: null,
      reviewedAt: null,
    }).label).toBe("AI 승인 권장");

    expect(getReviewStatusDisplay({
      status: "approved",
      reviewerEmail: "review-admin",
      reviewedAt: "2026-06-09T01:00:00.000Z",
    }).label).toBe("승인 처리됨");

    expect(getReviewStatusDisplay({
      status: "hold",
      reviewerEmail: null,
      reviewedAt: null,
    }).label).toBe("AI 추가 확인 권장");

    expect(getReviewStatusDisplay({
      status: "pending",
      reviewerEmail: null,
      reviewedAt: null,
    }).label).toBe("검수 대기");
  });

  it("운영자 액션 버튼은 AI 권장과 현재 처리 상태를 구분한다", () => {
    const aiRecommended = getReviewActionOptions({
      status: "approved",
      reviewerEmail: null,
      reviewedAt: null,
      aiPrecheck: {
        recommendation: "approve",
        confidence: 0.91,
        reasonCodes: [],
        evidenceSummary: "",
        operatorNextAction: "",
        checks: [],
      },
    });
    expect(aiRecommended.find((option) => option.status === "approved")).toMatchObject({
      label: "AI 권장 승인",
      selected: true,
      disabled: false,
    });

    const operatorApproved = getReviewActionOptions({
      status: "approved",
      reviewerEmail: "review-admin",
      reviewedAt: "2026-06-09T01:00:00.000Z",
      aiPrecheck: {
        recommendation: "approve",
        confidence: 0.91,
        reasonCodes: [],
        evidenceSummary: "",
        operatorNextAction: "",
        checks: [],
      },
    });
    expect(operatorApproved.find((option) => option.status === "approved")).toMatchObject({
      label: "현재 승인",
      selected: true,
      disabled: true,
    });
    expect(operatorApproved.find((option) => option.status === "rejected")?.label).toBe("반려로 변경");
  });

  it("AI 검수 성공률은 승인 또는 반려 결론이 난 비율로 계산한다", () => {
    const metrics = getAiReviewMetrics([
      {
        status: "approved",
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "approve",
          confidence: 0.94,
          reasonCodes: [],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [
            { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
            { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: [] },
            { key: "reward_disclosure", label: "보상 고지", status: "needs_review", evidence: [] },
          ],
        },
      },
      {
        status: "hold",
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "hold",
          confidence: 0.72,
          reasonCodes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [
            { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
            { key: "reward_disclosure", label: "보상 고지", status: "needs_review", evidence: [] },
          ],
        },
      },
      {
        status: "approved",
        reviewedAt: "2026-06-09T01:00:00.000Z",
        reviewerEmail: "review-admin",
        aiPrecheck: {
          recommendation: "approve",
          confidence: 0.84,
          reasonCodes: [],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [
            { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
          ],
        },
      },
      {
        status: "pending",
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "hold",
          confidence: 0,
          reasonCodes: ["AI_DECISION_MISSING"],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [],
        },
      },
    ]);

    expect(metrics.reviewSuccessRate).toBe(0.5);
    expect(metrics.inconclusiveRate).toBe(0.5);
    expect(metrics.couponApprovalRecommendationRate).toBe(0.5);
    expect(metrics.rejectionRecommendationRate).toBe(0);
    expect(metrics.highConfidenceAutoReviewRate).toBe(0.25);
    expect(metrics.needsHumanReviewRate).toBe(0.75);
    expect(metrics.humanProcessedRate).toBe(0.25);
    expect(metrics.checkPassRate).toBe(1);
    expect(metrics.targetReviewSuccessRate).toBe(0.99);
  });

  it("신뢰도가 낮은 승인 권장은 고신뢰 자동처리 후보로 보지 않는다", () => {
    const metrics = getAiReviewMetrics([
      {
        status: "approved",
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "approve",
          confidence: 0.89,
          reasonCodes: [],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [
            { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
            { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: [] },
          ],
        },
      },
    ]);

    expect(metrics.couponApprovalRecommendationCount).toBe(1);
    expect(metrics.highConfidenceAutoReviewCount).toBe(0);
  });

  it("인증 실패와 빈 목록을 다른 화면 상태로 표시한다", () => {
    expect(getReviewLoadErrorDisplay("인증이 필요합니다")).toMatchObject({
      title: "관리자 로그인이 필요합니다",
      action: "login",
    });

    expect(getReviewLoadErrorDisplay("조회 실패")).toMatchObject({
      title: "후기 목록을 불러오지 못했습니다",
      action: "retry",
    });

    expect(getReviewLoadErrorDisplay(null)).toBeNull();
  });
});
