import type {
  ReviewSubmission,
  ReviewCouponGrantStatus,
  ReviewOperatorDecision,
  ReviewSubmissionStatus,
} from "@/types/review-submission";

type DemoReviewSubmissionSeed =
  Omit<ReviewSubmission, "operatorDecision" | "couponGrantStatus"> &
  Partial<Pick<ReviewSubmission, "operatorDecision" | "couponGrantStatus">>;

function couponGrantStatusFromDecision(
  decision: ReviewOperatorDecision,
): ReviewCouponGrantStatus {
  if (decision === "approved") return "eligible";
  if (decision === "hold") return "hold";
  if (decision === "rejected") return "excluded";
  return "not_decided";
}

function withSeparatedReviewState(submission: DemoReviewSubmissionSeed): ReviewSubmission {
  const operatorDecision = submission.operatorDecision || (
    submission.reviewedAt || submission.reviewerEmail ? submission.status : "pending"
  );

  return {
    ...submission,
    operatorDecision,
    couponGrantStatus: submission.couponGrantStatus || couponGrantStatusFromDecision(operatorDecision),
  };
}

const DEMO_REVIEW_SUBMISSIONS: DemoReviewSubmissionSeed[] = [
  {
    id: "demo-review-001",
    bookingId: "demo-booking-001",
    phone: "01012345678",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/talloe/224291642043",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/minji-feed-1.png",
      "/demo-review-screenshots/minji-feed-2.png",
    ],
    accountName: "talloe",
    contentAuthorId: "naver-talloe",
    contentAuthorHandle: "talloe",
    postedAt: "2026-06-07T09:30:00.000Z",
    contentSummary:
      "네이버 검색 결과에 존재하는 대형 커버링 봉투 수거 후기 URL을 제출한 케이스입니다. 대형폐기물 신고 스티커 없이 대형 봉투로 배출한 내용과 쿠폰 보상 고지가 캡처에 함께 보입니다.",
    extractedText:
      "대형폐기물 신고 스티커 필요 없는 커버링 대형 봉투 수거 후기. 대형폐기물 폐기 방법과 신규가입 혜택을 정리한 공개 네이버 블로그 글입니다.",
    ocrText:
      "대형 커버링 봉투 수거 후기. 대형폐기물 신고 스트레스 없이 배출.",
    urlFetchStatus: "ok",
    fetchedTitle: "대형폐기물 신고 스티커 필요 없는 커버링 대형 봉투 수거 후기 6만원 할인 꿀팁",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: true,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.91,
      reasonCodes: ["PROMOTIONAL_SIGNAL"],
      evidenceSummary:
        "네이버 검색 결과에 존재하는 공개 URL과 PNG 캡처 2장에서 대형 커버링 봉투 이용 후기, 대형폐기물 배출 맥락, 후기 이벤트 쿠폰 보상 고지가 함께 확인됩니다.",
      operatorNextAction: "캡처 원문과 전화번호를 최종 확인한 뒤 수거비 무료 2,500원 쿠폰 지급 대상으로 승인합니다.",
      checks: [
        {
          key: "covering_context",
          label: "커버링 이용 맥락",
          status: "pass",
          evidence: ["네이버 글 제목과 캡처에 커버링 대형 봉투 수거 후기 언급"],
        },
        {
          key: "phone_available",
          label: "전화번호 확보",
          status: "pass",
          evidence: ["01012345678 전화번호로 친구톡/알림톡 발송 가능"],
        },
        {
          key: "screenshot_count",
          label: "PNG 캡처 2장",
          status: "pass",
          evidence: ["검색 결과 캡처와 게시글 캡처 2장 제출"],
        },
        {
          key: "reward_disclosure",
          label: "쿠폰 보상 고지",
          status: "pass",
          evidence: ["후기 이벤트 참여 및 승인 시 쿠폰 보상 문구 확인"],
        },
        {
          key: "promotional_signal",
          label: "홍보성 주의 신호",
          status: "needs_review",
          evidence: ["제목에 6만원 할인 꿀팁 표현이 있어 운영자가 원문 맥락을 확인"],
        },
        {
          key: "duplicate_privacy",
          label: "중복·개인정보",
          status: "pass",
          evidence: ["중복 후보 없음, 전화번호/주소 노출 없음"],
        },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T02:12:00.000Z",
    updatedAt: "2026-06-08T02:12:00.000Z",
    booking: {
      id: "demo-booking-001",
      date: "2026-06-06",
      status: "completed",
      area: "서울 강남구",
      items: [
        { category: "furniture", name: "bookcase", displayName: "작은 책장", price: 18000, quantity: 1 },
        { category: "living", name: "rug", displayName: "러그", price: 9000, quantity: 1 },
      ],
    },
  },
  {
    id: "demo-review-002",
    bookingId: "demo-booking-002",
    phone: "01098765432",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/model_eung/224288180616",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/seojun-story-1.png",
      "/demo-review-screenshots/seojun-story-2.png",
    ],
    accountName: "model_eung",
    contentAuthorId: "naver-model-eung",
    contentAuthorHandle: "model_eung",
    postedAt: "2026-06-07T14:05:00.000Z",
    contentSummary:
      "네이버 검색 결과에 존재하는 자취방 정리 내돈내산 커버링 이용후기를 제출한 케이스입니다. 대형봉투 220L 수령과 수거 신청 맥락은 보이지만, 보상 고지 확인이 필요합니다.",
    extractedText:
      "자취방 정리의 신, 내돈내산 커버링 이용후기. 대형봉투 220L를 신청해 집 정리 물건을 배출한 공개 네이버 블로그 글입니다.",
    ocrText:
      "커버링 대형봉투 220L 도착. 수거 일정 선택 후 배출.",
    urlFetchStatus: "ok",
    fetchedTitle: "자취방 정리의 신, 내돈내산 커버링 이용후기(feat.커버링 수거신청방법)",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: true,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "hold",
      confidence: 0.68,
      reasonCodes: ["REWARD_DISCLOSURE_NEEDS_REVIEW", "ACCOUNT_DATE_NEEDS_REVIEW"],
      evidenceSummary:
        "실제 네이버 공개 URL과 대형봉투 220L 이용 맥락은 확인되지만, 후기 이벤트 쿠폰 보상 고지가 캡처에서 명확하지 않습니다.",
      operatorNextAction: "쿠폰 보상 고지와 계정 일치 근거를 캡처 원문에서 한 번 더 확인합니다.",
      checks: [
        {
          key: "covering_context",
          label: "커버링 이용 맥락",
          status: "pass",
          evidence: ["네이버 글 제목과 캡처에 커버링 대형봉투 220L 언급"],
        },
        {
          key: "phone_available",
          label: "전화번호 확보",
          status: "pass",
          evidence: ["01098765432 전화번호로 친구톡/알림톡 발송 가능"],
        },
        {
          key: "screenshot_count",
          label: "PNG 캡처 2장",
          status: "pass",
          evidence: ["검색 결과 캡처와 게시글 캡처 2장 제출"],
        },
        {
          key: "account_date",
          label: "계정·게시일",
          status: "needs_review",
          evidence: ["공개 URL은 있으나 게시일/계정 캡처 일치 확인 필요"],
        },
        {
          key: "reward_disclosure",
          label: "쿠폰 보상 고지",
          status: "needs_review",
          evidence: ["후기 이벤트 또는 쿠폰 보상 문구가 캡처에 선명하지 않음"],
        },
      ],
    },
    status: "hold",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T03:40:00.000Z",
    updatedAt: "2026-06-08T03:40:00.000Z",
    booking: {
      id: "demo-booking-002",
      date: "2026-06-05",
      status: "completed",
      area: "경기 성남시",
      items: [
        { category: "furniture", name: "chair", displayName: "의자", price: 12000, quantity: 1 },
      ],
    },
  },
  {
    id: "demo-review-003",
    bookingId: "demo-booking-003",
    phone: "01055554444",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/zipssda/224246499516",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/haneul-cafe-1.png",
      "/demo-review-screenshots/haneul-cafe-2.png",
    ],
    accountName: "zipssda",
    contentAuthorId: null,
    contentAuthorHandle: "zipssda",
    postedAt: "2026-06-06T11:20:00.000Z",
    contentSummary:
      "네이버 검색 결과에 존재하는 커버링 대형폐기물 이용 후기입니다. 대형폐기물 전용 봉투 신청과 수거 서비스 시작 맥락이 확인되어 승인 완료 기준 사례로 둡니다.",
    extractedText:
      "커버링 후기, 대형폐기물도 오늘 당장 버릴 수 있어요. 대형폐기물 전용 봉투 신청부터 이용 경험을 설명한 공개 네이버 블로그 글입니다.",
    ocrText: null,
    urlFetchStatus: "ok",
    fetchedTitle: "커버링 후기, 대형폐기물도 오늘 당장 버릴 수 있어요!",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: true,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.88,
      reasonCodes: [],
      evidenceSummary:
        "네이버 공개 URL과 PNG 캡처 2장에서 커버링 대형폐기물 전용 봉투 이용 맥락과 쿠폰 보상 고지가 확인됩니다.",
      operatorNextAction: "이미 승인 완료된 기준 사례입니다. 동일 조건이면 수거비 무료 쿠폰 지급 승인합니다.",
      checks: [
        {
          key: "covering_context",
          label: "커버링 이용 맥락",
          status: "pass",
          evidence: ["네이버 글 제목에 대형폐기물 커버링 후기 언급"],
        },
        {
          key: "phone_available",
          label: "전화번호 확보",
          status: "pass",
          evidence: ["01055554444 전화번호로 친구톡/알림톡 발송 가능"],
        },
        {
          key: "screenshot_count",
          label: "PNG 캡처 2장",
          status: "pass",
          evidence: ["검색 결과 캡처와 게시글 캡처 2장 제출"],
        },
        {
          key: "reward_disclosure",
          label: "쿠폰 보상 고지",
          status: "pass",
          evidence: ["승인 시 쿠폰 지급 문구 확인"],
        },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T01:50:00.000Z",
    updatedAt: "2026-06-08T04:00:00.000Z",
    booking: {
      id: "demo-booking-003",
      date: "2026-06-04",
      status: "payment_completed",
      area: "서울 송파구",
      items: [
        { category: "bedding", name: "blanket", displayName: "이불", price: 7000, quantity: 2 },
      ],
    },
  },
  {
    id: "demo-review-004",
    bookingId: "demo-booking-004",
    phone: "01022223333",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/unglove12/224227072868",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/yujin-band-1.png",
      "/demo-review-screenshots/yujin-band-2.png",
    ],
    accountName: "unglove12",
    contentAuthorId: null,
    contentAuthorHandle: "unglove12",
    postedAt: "2026-06-05T08:00:00.000Z",
    contentSummary:
      "네이버 검색 결과에 존재하는 커버링 쓰레기 수거업체 사용 후기입니다. 커버링 이용 후기는 맞지만 대형폐기물 또는 대형 커버링 봉투 실제 이용 근거가 부족해 반려 처리한 예시입니다.",
    extractedText:
      "커버링 쓰레기 수거업체 사용 후기. 일반 커버링 봉투 이용 중심의 공개 네이버 블로그 글입니다.",
    ocrText:
      "커버링 쓰레기 수거 이용 후기. 대형폐기물 이용 증거 부족.",
    urlFetchStatus: "ok",
    fetchedTitle: "커버링 쓰레기 수거업체 사용 후기",
    duplicateCandidates: [{ id: "demo-review-004-duplicate", reason: "similar_screenshot" }],
    rewardDisclosureConfirmed: false,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "reject",
      confidence: 0.72,
      reasonCodes: ["INSUFFICIENT_EXPERIENCE", "REWARD_DISCLOSURE_MISSING", "DUPLICATE_SCREENSHOT"],
      evidenceSummary:
        "실제 네이버 공개 URL은 있으나 일반 쓰레기 수거 후기 중심이라 대형폐기물 또는 대형 커버링 봉투 이용 근거가 부족하고 쿠폰 보상 고지도 확인되지 않습니다.",
      operatorNextAction: "대형폐기물 이용 확인 불가 사유로 반려하고 수거비 무료 쿠폰 지급 대상에서 제외합니다.",
      checks: [
        {
          key: "covering_context",
          label: "커버링 이용 맥락",
          status: "fail",
          evidence: ["커버링 일반 수거 후기는 보이나 대형폐기물 이용 근거 부족"],
        },
        {
          key: "phone_available",
          label: "전화번호 확보",
          status: "pass",
          evidence: ["01022223333 전화번호로 친구톡/알림톡 발송 가능"],
        },
        {
          key: "screenshot_count",
          label: "PNG 캡처 2장",
          status: "pass",
          evidence: ["검색 결과 캡처와 게시글 캡처 2장 제출"],
        },
        {
          key: "reward_disclosure",
          label: "쿠폰 보상 고지",
          status: "fail",
          evidence: ["후기 이벤트 또는 쿠폰 보상 문구 없음"],
        },
        {
          key: "duplicate_privacy",
          label: "중복·개인정보",
          status: "needs_review",
          evidence: ["유사 캡처 중복 후보 1건"],
        },
      ],
    },
    status: "rejected",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-07T23:30:00.000Z",
    updatedAt: "2026-06-08T04:20:00.000Z",
    booking: {
      id: "demo-booking-004",
      date: "2026-06-03",
      status: "completed",
      area: "인천 연수구",
      items: [
        { category: "etc", name: "misc", displayName: "생활 잡동사니", price: 15000, quantity: 1 },
      ],
    },
  },
  {
    id: "demo-review-005",
    bookingId: "demo-booking-005",
    phone: "01033334444",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/da_lucky/224306294261",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-005-1.png",
      "/demo-review-screenshots/review-005-2.png",
    ],
    accountName: "da_lucky",
    contentAuthorId: "naver-da-lucky",
    contentAuthorHandle: "da_lucky",
    postedAt: "2026-06-04T14:57:00.000Z",
    contentSummary: "대형폐기물 커버링 가격과 실제 이용 후기를 제출한 네이버 블로그 건입니다. 본문 상단에 서비스 제공 고지가 보이고 대형 봉투 사진이 확인됩니다.",
    extractedText: "이사 후 쓰레기 버리기 대형폐기물 커버링 가격 비용 실제후기.",
    ocrText: "대형폐기물 커버링 가격 비용 실제후기. 업체 제공 고지와 대형 봉투 사진 확인.",
    urlFetchStatus: "ok",
    fetchedTitle: "이사 후 쓰레기 버리기 대형폐기물 커버링 가격 비용 실제후기",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: true,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.92,
      reasonCodes: [],
      evidenceSummary: "대형폐기물 후기 제목, 실제 대형 봉투 이미지, 서비스 제공 고지, 전화번호가 모두 확인됩니다.",
      operatorNextAction: "수거비 무료 2,500원 쿠폰 지급 대상으로 승인합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: ["대형폐기물 커버링 가격 비용 실제후기 제목 확인"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01033334444 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "pass", evidence: ["업체 제공 고지 확인"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음, 전화번호/주소 노출 없음"] },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T05:10:00.000Z",
    updatedAt: "2026-06-08T05:10:00.000Z",
    booking: {
      id: "demo-booking-005",
      date: "2026-06-04",
      status: "completed",
      area: "서울 마포구",
      items: [{ category: "bag", name: "large-bag", displayName: "대형 커버링 봉투", price: 2500, quantity: 1 }],
    },
  },
  {
    id: "demo-review-006",
    bookingId: "demo-booking-006",
    phone: "01044445555",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/helmet_koala/224308171045",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-006-1.png",
      "/demo-review-screenshots/review-006-2.png",
    ],
    accountName: "helmet_koala",
    contentAuthorId: "naver-helmet-koala",
    contentAuthorHandle: "helmet_koala",
    postedAt: "2026-06-07T01:20:00.000Z",
    contentSummary: "대형 폐기물 수거 업체 커버링 내돈내산 후기입니다. 실제 대형폐기물 수거 고민과 커버링 이용 맥락은 선명하지만 보상 고지는 보이지 않습니다.",
    extractedText: "[내돈내산] 대형 폐기물 수거 업체 커버링 이용후기.",
    ocrText: "대형폐기물 검색, 커버링 이용 후기. 보상 고지 확인 필요.",
    urlFetchStatus: "ok",
    fetchedTitle: "[내돈내산] 대형 폐기물 수거 업체 커버링 이용후기",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: false,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.84,
      reasonCodes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
      evidenceSummary: "커버링 사용자 후기와 대형폐기물 이용 근거가 확인됩니다. 보상 고지는 승인 필수 조건에서 제외하고 주의 근거로만 표시합니다.",
      operatorNextAction: "승인 처리하되 보상 고지 여부는 캡처 원문에서 한 번 더 확인합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: ["대형 폐기물 수거 업체 커버링 이용후기 제목 확인"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01044445555 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "needs_review", evidence: ["내돈내산 표기, 보상 고지 확인 필요"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음"] },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T05:20:00.000Z",
    updatedAt: "2026-06-08T05:20:00.000Z",
    booking: {
      id: "demo-booking-006",
      date: "2026-06-06",
      status: "completed",
      area: "경기 고양시",
      items: [{ category: "furniture", name: "closet", displayName: "옷장", price: 25000, quantity: 2 }],
    },
  },
  {
    id: "demo-review-007",
    bookingId: "demo-booking-007",
    phone: "01055556666",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/jh00z/224268973891",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-007-1.png",
      "/demo-review-screenshots/review-007-2.png",
    ],
    accountName: "jh00z",
    contentAuthorId: "naver-jh00z",
    contentAuthorHandle: "jh00z",
    postedAt: "2026-04-29T11:16:00.000Z",
    contentSummary: "대전 동구 대형폐기물 스티커 대신 커버링 앱으로 버린 내돈내산 후기입니다. 대형폐기물 맥락은 명확하나 쿠폰 보상 고지가 확인되지 않습니다.",
    extractedText: "대전 동구 대형 폐기물 스티커 대신 커버링 앱 으로 버리기 내돈내산.",
    ocrText: "대형폐기물은 스티커 붙이고 신고하고 날짜 맞추는 과정이 번거롭다는 내용 확인.",
    urlFetchStatus: "ok",
    fetchedTitle: "대전 동구 대형 폐기물 스티커 대신 커버링 앱 으로 버리기 내돈내산(수거 비용, 시간)",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: false,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.84,
      reasonCodes: ["REWARD_DISCLOSURE_NEEDS_REVIEW"],
      evidenceSummary: "커버링 사용자 후기와 대형폐기물 이용 근거가 확인됩니다. 보상 고지는 승인 필수 조건에서 제외하고 주의 근거로만 표시합니다.",
      operatorNextAction: "승인 처리하되 보상 고지 여부는 캡처 원문에서 한 번 더 확인합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: ["대형 폐기물 스티커 대신 커버링 앱 제목 확인"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01055556666 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "needs_review", evidence: ["보상 문구가 캡처에 없음"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음"] },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T05:30:00.000Z",
    updatedAt: "2026-06-08T05:30:00.000Z",
    booking: {
      id: "demo-booking-007",
      date: "2026-04-29",
      status: "completed",
      area: "대전 동구",
      items: [{ category: "furniture", name: "shelf", displayName: "선반", price: 12000, quantity: 1 }],
    },
  },
  {
    id: "demo-review-008",
    bookingId: "demo-booking-008",
    phone: "01066667777",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/huegi0128/224255868941",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-008-1.png",
      "/demo-review-screenshots/review-008-2.png",
    ],
    accountName: "huegi0128",
    contentAuthorId: "naver-huegi0128",
    contentAuthorHandle: "huegi0128",
    postedAt: "2026-04-22T06:40:00.000Z",
    contentSummary: "분리수거 대행 서비스 커버링 내돈내산 후기입니다. 커버링 후기이지만 캡처 기준으로 대형폐기물/대형봉투 실제 이용 근거가 약합니다.",
    extractedText: "분리수거 대행 서비스 커버링 내돈내산 사용 후기.",
    ocrText: "안 쓰는 배개랑 이불, 장난감 등을 버리는 내용이나 대형폐기물 전용 이용 증거는 확인 필요.",
    urlFetchStatus: "ok",
    fetchedTitle: "분리수거 대행 서비스 커버링 내돈내산 사용 후기",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: false,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "reject",
      confidence: 0.69,
      reasonCodes: ["LARGE_WASTE_CONTEXT_WEAK", "REWARD_DISCLOSURE_MISSING"],
      evidenceSummary: "커버링 일반 수거 후기는 보이나 대형폐기물 또는 대형 커버링 봉투 이용 근거와 보상 고지가 부족합니다.",
      operatorNextAction: "대형폐기물 이용 확인 불가 또는 보상 고지 없음 사유로 반려합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "fail", evidence: ["분리수거 대행 중심, 대형폐기물 전용 이용 증거 약함"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01066667777 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "fail", evidence: ["보상 고지 없음"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음"] },
      ],
    },
    status: "rejected",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T05:40:00.000Z",
    updatedAt: "2026-06-08T05:40:00.000Z",
    booking: {
      id: "demo-booking-008",
      date: "2026-04-22",
      status: "completed",
      area: "서울 관악구",
      items: [{ category: "etc", name: "general", displayName: "생활 쓰레기", price: 9000, quantity: 1 }],
    },
  },
  {
    id: "demo-review-009",
    bookingId: "demo-booking-009",
    phone: "01077778888",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/tjdqhfkdbqls/224289811837",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-009-1.png",
      "/demo-review-screenshots/review-009-2.png",
    ],
    accountName: "tjdqhfkdbqls",
    contentAuthorId: "naver-tjdqhfkdbqls",
    contentAuthorHandle: "tjdqhfkdbqls",
    postedAt: "2026-05-19T07:30:00.000Z",
    contentSummary: "커버링 220L 대형 쓰레기봉투 후기입니다. 소정 비용 제공 고지와 대형봉투 이용 맥락이 모두 보입니다.",
    extractedText: "소형 폐기물 버리는 법 커버링 220L 대형 쓰레기봉투로 간편하게 해결.",
    ocrText: "본 포스팅은 소정의 비용을 받고 작성되었습니다. 220L 대형 쓰레기봉투 이용 후기.",
    urlFetchStatus: "ok",
    fetchedTitle: "소형 폐기물 버리는 법 커버링 220L 대형 쓰레기봉투로 간편하게 해결",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: true,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "approve",
      confidence: 0.9,
      reasonCodes: [],
      evidenceSummary: "220L 대형 봉투 이용 맥락, 보상 고지, 전화번호가 확인되어 지급 조건을 충족합니다.",
      operatorNextAction: "수거비 무료 2,500원 쿠폰 지급 대상으로 승인합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "pass", evidence: ["커버링 220L 대형 쓰레기봉투 제목 확인"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01077778888 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "pass", evidence: ["소정 비용 제공 고지 확인"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음"] },
      ],
    },
    status: "approved",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T05:50:00.000Z",
    updatedAt: "2026-06-08T05:50:00.000Z",
    booking: {
      id: "demo-booking-009",
      date: "2026-05-19",
      status: "completed",
      area: "경기 수원시",
      items: [{ category: "bag", name: "220l-bag", displayName: "220L 대형 봉투", price: 2500, quantity: 1 }],
    },
  },
  {
    id: "demo-review-010",
    bookingId: "demo-booking-010",
    phone: "01088889999",
    channel: "naver_blog",
    channelType: "url_and_screenshot",
    postUrl: "https://blog.naver.com/son1234675-/224212087683",
    canonicalUrl: null,
    screenshotUrls: [
      "/demo-review-screenshots/review-010-1.png",
      "/demo-review-screenshots/review-010-2.png",
    ],
    accountName: "son1234675-",
    contentAuthorId: "naver-son1234675",
    contentAuthorHandle: "son1234675-",
    postedAt: "2026-03-11T06:16:00.000Z",
    contentSummary: "음식물 대형 쓰레기 처리 대행 앱 이용 후기입니다. 커버링 후기는 맞지만 음식물/일반 쓰레기 중심이라 대형폐기물 쿠폰 지급 조건과 다릅니다.",
    extractedText: "커버링 음식물 대형 쓰레기 처리 대행 앱 이용 후기 사용 방법 금액.",
    ocrText: "음식물 대형 쓰레기 처리 대행 앱 이용 후기. 대형폐기물 전용 후기 아님.",
    urlFetchStatus: "ok",
    fetchedTitle: "커버링 음식물 대형 쓰레기 처리 대행 앱 이용 후기 사용 방법 금액",
    duplicateCandidates: [],
    rewardDisclosureConfirmed: false,
    privacyConfirmed: true,
    aiPrecheck: {
      recommendation: "reject",
      confidence: 0.74,
      reasonCodes: ["NOT_LARGE_WASTE_REVIEW", "REWARD_DISCLOSURE_MISSING"],
      evidenceSummary: "음식물/일반 쓰레기 처리 후기라 대형폐기물 또는 대형봉투 수거비 무료 쿠폰 지급 조건과 맞지 않습니다.",
      operatorNextAction: "대형폐기물 외 서비스 사유로 반려합니다.",
      checks: [
        { key: "covering_context", label: "커버링 이용 맥락", status: "fail", evidence: ["음식물 대형 쓰레기 처리 중심, 대형폐기물 후기 아님"] },
        { key: "phone_available", label: "전화번호 확보", status: "pass", evidence: ["01088889999 전화번호로 친구톡/알림톡 발송 가능"] },
        { key: "screenshot_count", label: "PNG 캡처 2장", status: "pass", evidence: ["모바일 본문 캡처 2장 제출"] },
        { key: "reward_disclosure", label: "쿠폰 보상 고지", status: "fail", evidence: ["후기 이벤트 보상 고지 없음"] },
        { key: "duplicate_privacy", label: "중복·개인정보", status: "pass", evidence: ["중복 후보 없음"] },
      ],
    },
    status: "rejected",
    couponAmount: 2500,
    rejectReason: null,
    adminMemo: "",
    reviewerEmail: null,
    reviewedAt: null,
    createdAt: "2026-06-08T06:00:00.000Z",
    updatedAt: "2026-06-08T06:00:00.000Z",
    booking: {
      id: "demo-booking-010",
      date: "2026-03-11",
      status: "completed",
      area: "서울 영등포구",
      items: [{ category: "etc", name: "food-waste", displayName: "음식물/일반 쓰레기", price: 8000, quantity: 1 }],
    },
  },
];

let demoReviewSubmissions = cloneSubmissions(DEMO_REVIEW_SUBMISSIONS);

function cloneSubmissions(submissions: DemoReviewSubmissionSeed[]): ReviewSubmission[] {
  return JSON.parse(JSON.stringify(submissions.map(withSeparatedReviewState))) as ReviewSubmission[];
}

function cloneSubmission(submission: ReviewSubmission): ReviewSubmission {
  return JSON.parse(JSON.stringify(submission)) as ReviewSubmission;
}

function matchesSearch(submission: ReviewSubmission, search?: string) {
  const query = search?.trim().toLowerCase();
  if (!query) return true;

  return [
    submission.phone,
    submission.postUrl,
    submission.contentSummary,
    submission.contentAuthorHandle,
    submission.accountName,
    submission.contentAuthorId,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(query));
}

export function getDemoReviewSubmissions(params: {
  status?: string;
  search?: string;
}) {
  return demoReviewSubmissions
    .filter((submission) => !params.status || params.status === "all" || submission.status === params.status)
    .filter((submission) => matchesSearch(submission, params.search))
    .map(cloneSubmission);
}

export function updateDemoReviewSubmissionStatus(params: {
  id: string;
  status: Exclude<ReviewSubmissionStatus, "pending">;
  rejectReason?: string;
  adminMemo?: string;
  reviewerEmail: string;
}) {
  const index = demoReviewSubmissions.findIndex((submission) => submission.id === params.id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated: ReviewSubmission = {
    ...demoReviewSubmissions[index],
    status: params.status,
    operatorDecision: params.status,
    couponGrantStatus: couponGrantStatusFromDecision(params.status),
    rejectReason: params.status === "rejected" ? params.rejectReason || "반려 사유 없음" : null,
    adminMemo: params.adminMemo?.trim() || "",
    reviewerEmail: params.reviewerEmail,
    reviewedAt: now,
    updatedAt: now,
  };

  demoReviewSubmissions[index] = updated;
  return cloneSubmission(updated);
}

export function resetDemoReviewSubmissionsForTest() {
  demoReviewSubmissions = cloneSubmissions(DEMO_REVIEW_SUBMISSIONS);
}
