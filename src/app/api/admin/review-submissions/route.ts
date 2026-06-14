import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/app/api/admin/auth/route";
import {
  countSubmittedEvidence,
  getAiReviewMetrics,
} from "@/lib/review-submission-display";
import {
  getAllReviewSubmissions,
  getReviewSubmissions,
  hasReviewSubmissionPersistence,
} from "@/lib/review-submissions";

const REVIEW_STATUS_FILTERS = new Set(["all", "pending", "approved", "rejected", "hold"]);

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value || "");
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : fallback;
}

export async function GET(req: NextRequest) {
  try {
    if (hasReviewSubmissionPersistence() && !validateToken(req)) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const status = req.nextUrl.searchParams.get("status") || "all";
    if (!REVIEW_STATUS_FILTERS.has(status)) {
      return NextResponse.json(
        { error: "상태 필터가 올바르지 않습니다" },
        { status: 400 },
      );
    }

    const search = req.nextUrl.searchParams.get("search") || "";
    const page = parsePositiveInt(req.nextUrl.searchParams.get("page"), 1);
    const limit = Math.min(
      parsePositiveInt(req.nextUrl.searchParams.get("limit"), 50),
      200,
    );
    const submissions = await getReviewSubmissions({ status, search, page, limit });
    const countSubmissions = await getAllReviewSubmissions({ search });

    const counts: Record<string, number> = {
      all: countSubmissions.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      hold: 0,
      needsReview: 0,
      processed: 0,
      evidence: 0,
    };

    for (const submission of countSubmissions) {
      counts[submission.status] = (counts[submission.status] || 0) + 1;
      if (submission.reviewedAt || submission.reviewerEmail) {
        counts.processed += 1;
      } else {
        counts.needsReview += 1;
      }
      counts.evidence += countSubmittedEvidence(submission);
    }
    const aiReviewMetrics = getAiReviewMetrics(countSubmissions);

    return NextResponse.json({ submissions, counts, aiReviewMetrics });
  } catch (e) {
    console.error("[admin/review-submissions/GET]", e);
    return NextResponse.json(
      { error: "조회 실패" },
      { status: 500 },
    );
  }
}
