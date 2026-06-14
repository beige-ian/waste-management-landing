import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/admin/review-submissions/route";
import { PUT } from "@/app/api/admin/review-submissions/[id]/route";
import {
  hasReviewSubmissionPersistence,
  getAllReviewSubmissions,
  getReviewSubmissions,
  updateReviewSubmissionStatus,
} from "@/lib/review-submissions";

vi.mock("@/lib/review-submissions", () => ({
  hasReviewSubmissionPersistence: vi.fn(),
  getAllReviewSubmissions: vi.fn(),
  getReviewSubmissions: vi.fn(),
  updateReviewSubmissionStatus: vi.fn(),
}));

const mockHasReviewSubmissionPersistence = vi.mocked(hasReviewSubmissionPersistence);
const mockGetAllReviewSubmissions = vi.mocked(getAllReviewSubmissions);
const mockGetReviewSubmissions = vi.mocked(getReviewSubmissions);
const mockUpdateReviewSubmissionStatus = vi.mocked(updateReviewSubmissionStatus);

describe("review-submissions admin API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHasReviewSubmissionPersistence.mockReturnValue(false);
  });

  it("비밀번호 토큰 없이 제출 후기 목록을 조회한다", async () => {
    const submissions = [
      {
        id: "review-1",
        status: "pending",
        postUrl: "https://example.com/review",
        screenshotUrls: ["https://example.com/review-1.png"],
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
      {
        id: "review-2",
        status: "approved",
        postUrl: null,
        screenshotUrls: [],
        reviewedAt: "2026-06-09T01:00:00.000Z",
        reviewerEmail: "review-admin",
        aiPrecheck: {
          recommendation: "approve",
          confidence: 0.93,
          reasonCodes: [],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [
            { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: [] },
            { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: [] },
          ],
        },
      },
    ] as unknown as Awaited<ReturnType<typeof getReviewSubmissions>>;
    mockGetReviewSubmissions.mockResolvedValueOnce(submissions);
    mockGetAllReviewSubmissions.mockResolvedValueOnce(submissions);

    const response = await GET(new NextRequest("http://localhost/api/admin/review-submissions?status=all"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetReviewSubmissions).toHaveBeenCalledWith({
      status: "all",
      search: "",
      page: 1,
      limit: 50,
    });
    expect(mockGetAllReviewSubmissions).toHaveBeenCalledWith({ search: "" });
    expect(json.counts).toEqual({
      all: 2,
      pending: 1,
      approved: 1,
      rejected: 0,
      hold: 0,
      needsReview: 1,
      processed: 1,
      evidence: 2,
    });
    expect(json.aiReviewMetrics).toMatchObject({
      total: 2,
      targetReviewSuccessRate: 0.99,
      reviewSuccessCount: 1,
      reviewSuccessRate: 0.5,
      inconclusiveCount: 1,
      inconclusiveRate: 0.5,
      couponApprovalRecommendationCount: 1,
      couponApprovalRecommendationRate: 0.5,
      rejectionRecommendationCount: 0,
      rejectionRecommendationRate: 0,
      highConfidenceAutoReviewCount: 1,
      highConfidenceAutoReviewRate: 0.5,
      humanProcessedCount: 1,
      humanProcessedRate: 0.5,
    });
    expect(json.submissions).toHaveLength(2);
  });

  it("상태 탭 목록은 해당 상태만 가져오고 카운트는 전체 기준으로 계산한다", async () => {
    mockGetReviewSubmissions
      .mockResolvedValueOnce([
        {
          id: "review-approved",
          status: "approved",
          postUrl: "https://example.com/review",
          screenshotUrls: [],
          reviewedAt: null,
          reviewerEmail: null,
          aiPrecheck: {
            recommendation: "approve",
            confidence: 0.91,
            reasonCodes: [],
            evidenceSummary: "",
            operatorNextAction: "",
            checks: [],
          },
        },
      ] as unknown as Awaited<ReturnType<typeof getReviewSubmissions>>);
    mockGetAllReviewSubmissions.mockResolvedValueOnce([
      {
        id: "review-approved",
        status: "approved",
        postUrl: "https://example.com/review",
        screenshotUrls: [],
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "approve",
          confidence: 0.91,
          reasonCodes: [],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [],
        },
      },
      {
        id: "review-hold",
        status: "hold",
        postUrl: null,
        screenshotUrls: ["https://example.com/review.png"],
        reviewedAt: null,
        reviewerEmail: null,
        aiPrecheck: {
          recommendation: "hold",
          confidence: 0.71,
          reasonCodes: ["CHECK_REQUIRED"],
          evidenceSummary: "",
          operatorNextAction: "",
          checks: [],
        },
      },
    ] as unknown as Awaited<ReturnType<typeof getAllReviewSubmissions>>);

    const response = await GET(new NextRequest("http://localhost/api/admin/review-submissions?status=approved&page=2&limit=25"));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetReviewSubmissions).toHaveBeenNthCalledWith(1, {
      status: "approved",
      search: "",
      page: 2,
      limit: 25,
    });
    expect(mockGetAllReviewSubmissions).toHaveBeenCalledWith({ search: "" });
    expect(json.submissions.map((submission: { id: string }) => submission.id)).toEqual(["review-approved"]);
    expect(json.counts).toMatchObject({
      all: 2,
      approved: 1,
      hold: 1,
    });
  });

  it("올바르지 않은 상태 탭 값은 조회하지 않고 거절한다", async () => {
    const response = await GET(new NextRequest("http://localhost/api/admin/review-submissions?status=unknown"));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("상태 필터가 올바르지 않습니다");
    expect(mockGetReviewSubmissions).not.toHaveBeenCalled();
    expect(mockGetAllReviewSubmissions).not.toHaveBeenCalled();
  });

  it("운영 저장소에 연결된 후기 목록은 관리자 토큰 없이는 조회하지 못한다", async () => {
    mockHasReviewSubmissionPersistence.mockReturnValueOnce(true);

    const response = await GET(new NextRequest("http://localhost/api/admin/review-submissions?status=all"));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe("인증이 필요합니다");
    expect(mockGetReviewSubmissions).not.toHaveBeenCalled();
  });

  it("로컬 더미 제출 후기는 비밀번호 토큰 없이 상태를 바꾼다", async () => {
    mockUpdateReviewSubmissionStatus.mockResolvedValueOnce({
      id: "review-1",
      status: "approved",
    } as Awaited<ReturnType<typeof updateReviewSubmissionStatus>>);

    const request = new NextRequest("http://localhost/api/admin/review-submissions/review-1", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });
    const response = await PUT(request, { params: Promise.resolve({ id: "review-1" }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.submission.status).toBe("approved");
    expect(mockUpdateReviewSubmissionStatus).toHaveBeenCalledWith({
      id: "review-1",
      status: "approved",
      rejectReason: undefined,
      adminMemo: undefined,
      reviewerEmail: "review-admin",
    });
  });

  it("운영 저장소에 연결된 후기 상태 변경은 관리자 토큰 없이는 막는다", async () => {
    mockHasReviewSubmissionPersistence.mockReturnValueOnce(true);

    const request = new NextRequest("http://localhost/api/admin/review-submissions/review-1", {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    });
    const response = await PUT(request, { params: Promise.resolve({ id: "review-1" }) });
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error).toBe("인증이 필요합니다");
    expect(mockUpdateReviewSubmissionStatus).not.toHaveBeenCalled();
  });
});
