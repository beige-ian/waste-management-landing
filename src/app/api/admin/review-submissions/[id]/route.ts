import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/app/api/admin/auth/route";
import { ReviewSubmissionAdminUpdateSchema } from "@/lib/validation";
import {
  hasReviewSubmissionPersistence,
  updateReviewSubmissionStatus,
} from "@/lib/review-submissions";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (hasReviewSubmissionPersistence() && !validateToken(req)) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = ReviewSubmissionAdminUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const submission = await updateReviewSubmissionStatus({
      id,
      status: parsed.data.status,
      rejectReason: parsed.data.rejectReason || undefined,
      adminMemo: parsed.data.adminMemo || undefined,
      reviewerEmail: "review-admin",
    });

    if (!submission) {
      return NextResponse.json(
        { error: "제출 건을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ submission });
  } catch (e) {
    console.error("[admin/review-submissions/[id]/PUT]", e);
    return NextResponse.json(
      { error: "상태 변경 실패" },
      { status: 500 },
    );
  }
}
