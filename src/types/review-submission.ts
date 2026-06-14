import type { Booking } from "@/types/booking";

export type ReviewSubmissionStatus = "pending" | "approved" | "rejected" | "hold";

export type ReviewOperatorDecision = ReviewSubmissionStatus;

export type ReviewCouponGrantStatus =
  | "not_decided"
  | "eligible"
  | "hold"
  | "excluded"
  | "issued";

export type ReviewChannelType =
  | "url"
  | "screenshot"
  | "url_and_screenshot"
  | "url_or_screenshot";

export type ReviewUrlFetchStatus =
  | "not_fetched"
  | "ok"
  | "inaccessible"
  | "login_required"
  | "deleted"
  | "error";

export type ReviewAiRecommendation = "approve" | "hold" | "reject";

export type ReviewAiCheckStatus = "pass" | "fail" | "needs_review";

export type ReviewChannel =
  | "naver_blog"
  | "naver_cafe"
  | "daum_cafe"
  | "band"
  | "instagram_story"
  | "instagram_feed"
  | "instagram_reels"
  | "tiktok"
  | "other";

export interface ReviewAiCheck {
  key: string;
  label: string;
  status: ReviewAiCheckStatus;
  evidence: string[];
}

export interface ReviewAiPrecheck {
  recommendation: ReviewAiRecommendation;
  confidence: number;
  reasonCodes: string[];
  evidenceSummary: string;
  operatorNextAction: string;
  checks: ReviewAiCheck[];
}

export interface ReviewSubmission {
  id: string;
  bookingId: string;
  phone: string;
  channel: ReviewChannel;
  channelType: ReviewChannelType;
  postUrl: string | null;
  canonicalUrl: string | null;
  screenshotUrls: string[];
  accountName: string | null;
  contentAuthorId: string | null;
  contentAuthorHandle: string | null;
  postedAt: string | null;
  contentSummary: string;
  extractedText: string | null;
  ocrText: string | null;
  urlFetchStatus: ReviewUrlFetchStatus;
  fetchedTitle: string | null;
  duplicateCandidates: unknown[];
  rewardDisclosureConfirmed: boolean;
  privacyConfirmed: boolean;
  aiPrecheck: ReviewAiPrecheck;
  status: ReviewSubmissionStatus;
  operatorDecision: ReviewOperatorDecision;
  couponGrantStatus: ReviewCouponGrantStatus;
  couponAmount: number;
  rejectReason: string | null;
  adminMemo: string;
  reviewerEmail: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: Pick<Booking, "id" | "date" | "status" | "items" | "area"> | null;
}

export const REVIEW_CHANNEL_LABELS: Record<ReviewChannel, string> = {
  naver_blog: "네이버 블로그",
  naver_cafe: "네이버 카페",
  daum_cafe: "다음 카페",
  band: "밴드",
  instagram_story: "인스타그램 스토리",
  instagram_feed: "인스타그램 피드",
  instagram_reels: "인스타그램 릴스",
  tiktok: "틱톡",
  other: "기타",
};
