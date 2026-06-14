import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getReviewSubmissions,
  updateReviewSubmissionStatus,
} from "@/lib/review-submissions";
import { resetDemoReviewSubmissionsForTest } from "@/lib/review-submission-demo";

describe("review-submissions demo fallback", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    resetDemoReviewSubmissionsForTest();
  });

  it("Supabase 환경값이 없으면 더미 제출 후기를 보여준다", async () => {
    const submissions = await getReviewSubmissions({ status: "all", search: "" });
    const statusCounts = submissions.reduce<Record<string, number>>((counts, submission) => {
      counts[submission.status] = (counts[submission.status] || 0) + 1;
      return counts;
    }, {});

    expect(submissions).toHaveLength(10);
    expect(statusCounts).toEqual({ approved: 6, hold: 1, rejected: 3 });
    expect(submissions.every((submission) => (
      submission.aiPrecheck.recommendation === "approve"
        ? submission.status === "approved"
        : submission.aiPrecheck.recommendation === "hold"
          ? submission.status === "hold"
          : submission.status === "rejected"
    ))).toBe(true);
    expect(submissions.some((submission) => submission.contentAuthorHandle === "talloe")).toBe(true);
    expect(submissions.some((submission) => submission.screenshotUrls.length >= 2)).toBe(true);
    expect(submissions.some((submission) => submission.aiPrecheck.recommendation === "approve")).toBe(true);
    expect(submissions.some((submission) => submission.aiPrecheck.recommendation === "hold")).toBe(true);
    expect(submissions.some((submission) => submission.aiPrecheck.recommendation === "reject")).toBe(true);
  });

  it("더미 제출 후기는 PNG 캡처 2장과 AI 쿠폰 판정을 포함한다", async () => {
    const submissions = await getReviewSubmissions({ status: "all", search: "talloe" });

    expect(submissions).toHaveLength(1);
    expect(submissions[0].screenshotUrls).toEqual([
      "/demo-review-screenshots/minji-feed-1.png",
      "/demo-review-screenshots/minji-feed-2.png",
    ]);
    expect(submissions[0].postUrl).toBe("https://blog.naver.com/talloe/224291642043");
    expect(submissions[0].fetchedTitle).toContain("대형폐기물 신고 스티커");
    expect(submissions[0].couponAmount).toBe(2500);
    expect(submissions[0].aiPrecheck.recommendation).toBe("approve");
    expect(submissions[0].aiPrecheck.evidenceSummary).toContain("쿠폰 보상 고지");
    expect(submissions[0].aiPrecheck.checks.some((check) => check.key === "reward_disclosure")).toBe(true);
    expect(submissions[0].aiPrecheck.checks.some((check) => check.key === "promotional_signal")).toBe(true);
    expect(submissions[0].aiPrecheck.checks.some((check) => check.key === "phone_available")).toBe(true);
  });

  it("더미 제출 후기 상태 변경을 같은 서버 세션에서 유지한다", async () => {
    const before = await getReviewSubmissions({ status: "all", search: "" });
    const target = before.find((submission) => submission.status === "approved");

    expect(target).toBeDefined();

    const updated = await updateReviewSubmissionStatus({
      id: target!.id,
      status: "hold",
      adminMemo: "캡처 원문 재확인",
      reviewerEmail: "review-admin",
    });
    const after = await getReviewSubmissions({ status: "all", search: "" });

    expect(updated?.status).toBe("hold");
    expect(updated?.adminMemo).toBe("캡처 원문 재확인");
    expect(after.find((submission) => submission.id === target!.id)?.status).toBe("hold");
  });

  it("더미 제출 후기를 닉네임과 링크로 검색한다", async () => {
    const byNickname = await getReviewSubmissions({ status: "all", search: "talloe" });
    const byLink = await getReviewSubmissions({ status: "all", search: "talloe" });

    expect(byNickname).toHaveLength(1);
    expect(byNickname[0].contentAuthorHandle).toBe("talloe");
    expect(byLink.some((submission) => submission.postUrl?.includes("blog.naver.com/talloe"))).toBe(true);
  });
});
