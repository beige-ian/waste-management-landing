import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllReviewSubmissions,
  getReviewSubmissions,
} from "@/lib/review-submissions";

const mockSupabase = vi.hoisted(() => {
  const state: {
    rows: Record<string, unknown>[];
    filters: { key: string; value: unknown }[];
  } = { rows: [], filters: [] };
  const query = {
    select: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    range: vi.fn(() => query),
    eq: vi.fn((key: string, value: unknown) => {
      state.filters.push({ key, value });
      return query;
    }),
    or: vi.fn(() => query),
    then: (
      resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
      reject?: (reason: unknown) => unknown,
    ) => {
      const rows = state.rows.filter((row) => (
        state.filters.every((filter) => row[filter.key] === filter.value)
      ));
      state.filters = [];
      return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
    },
  };

  return {
    state,
    from: vi.fn(() => query),
    query,
  };
});

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockSupabase.from,
  },
}));

function buildReviewSubmissionRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "review-row",
    booking_id: "booking-row",
    phone: "01012345678",
    channel: "naver_blog",
    channel_type: "url_and_screenshot",
    post_url: "https://blog.naver.com/talloe/224291642043",
    canonical_url: null,
    screenshot_urls: ["/demo-review-screenshots/minji-feed-1.png"],
    account_name: "talloe",
    content_author_id: "naver-talloe",
    content_author_handle: "talloe",
    posted_at: "2026-06-07T09:30:00.000Z",
    content_summary: "커버링 대형폐기물 이용 후기입니다.",
    extracted_text: null,
    ocr_text: null,
    url_fetch_status: "ok",
    fetched_title: "커버링 대형폐기물 후기",
    duplicate_candidates: [],
    reward_disclosure_confirmed: true,
    privacy_confirmed: true,
    ai_recommendation: null,
    ai_confidence: 0,
    ai_reason_codes: [],
    ai_checks: [],
    ai_evidence_summary: "",
    ai_operator_next_action: "",
    status: "pending",
    coupon_amount: 2500,
    reject_reason: null,
    admin_memo: "",
    reviewer_email: null,
    reviewed_at: null,
    created_at: "2026-06-08T02:12:00.000Z",
    updated_at: "2026-06-08T02:12:00.000Z",
    bookings: {
      id: "booking-row",
      date: "2026-06-06",
      status: "completed",
      items: [],
      area: "서울 강남구",
    },
    ...overrides,
  };
}

describe("review-submissions Supabase AI status mapping", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");
    mockSupabase.state.rows = [];
    mockSupabase.state.filters = [];
    vi.clearAllMocks();
  });

  it("상태 탭 조회는 화면에 표시되는 AI 권장 상태로 거르고 그 뒤 페이지 범위를 적용한다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "approved-row",
        status: "approved",
        ai_recommendation: "approve",
        ai_confidence: 0.91,
      }),
      buildReviewSubmissionRow({
        id: "pending-ai-approve-row",
        status: "pending",
        ai_recommendation: "approve",
        ai_confidence: 0.91,
      }),
      buildReviewSubmissionRow({
        id: "pending-missing-ai-row",
        status: "pending",
        ai_recommendation: "approve",
        ai_confidence: 0,
      }),
    ];

    const submissions = await getReviewSubmissions({ status: "approved", search: "", page: 2, limit: 1 });

    expect(submissions.map((submission) => submission.id)).toEqual(["pending-ai-approve-row"]);
    expect(mockSupabase.query.eq).not.toHaveBeenCalledWith("status", "approved");
    expect(mockSupabase.query.limit).not.toHaveBeenCalledWith(200);
  });

  it("저장된 AI 판정이 있는 pending만 AI 권장 탭에 자동 분류한다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "stored-ai-approve",
        status: "pending",
        ai_recommendation: "approve",
        ai_confidence: 0.91,
        ai_evidence_summary: "저장된 AI 승인 근거",
      }),
      buildReviewSubmissionRow({
        id: "missing-ai-decision",
        ai_recommendation: "approve",
        ai_confidence: 0,
      }),
      buildReviewSubmissionRow({
        id: "stored-ai-hold",
        status: "pending",
        ai_recommendation: "hold",
        ai_confidence: 0.72,
        ai_reason_codes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
      }),
    ];

    const approved = await getReviewSubmissions({ status: "approved", search: "" });
    const hold = await getReviewSubmissions({ status: "hold", search: "" });
    const all = await getReviewSubmissions({ status: "all", search: "" });

    expect(approved.map((submission) => submission.id)).toEqual(["stored-ai-approve"]);
    expect(approved[0].status).toBe("approved");
    expect(approved[0].aiPrecheck.recommendation).toBe("approve");
    expect(hold.map((submission) => submission.id)).toEqual(["stored-ai-hold"]);
    expect(hold[0].aiPrecheck.recommendation).toBe("hold");
    expect(all.find((submission) => submission.id === "missing-ai-decision")?.status).toBe("pending");
    expect(all.find((submission) => submission.id === "missing-ai-decision")?.aiPrecheck.reasonCodes)
      .toContain("AI_DECISION_MISSING");
  });

  it("전체 카운트용 조회도 화면 상태 기준으로 AI 권장 건을 분류한다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "pending-ai-approve",
        status: "pending",
        ai_recommendation: "approve",
        ai_confidence: 0.91,
      }),
      buildReviewSubmissionRow({
        id: "pending-ai-hold",
        status: "pending",
        ai_recommendation: "hold",
        ai_confidence: 0.72,
      }),
      buildReviewSubmissionRow({
        id: "pending-missing-ai",
        status: "pending",
        ai_recommendation: "approve",
        ai_confidence: 0,
      }),
    ];

    const submissions = await getAllReviewSubmissions({ search: "" });

    expect(submissions.map((submission) => [submission.id, submission.status])).toEqual([
      ["pending-ai-approve", "approved"],
      ["pending-ai-hold", "hold"],
      ["pending-missing-ai", "pending"],
    ]);
  });

  it("운영자 판단과 쿠폰 지급 상태를 row에서 분리해 읽는다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "operator-approved-row",
        status: "approved",
        operator_decision: "approved",
        coupon_grant_status: "eligible",
        reviewer_email: "review-admin",
        reviewed_at: "2026-06-09T01:00:00.000Z",
        ai_recommendation: "approve",
        ai_confidence: 0.91,
      }),
    ];

    const submissions = await getReviewSubmissions({ status: "approved", search: "" });

    expect(submissions[0]).toMatchObject({
      id: "operator-approved-row",
      status: "approved",
      operatorDecision: "approved",
      couponGrantStatus: "eligible",
    });
  });

  it("보상 고지 부족만 이유인 과거 반려 판정은 대형폐기물 후기 근거가 있으면 승인으로 보정한다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "reward-only-old-reject",
        status: "approved",
        reward_disclosure_confirmed: false,
        ai_recommendation: "hold",
        ai_confidence: 0.72,
        ai_reason_codes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
        ai_checks: [
          {
            key: "official_source_excluded",
            label: "공식 블로그 제외",
            status: "pass",
            evidence: ["공식/운영 블로그 제외 대상 아님"],
          },
          {
            key: "covering_context",
            label: "커버링 이용 맥락",
            status: "pass",
            evidence: ["커버링 대형폐기물 후기 제목 확인"],
          },
          {
            key: "actual_large_waste_experience",
            label: "대형폐기물 이용 내용",
            status: "pass",
            evidence: ["대형 폐기물 수거 업체 이용후기 본문 확인"],
          },
          {
            key: "reward_disclosure",
            label: "쿠폰 보상 고지",
            status: "needs_review",
            evidence: ["보상 고지는 확인되지 않음"],
          },
        ],
      }),
    ];

    const approved = await getReviewSubmissions({ status: "approved", search: "" });

    expect(approved.map((submission) => submission.id)).toEqual(["reward-only-old-reject"]);
    expect(approved[0].aiPrecheck.recommendation).toBe("approve");
    expect(approved[0].aiPrecheck.evidenceSummary).toContain("보상 고지는 승인 필수 조건에서 제외");
    expect(approved[0].aiPrecheck.checks.find((check) => check.key === "reward_disclosure")?.status)
      .toBe("needs_review");
  });

  it("핵심 근거 체크가 없으면 보상 고지 부족만 남은 과거 보류를 승인으로 보정하지 않는다", async () => {
    mockSupabase.state.rows = [
      buildReviewSubmissionRow({
        id: "reward-only-without-core-checks",
        status: "hold",
        reward_disclosure_confirmed: false,
        ai_recommendation: "hold",
        ai_confidence: 0.72,
        ai_reason_codes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
        ai_checks: [
          {
            key: "reward_disclosure",
            label: "쿠폰 보상 고지",
            status: "needs_review",
            evidence: ["보상 고지는 확인되지 않음"],
          },
        ],
      }),
    ];

    const hold = await getReviewSubmissions({ status: "hold", search: "" });

    expect(hold.map((submission) => submission.id)).toEqual(["reward-only-without-core-checks"]);
    expect(hold[0].aiPrecheck.recommendation).toBe("hold");
  });
});
