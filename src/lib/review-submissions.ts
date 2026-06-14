import { supabase } from "@/lib/supabase";
import {
  getDemoReviewSubmissions,
  updateDemoReviewSubmissionStatus,
} from "@/lib/review-submission-demo";
import type { Booking } from "@/types/booking";
import type {
  ReviewAiCheck,
  ReviewAiPrecheck,
  ReviewAiRecommendation,
  ReviewChannel,
  ReviewChannelType,
  ReviewCouponGrantStatus,
  ReviewOperatorDecision,
  ReviewSubmission,
  ReviewSubmissionStatus,
  ReviewUrlFetchStatus,
} from "@/types/review-submission";

const COMPLETED_STATUSES = new Set<Booking["status"]>([
  "completed",
  "payment_requested",
  "payment_completed",
]);

const AI_CHECK_LABELS: Record<string, string> = {
  booking_completed: "수거 완료 주문",
  phone_available: "전화번호 확보",
  official_source_excluded: "공식 블로그 제외",
  covering_context: "커버링 이용 맥락",
  actual_large_waste_experience: "대형폐기물 이용 내용",
  channel_verifiable: "URL 또는 캡처 확인",
  reward_disclosure: "보상 제공 표시",
  reward_disclosure_present: "보상 제공 표시",
  promotional_signal: "홍보성 주의 신호",
  privacy_redacted: "개인정보 가림",
  duplicate_url_or_screenshot: "중복 제출 여부",
};

const ADVISORY_AI_CHECK_KEYS = new Set([
  "reward_disclosure",
  "reward_disclosure_present",
  "promotional_signal",
]);

const ADVISORY_REASON_CODES = new Set([
  "REWARD_DISCLOSURE_NEEDS_REVIEW",
  "REWARD_DISCLOSURE_MISSING",
  "PROMOTIONAL_SIGNAL",
]);

const OFFICIAL_REVIEW_ACCOUNT_IDS = new Set([
  "coveringspot",
  "covering20",
]);

const REQUIRED_PROMOTION_CHECK_KEYS = [
  "official_source_excluded",
  "covering_context",
  "actual_large_waste_experience",
] as const;
const REVIEW_SUBMISSION_FETCH_BATCH_SIZE = 1000;
const REVIEW_SUBMISSION_DEFAULT_PAGE_SIZE = 50;
const REVIEW_SUBMISSION_MAX_PAGE_SIZE = 200;

const COVERING_TERMS = ["커버링", "covering"];
const REVIEW_TERMS = ["후기", "내돈내산", "이용후기", "솔직 후기", "사용 후기", "수거 후기"];
const STRONG_LARGE_WASTE_TERMS = [
  "대형폐기물",
  "대형 폐기물",
  "대형봉투",
  "대형 봉투",
  "대형 쓰레기봉투",
  "220L",
  "220리터",
];
const BROAD_LARGE_WASTE_ITEM_TERMS = [
  "매트리스",
  "침대",
  "장롱",
  "장농",
  "행거",
  "냉장고",
  "소형가전",
  "이불",
  "카시트",
  "가구",
  "가전",
];
const LARGE_WASTE_ACTION_TERMS = [
  "버림",
  "버리",
  "버렸",
  "수거",
  "폐기",
  "처리",
  "신청",
  "배출",
  "봉투",
  "스티커",
  "대청소",
  "이사",
];
const REWARD_DISCLOSURE_TERMS = [
  "소정의 비용",
  "소정 비용",
  "제공받",
  "제공 받",
  "협찬",
  "체험단",
  "원고료",
  "업체 제공",
  "서비스 제공",
  "후기 이벤트",
  "쿠폰 보상",
];
const PROMOTIONAL_TERMS = [
  "추천코드",
  "초대코드",
  "친구초대",
  "할인코드",
  "할인 코드",
  "할인 꿀팁",
  "신규가입 혜택",
];

interface BookingJoinRow {
  id: string;
  date: string;
  status: Booking["status"];
  items: Booking["items"];
  area: string;
}

interface ReviewSubmissionRow {
  id: string;
  booking_id: string;
  phone: string;
  channel: ReviewChannel;
  channel_type: ReviewChannelType | null;
  post_url: string | null;
  canonical_url: string | null;
  screenshot_urls: string[] | null;
  account_name: string | null;
  content_author_id: string | null;
  content_author_handle: string | null;
  posted_at: string | null;
  content_summary: string;
  extracted_text: string | null;
  ocr_text: string | null;
  url_fetch_status: ReviewUrlFetchStatus | null;
  fetched_title: string | null;
  duplicate_candidates: unknown[] | null;
  reward_disclosure_confirmed: boolean;
  privacy_confirmed: boolean;
  ai_recommendation: ReviewAiRecommendation | null;
  ai_confidence: number | null;
  ai_reason_codes: string[] | null;
  ai_checks: Record<string, unknown> | ReviewAiCheck[] | null;
  ai_evidence_summary: string | null;
  ai_operator_next_action: string | null;
  status: ReviewSubmissionStatus;
  operator_decision?: ReviewOperatorDecision | null;
  coupon_grant_status?: ReviewCouponGrantStatus | null;
  coupon_amount: number;
  reject_reason: string | null;
  admin_memo: string | null;
  reviewer_email: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  bookings?: BookingJoinRow | BookingJoinRow[] | null;
}

function normalizeOptionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizePage(value?: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value || 1)) : 1;
}

function normalizeLimit(value?: number) {
  if (!Number.isFinite(value)) return REVIEW_SUBMISSION_DEFAULT_PAGE_SIZE;
  return Math.min(
    Math.max(1, Math.floor(value || REVIEW_SUBMISSION_DEFAULT_PAGE_SIZE)),
    REVIEW_SUBMISSION_MAX_PAGE_SIZE,
  );
}

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeAccountId(value: string | null | undefined) {
  return normalizeOptionalText(value || undefined)?.replace(/^naver-/i, "").toLowerCase() || null;
}

function getNaverBlogIdFromUrl(value: string | null) {
  if (!value) return null;
  const match = value.match(/(?:^|\/\/)(?:m\.)?blog\.naver\.com\/([^/?#]+)/i);
  return normalizeAccountId(match?.[1]);
}

function isOfficialReviewSource(row: ReviewSubmissionRow) {
  const candidates = [
    normalizeAccountId(row.content_author_handle),
    normalizeAccountId(row.account_name),
    normalizeAccountId(row.content_author_id),
    getNaverBlogIdFromUrl(row.post_url),
    getNaverBlogIdFromUrl(row.canonical_url),
  ].filter((value): value is string => Boolean(value));

  return candidates.some((value) => OFFICIAL_REVIEW_ACCOUNT_IDS.has(value));
}

function getReviewTextSources(row: ReviewSubmissionRow) {
  return [
    { label: "제목", text: row.fetched_title },
    { label: "제출 내용", text: row.content_summary },
    { label: "링크 원문", text: row.extracted_text },
    { label: "캡처 내용", text: row.ocr_text },
  ].flatMap((source) => {
    const text = normalizeOptionalText(source.text || undefined);
    return text ? [{ label: source.label, text }] : [];
  });
}

function findEvidenceSnippet(
  sources: ReturnType<typeof getReviewTextSources>,
  terms: string[],
) {
  for (const source of sources) {
    const cleanText = source.text.replace(/\s+/g, " ").trim();
    const lowerText = normalizeSearchText(cleanText);
    for (const term of terms) {
      const index = lowerText.indexOf(term.toLowerCase());
      if (index === -1) continue;

      const start = Math.max(0, index - 24);
      const end = Math.min(cleanText.length, index + term.length + 48);
      const prefix = start > 0 ? "..." : "";
      const suffix = end < cleanText.length ? "..." : "";
      return `${source.label}: ${prefix}${cleanText.slice(start, end)}${suffix}`;
    }
  }
  return null;
}

function findCombinedEvidenceSnippet(
  sources: ReturnType<typeof getReviewTextSources>,
  itemTerms: string[],
  actionTerms: string[],
) {
  for (const source of sources) {
    const cleanText = source.text.replace(/\s+/g, " ").trim();
    const lowerText = normalizeSearchText(cleanText);

    for (const itemTerm of itemTerms) {
      const itemIndex = lowerText.indexOf(itemTerm.toLowerCase());
      if (itemIndex === -1) continue;

      for (const actionTerm of actionTerms) {
        const actionIndex = lowerText.indexOf(actionTerm.toLowerCase());
        if (actionIndex === -1 || Math.abs(itemIndex - actionIndex) > 90) continue;

        const start = Math.max(0, Math.min(itemIndex, actionIndex) - 24);
        const end = Math.min(cleanText.length, Math.max(itemIndex + itemTerm.length, actionIndex + actionTerm.length) + 48);
        const prefix = start > 0 ? "..." : "";
        const suffix = end < cleanText.length ? "..." : "";
        return `${source.label}: ${prefix}${cleanText.slice(start, end)}${suffix}`;
      }
    }
  }
  return null;
}

function isAdvisoryAiCheck(check: ReviewAiCheck) {
  return ADVISORY_AI_CHECK_KEYS.has(check.key);
}

function isAdvisoryReasonCode(reasonCode: string) {
  return ADVISORY_REASON_CODES.has(reasonCode);
}

function reasonCodeFromCheck(check: ReviewAiCheck) {
  if (check.key === "reward_disclosure" || check.key === "reward_disclosure_present") {
    return "REWARD_DISCLOSURE_NEEDS_REVIEW";
  }
  if (check.key === "promotional_signal") return "PROMOTIONAL_SIGNAL";
  return check.key.toUpperCase();
}

function hasRequiredPromotionChecks(checks: ReviewAiCheck[]) {
  return REQUIRED_PROMOTION_CHECK_KEYS.every((key) => (
    checks.some((check) => check.key === key && check.status === "pass")
  ));
}

function hasSupabaseRuntime() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function hasReviewSubmissionPersistence() {
  return hasSupabaseRuntime();
}

function getCheckStatus(pass: boolean): ReviewAiCheck["status"] {
  return pass ? "pass" : "fail";
}

function statusFromAiRecommendation(
  recommendation: ReviewAiRecommendation,
): Exclude<ReviewSubmissionStatus, "pending"> {
  if (recommendation === "approve") return "approved";
  if (recommendation === "hold") return "hold";
  return "rejected";
}

function couponGrantStatusFromDecision(
  decision: ReviewOperatorDecision,
): ReviewCouponGrantStatus {
  if (decision === "approved") return "eligible";
  if (decision === "hold") return "hold";
  if (decision === "rejected") return "excluded";
  return "not_decided";
}

function getStoredAiRecommendation(row: ReviewSubmissionRow) {
  if (!row.ai_recommendation || (row.ai_confidence ?? 0) <= 0) {
    return null;
  }
  return row.ai_recommendation;
}

function normalizeChecks(rawChecks: ReviewSubmissionRow["ai_checks"]): ReviewAiCheck[] {
  if (Array.isArray(rawChecks)) {
    return rawChecks.map((check) => ({
      key: check.key,
      label: check.label || AI_CHECK_LABELS[check.key] || check.key,
      status: check.status,
      evidence: check.evidence || [],
    }));
  }

  if (!rawChecks || typeof rawChecks !== "object") return [];

  return Object.entries(rawChecks).map(([key, value]) => {
    const record = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return {
      key,
      label: typeof record.label === "string" ? record.label : AI_CHECK_LABELS[key] || key,
      status: (
        record.status === "pass" ||
        record.status === "fail" ||
        record.status === "needs_review"
          ? record.status
          : "needs_review"
      ) as ReviewAiCheck["status"],
      evidence: Array.isArray(record.evidence)
        ? record.evidence.filter((item): item is string => typeof item === "string")
        : [],
    };
  });
}

function buildFallbackAiPrecheck(
  row: ReviewSubmissionRow,
  bookingRow?: BookingJoinRow | null,
): ReviewAiPrecheck {
  const bookingCompleted = Boolean(bookingRow && COMPLETED_STATUSES.has(bookingRow.status));
  const phoneDigits = row.phone.replace(/\D/g, "");
  const phoneAvailable = /^01\d{8,9}$/.test(phoneDigits);
  const hasEvidence = Boolean(row.post_url || (row.screenshot_urls?.length || 0) > 0);
  const textSources = getReviewTextSources(row);
  const coveringSnippet = findEvidenceSnippet(textSources, COVERING_TERMS);
  const reviewSnippet = findEvidenceSnippet(textSources, REVIEW_TERMS);
  const largeWasteSnippet =
    findEvidenceSnippet(textSources, STRONG_LARGE_WASTE_TERMS) ||
    findCombinedEvidenceSnippet(textSources, BROAD_LARGE_WASTE_ITEM_TERMS, LARGE_WASTE_ACTION_TERMS);
  const rewardDisclosureSnippet = findEvidenceSnippet(textSources, REWARD_DISCLOSURE_TERMS);
  const promotionalSnippet = findEvidenceSnippet(textSources, PROMOTIONAL_TERMS);
  const officialSource = isOfficialReviewSource(row);
  const hasExperience = Boolean(coveringSnippet && reviewSnippet && largeWasteSnippet);
  const rewardDisclosure = row.reward_disclosure_confirmed || Boolean(rewardDisclosureSnippet);
  const privacyRedacted = row.privacy_confirmed;
  const duplicateClear = (row.duplicate_candidates || []).length === 0;

  const checks: ReviewAiCheck[] = [
    {
      key: "official_source_excluded",
      label: AI_CHECK_LABELS.official_source_excluded,
      status: getCheckStatus(!officialSource),
      evidence: officialSource
        ? ["커버링 공식/운영 블로그 계정으로 보여 사용자 제출 후기 대상 아님"]
        : ["공식/운영 블로그 제외 대상 아님"],
    },
    {
      key: "covering_context",
      label: AI_CHECK_LABELS.covering_context,
      status: getCheckStatus(Boolean(coveringSnippet)),
      evidence: coveringSnippet ? [coveringSnippet] : ["커버링 언급 확인 필요"],
    },
    {
      key: "booking_completed",
      label: AI_CHECK_LABELS.booking_completed,
      status: getCheckStatus(bookingCompleted),
      evidence: bookingCompleted ? [`주문 상태: ${bookingRow?.status}`] : ["수거 완료 주문 확인 필요"],
    },
    {
      key: "phone_available",
      label: AI_CHECK_LABELS.phone_available,
      status: getCheckStatus(phoneAvailable),
      evidence: phoneAvailable ? ["친구톡/알림톡 발송 가능한 전화번호 있음"] : ["쿠폰 안내 발송용 전화번호 필요"],
    },
    {
      key: "actual_large_waste_experience",
      label: AI_CHECK_LABELS.actual_large_waste_experience,
      status: getCheckStatus(hasExperience),
      evidence: hasExperience
        ? [
            largeWasteSnippet!,
            reviewSnippet!,
          ]
        : ["커버링 사용자 후기와 대형폐기물/대형봉투 이용 문장 확인 필요"],
    },
    {
      key: "channel_verifiable",
      label: AI_CHECK_LABELS.channel_verifiable,
      status: getCheckStatus(hasEvidence),
      evidence: hasEvidence ? ["URL 또는 캡처 제출됨"] : ["URL/캡처 없음"],
    },
    {
      key: "reward_disclosure",
      label: AI_CHECK_LABELS.reward_disclosure,
      status: rewardDisclosure ? "pass" : "needs_review",
      evidence: rewardDisclosure
        ? [rewardDisclosureSnippet || "제출자가 보상 표시 확인"]
        : ["보상 고지는 승인 필수 조건이 아니며 표시 여부만 참고"],
    },
    ...(promotionalSnippet
      ? [{
          key: "promotional_signal",
          label: AI_CHECK_LABELS.promotional_signal,
          status: "needs_review" as const,
          evidence: [promotionalSnippet],
        }]
      : []),
    {
      key: "privacy_redacted",
      label: AI_CHECK_LABELS.privacy_redacted,
      status: getCheckStatus(privacyRedacted),
      evidence: privacyRedacted ? ["제출자가 개인정보 가림 확인"] : ["개인정보 가림 확인 필요"],
    },
    {
      key: "duplicate_url_or_screenshot",
      label: AI_CHECK_LABELS.duplicate_url_or_screenshot,
      status: getCheckStatus(duplicateClear),
      evidence: duplicateClear ? ["중복 후보 없음"] : [`중복 후보 ${(row.duplicate_candidates || []).length}건`],
    },
  ];

  const failed = checks.filter((check) => !isAdvisoryAiCheck(check) && check.status === "fail");
  const advisoryWarnings = checks.filter((check) => isAdvisoryAiCheck(check) && check.status !== "pass");
  const recommendation: ReviewAiRecommendation = failed.length === 0 ? "approve" : "reject";

  return {
    recommendation,
    confidence: failed.length === 0 ? (advisoryWarnings.length > 0 ? 0.86 : 0.91) : 0.64,
    reasonCodes: [
      ...failed.map((check) => check.key.toUpperCase()),
      ...advisoryWarnings.map(reasonCodeFromCheck),
    ],
    evidenceSummary: failed.length === 0
      ? advisoryWarnings.length > 0
        ? "커버링 사용자 후기와 대형폐기물/대형봉투 이용 근거는 확인됩니다. 보상/홍보성 신호는 참고용 주의 근거로 표시합니다."
        : "커버링 사용자 후기와 대형폐기물/대형봉투 이용 근거가 확인됩니다."
      : `${failed.map((check) => check.label).join(", ")} 확인이 필요합니다.`,
    operatorNextAction: recommendation === "approve"
      ? "운영자가 근거 문장과 전화번호를 확인한 뒤 수거비 무료 쿠폰 지급 대상으로 승인합니다."
      : "부족한 증거가 있어 쿠폰 지급 대상에서 제외합니다.",
    checks,
  };
}

function rowToAiPrecheck(
  row: ReviewSubmissionRow,
  bookingRow?: BookingJoinRow | null,
): ReviewAiPrecheck {
  const fallback = buildFallbackAiPrecheck(row, bookingRow);
  const storedRecommendation = getStoredAiRecommendation(row);
  const normalizedChecks = normalizeChecks(row.ai_checks);

  if (!storedRecommendation) {
    return {
      ...fallback,
      recommendation: "hold",
      confidence: 0,
      reasonCodes: ["AI_DECISION_MISSING"],
      evidenceSummary: "AI 자동 검수 결과가 저장되지 않아 자동 승인하지 않습니다.",
      operatorNextAction: "AI 검수를 다시 실행하거나 운영자가 제출 캡처와 URL을 확인합니다.",
      checks: normalizedChecks.length > 0 ? normalizedChecks : fallback.checks,
    };
  }

  const checks = normalizedChecks.length > 0 ? normalizedChecks : fallback.checks;
  const blockingFailures = checks.filter((check) => !isAdvisoryAiCheck(check) && check.status === "fail");
  const advisoryWarnings = checks.filter((check) => isAdvisoryAiCheck(check) && check.status !== "pass");
  const storedReasonCodes = row.ai_reason_codes || [];
  const onlyAdvisoryReasonCodes = (
    normalizedChecks.length > 0 &&
    storedReasonCodes.length > 0 &&
    storedReasonCodes.every(isAdvisoryReasonCode)
  );
  const promotedFromAdvisoryReject = (
    storedRecommendation !== "approve" &&
    blockingFailures.length === 0 &&
    hasRequiredPromotionChecks(checks) &&
    onlyAdvisoryReasonCodes
  );
  const recommendation: ReviewAiRecommendation = blockingFailures.length > 0
    ? "reject"
    : promotedFromAdvisoryReject
      ? "approve"
      : storedRecommendation;
  const reasonCodes = storedReasonCodes.length > 0
    ? storedReasonCodes
    : advisoryWarnings.map(reasonCodeFromCheck);

  return {
    recommendation,
    confidence: promotedFromAdvisoryReject ? Math.max(row.ai_confidence!, 0.84) : row.ai_confidence!,
    reasonCodes,
    evidenceSummary: promotedFromAdvisoryReject
      ? "커버링 사용자 후기와 대형폐기물/대형봉투 이용 근거가 확인됩니다. 보상 고지는 승인 필수 조건에서 제외하고 주의 근거로만 표시합니다."
      : row.ai_evidence_summary || "",
    operatorNextAction: promotedFromAdvisoryReject
      ? "승인 처리하되 보상/홍보성 주의 신호가 있으면 캡처 원문에서 한 번 더 확인합니다."
      : row.ai_operator_next_action || "",
    checks,
  };
}

function rowToReviewSubmission(row: ReviewSubmissionRow): ReviewSubmission {
  const bookingRow = Array.isArray(row.bookings) ? row.bookings[0] : row.bookings;
  const storedRecommendation = getStoredAiRecommendation(row);
  const aiPrecheck = rowToAiPrecheck(row, bookingRow);
  const operatorReviewed = Boolean(row.reviewed_at || row.reviewer_email);
  const operatorDecision = row.operator_decision || (operatorReviewed ? row.status : "pending");
  const status = !operatorReviewed && storedRecommendation
    ? statusFromAiRecommendation(aiPrecheck.recommendation)
    : operatorDecision;
  const couponGrantStatus = row.coupon_grant_status || couponGrantStatusFromDecision(operatorDecision);

  return {
    id: row.id,
    bookingId: row.booking_id,
    phone: row.phone,
    channel: row.channel,
    channelType: row.channel_type || "url_or_screenshot",
    postUrl: row.post_url,
    canonicalUrl: row.canonical_url,
    screenshotUrls: row.screenshot_urls || [],
    accountName: row.account_name,
    contentAuthorId: row.content_author_id,
    contentAuthorHandle: row.content_author_handle,
    postedAt: row.posted_at,
    contentSummary: row.content_summary,
    extractedText: row.extracted_text,
    ocrText: row.ocr_text,
    urlFetchStatus: row.url_fetch_status || "not_fetched",
    fetchedTitle: row.fetched_title,
    duplicateCandidates: row.duplicate_candidates || [],
    rewardDisclosureConfirmed: row.reward_disclosure_confirmed,
    privacyConfirmed: row.privacy_confirmed,
    aiPrecheck,
    status,
    operatorDecision,
    couponGrantStatus,
    couponAmount: row.coupon_amount,
    rejectReason: row.reject_reason,
    adminMemo: row.admin_memo || "",
    reviewerEmail: row.reviewer_email,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    booking: bookingRow
      ? {
          id: bookingRow.id,
          date: bookingRow.date,
          status: bookingRow.status,
          items: bookingRow.items,
          area: bookingRow.area,
        }
      : null,
  };
}

function sanitizeReviewSearch(search?: string) {
  const sanitized = search?.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s\-_.@:/]/g, "").trim();
  return sanitized || "";
}

function isReviewSubmissionStatus(value?: string): value is ReviewSubmissionStatus {
  return value === "pending" || value === "approved" || value === "rejected" || value === "hold";
}

function filterReviewSubmissionsByStatus(
  submissions: ReviewSubmission[],
  status?: string,
) {
  if (!status || status === "all") return submissions;
  if (!isReviewSubmissionStatus(status)) return [];
  return submissions.filter((submission) => submission.status === status);
}

function paginateReviewSubmissions(
  submissions: ReviewSubmission[],
  page: number,
  limit: number,
) {
  const from = (page - 1) * limit;
  return submissions.slice(from, from + limit);
}

function applyReviewSubmissionSearch<Query extends { or: (filters: string) => Query }>(
  query: Query,
  search?: string,
) {
  const sanitized = sanitizeReviewSearch(search);
  if (!sanitized) return query;

  return query.or(
    `phone.ilike.%${sanitized}%,post_url.ilike.%${sanitized}%,account_name.ilike.%${sanitized}%,content_author_handle.ilike.%${sanitized}%,content_author_id.ilike.%${sanitized}%`,
  );
}

async function fetchReviewSubmissionRows(params: {
  search?: string;
  from?: number;
  to?: number;
}) {
  let query = supabase
    .from("review_submissions")
    .select("*, bookings(id, date, status, items, area)")
    .order("created_at", { ascending: false });

  query = applyReviewSubmissionSearch(query, params.search);

  if (typeof params.from === "number" && typeof params.to === "number") {
    query = query.range(params.from, params.to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ReviewSubmissionRow[];
}

async function fetchAllReviewSubmissionRows(params: {
  search?: string;
}) {
  const rows: ReviewSubmissionRow[] = [];

  for (let from = 0; ; from += REVIEW_SUBMISSION_FETCH_BATCH_SIZE) {
    const batch = await fetchReviewSubmissionRows({
      search: params.search,
      from,
      to: from + REVIEW_SUBMISSION_FETCH_BATCH_SIZE - 1,
    });
    rows.push(...batch);
    if (batch.length < REVIEW_SUBMISSION_FETCH_BATCH_SIZE) break;
  }

  return rows;
}

export async function getAllReviewSubmissions(params: {
  search?: string;
} = {}) {
  if (!hasSupabaseRuntime()) {
    return getDemoReviewSubmissions({ status: "all", search: params.search });
  }

  const rows = await fetchAllReviewSubmissionRows(params);
  return rows.map(rowToReviewSubmission);
}

export async function getReviewSubmissions(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = normalizePage(params.page);
  const limit = normalizeLimit(params.limit);

  if (!hasSupabaseRuntime()) {
    const submissions = getDemoReviewSubmissions({ status: "all", search: params.search });
    return paginateReviewSubmissions(
      filterReviewSubmissionsByStatus(submissions, params.status),
      page,
      limit,
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (!params.status || params.status === "all") {
    const rows = await fetchReviewSubmissionRows({ search: params.search, from, to });
    return rows.map(rowToReviewSubmission);
  }

  const submissions = await getAllReviewSubmissions({ search: params.search });
  return paginateReviewSubmissions(
    filterReviewSubmissionsByStatus(submissions, params.status),
    page,
    limit,
  );
}

export async function updateReviewSubmissionStatus(params: {
  id: string;
  status: Exclude<ReviewSubmissionStatus, "pending">;
  rejectReason?: string;
  adminMemo?: string;
  reviewerEmail: string;
}): Promise<ReviewSubmission | null> {
  if (!hasSupabaseRuntime()) {
    return updateDemoReviewSubmissionStatus(params);
  }

  const { data, error } = await supabase
    .from("review_submissions")
    .update({
      status: params.status,
      operator_decision: params.status,
      coupon_grant_status: couponGrantStatusFromDecision(params.status),
      reject_reason: normalizeOptionalText(params.rejectReason),
      admin_memo: params.adminMemo?.trim() || "",
      reviewer_email: params.reviewerEmail,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*, bookings(id, date, status, items, area)")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return rowToReviewSubmission(data as ReviewSubmissionRow);
}
