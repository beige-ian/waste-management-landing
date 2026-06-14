"use client";

/* eslint-disable @next/next/no-img-element -- 제출 PNG URL은 운영 환경에서 Supabase와 외부 채널 URL이 섞인다. */

import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  countSubmittedEvidence,
  getAiCouponDecision,
  getAiReviewFlagChecks,
  getCouponGrantDisplay,
  getPrimaryReviewScreenshotUrls,
  getReviewActionOptions,
  getReviewLoadErrorDisplay,
  getReviewSubmitterLabel,
  getReviewStatusDisplay,
  type AiReviewMetrics,
} from "@/lib/review-submission-display";
import {
  REVIEW_CHANNEL_LABELS,
  type ReviewSubmission,
  type ReviewSubmissionStatus,
} from "@/types/review-submission";

const TABS: { key: "all" | ReviewSubmissionStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기" },
  { key: "approved", label: "승인" },
  { key: "hold", label: "보류" },
  { key: "rejected", label: "반려" },
];

const STATUS_STYLES: Record<ReviewSubmissionStatus, string> = {
  pending: "bg-semantic-orange-tint text-semantic-orange",
  approved: "bg-semantic-green-tint text-semantic-green",
  hold: "bg-primary-tint text-primary",
  rejected: "bg-semantic-red-tint text-semantic-red",
};

const COUPON_DECISION_STYLES: Record<ReviewSubmission["aiPrecheck"]["recommendation"], string> = {
  approve: "bg-semantic-green-tint text-semantic-green",
  hold: "bg-semantic-orange-tint text-semantic-orange",
  reject: "bg-semantic-red-tint text-semantic-red",
};

const COUPON_GRANT_STYLES: Record<ReturnType<typeof getCouponGrantDisplay>["tone"], string> = {
  pending: "bg-bg-warm text-text-sub",
  eligible: "bg-semantic-green-tint text-semantic-green",
  hold: "bg-semantic-orange-tint text-semantic-orange",
  excluded: "bg-semantic-red-tint text-semantic-red",
};

const ACTION_BUTTON_STYLES: Record<Exclude<ReviewSubmissionStatus, "pending">, {
  selected: string;
  idle: string;
}> = {
  approved: {
    selected: "bg-semantic-green text-white",
    idle: "border border-semantic-green/30 bg-bg text-semantic-green",
  },
  hold: {
    selected: "bg-primary text-white",
    idle: "border border-primary/30 bg-bg text-primary",
  },
  rejected: {
    selected: "bg-semantic-red text-white",
    idle: "border border-semantic-red/30 bg-bg text-semantic-red",
  },
};

const CHECK_STATUS_LABELS = {
  pass: "확인",
  fail: "부족",
  needs_review: "주의",
};

const CHECK_STATUS_STYLES = {
  pass: "bg-semantic-green-tint text-semantic-green",
  fail: "bg-semantic-red-tint text-semantic-red",
  needs_review: "bg-semantic-orange-tint text-semantic-orange",
};

const URL_FETCH_LABELS = {
  not_fetched: "확인 전",
  ok: "확인됨",
  inaccessible: "접근 불가",
  login_required: "로그인 필요",
  deleted: "삭제됨",
  error: "확인 오류",
};

const REJECT_REASONS = [
  "대형폐기물 이용 확인 불가",
  "비공개 또는 접근 불가",
  "캡처 정보 부족",
  "보상 표시 없음",
  "실제 이용 내용 부족",
  "개인정보 노출",
  "동일 제출 반복",
  "대형폐기물 외 서비스",
  "기타",
];

function shortId(id: string) {
  return id.slice(0, 8);
}

function formatDateTime(value: string | null) {
  if (!value) return "시간 없음";
  return new Date(value).toLocaleString("ko-KR");
}

function formatCouponAmount(value: number) {
  const amount = `${Math.max(0, value).toLocaleString("ko-KR")}원`;
  return value === 2500 ? `수거비 무료 ${amount}` : amount;
}

function formatPercent(value: number | undefined) {
  return `${Math.round(Math.max(0, value || 0) * 100)}%`;
}

export default function AdminReviewsPage() {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [aiReviewMetrics, setAiReviewMetrics] = useState<AiReviewMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | ReviewSubmissionStatus>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const loadErrorDisplay = getReviewLoadErrorDisplay(loadError);
  const currentEvidenceCount = submissions.reduce(
    (total, submission) => total + countSubmittedEvidence(submission),
    0,
  );

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams({
        status: activeTab,
        search,
      });
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/review-submissions?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "조회 실패");
      setSubmissions(json.submissions || []);
      setCounts(json.counts || {});
      setAiReviewMetrics(json.aiReviewMetrics || null);
    } catch (e) {
      setSubmissions([]);
      setCounts({});
      setAiReviewMetrics(null);
      setLoadError(e instanceof Error ? e.message : "조회 실패");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function updateStatus(
    submission: ReviewSubmission,
    status: Exclude<ReviewSubmissionStatus, "pending">,
  ) {
    let rejectReason = "";
    let adminMemo = "";

    if (status === "rejected") {
      rejectReason =
        window.prompt(`반려 사유를 입력하세요.\n예: ${REJECT_REASONS.join(", ")}`) || "";
      if (!rejectReason.trim()) return;
    }

    if (status === "hold") {
      adminMemo = window.prompt("보류 메모를 입력하세요.") || "";
    }

    if (status === "approved") {
      const submitterLabel = getReviewSubmitterLabel(submission);
      const ok = window.confirm(
        `${submitterLabel} 제출 후기를 ${formatCouponAmount(submission.couponAmount)} 쿠폰 지급 대상으로 표시할까요?\n실제 쿠폰 발급은 별도 처리입니다.`,
      );
      if (!ok) return;
    }

    setUpdatingId(submission.id);
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/review-submissions/${submission.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status, rejectReason, adminMemo }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "상태 변경 실패");
      await fetchSubmissions();
    } catch (e) {
      alert(e instanceof Error ? e.message : "상태 변경 실패");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-bg-warm">
      <div className="sticky top-0 z-10 border-b border-border-light bg-bg/90 backdrop-blur-[20px]">
        <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-primary">ENG-2887</p>
            <h1 className="text-lg font-bold">대형폐기물 제출 후기</h1>
          </div>
          <button
            onClick={fetchSubmissions}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            새로고침
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[72rem] px-4 py-5">
        <section className="mb-4 grid gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-border-light bg-bg px-4 py-3">
            <p className="text-xs text-text-sub">전체 제출</p>
            <p className="mt-1 text-2xl font-bold">{counts.all || 0}건</p>
          </div>
          <div className="rounded-lg border border-border-light bg-bg px-4 py-3">
            <p className="text-xs text-text-sub">운영자 미처리</p>
            <p className="mt-1 text-2xl font-bold">{counts.needsReview || 0}건</p>
          </div>
          <div className="rounded-lg border border-border-light bg-bg px-4 py-3">
            <p className="text-xs text-text-sub">처리됨</p>
            <p className="mt-1 text-2xl font-bold">{counts.processed || 0}건</p>
          </div>
          <div className="rounded-lg border border-border-light bg-bg px-4 py-3">
            <p className="text-xs text-text-sub">현재 화면 링크/캡처</p>
            <p className="mt-1 text-2xl font-bold">{currentEvidenceCount}개</p>
          </div>
        </section>

        <section className="mb-4 rounded-lg border border-border-light bg-bg px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">AI 검수 성공률</p>
              <p className="mt-1 text-2xl font-bold">
                {formatPercent(aiReviewMetrics?.reviewSuccessRate)}
                <span className="ml-2 text-xs font-semibold text-text-muted">
                  목표 {formatPercent(aiReviewMetrics?.targetReviewSuccessRate || 0.99)}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-text-sub">
              <span className="rounded-full bg-bg-warm px-3 py-1.5">
                승인 권장 {formatPercent(aiReviewMetrics?.couponApprovalRecommendationRate)}
              </span>
              <span className="rounded-full bg-bg-warm px-3 py-1.5">
                반려 권장 {formatPercent(aiReviewMetrics?.rejectionRecommendationRate)}
              </span>
              <span className="rounded-full bg-bg-warm px-3 py-1.5">
                미결론 {formatPercent(aiReviewMetrics?.inconclusiveRate)}
              </span>
              <span className="rounded-full bg-bg-warm px-3 py-1.5">
                체크 통과 {formatPercent(aiReviewMetrics?.checkPassRate)}
              </span>
            </div>
          </div>
        </section>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="닉네임/ID, 전화번호, 후기 링크 검색"
            className="h-11 w-full rounded-md border border-border bg-bg px-4 text-sm outline-none transition-all focus:border-brand-400 focus:ring-1 focus:ring-brand-400 sm:flex-1"
          />
          <button
            onClick={fetchSubmissions}
            className="h-11 rounded-md border border-border-light bg-bg px-4 text-sm font-semibold text-text-primary"
          >
            검색
          </button>
        </div>

        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-[0_2px_8px_rgba(26,163,255,0.3)]"
                    : "border border-border-light bg-bg text-text-sub"
                }`}
              >
                {tab.label} <span className={active ? "text-white/75" : "text-text-muted"}>{counts[tab.key] || 0}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : loadErrorDisplay ? (
          <div className="rounded-lg bg-bg px-4 py-16 text-center">
            <p className="text-base font-bold text-text-primary">{loadErrorDisplay.title}</p>
            <p className="mt-2 text-sm text-text-muted">{loadErrorDisplay.description}</p>
            <button
              onClick={() => {
                if (loadErrorDisplay.action === "login") {
                  window.location.href = "/admin";
                  return;
                }
                fetchSubmissions();
              }}
              className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {loadErrorDisplay.actionLabel}
            </button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-lg bg-bg py-16 text-center text-sm text-text-muted">
            제출된 후기가 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => {
              const screenshotUrls = getPrimaryReviewScreenshotUrls(submission);
              const couponDecision = getAiCouponDecision(submission);
              const couponGrant = getCouponGrantDisplay(submission);
              const submitterLabel = getReviewSubmitterLabel(submission);
              const statusDisplay = getReviewStatusDisplay(submission);
              const flagChecks = getAiReviewFlagChecks(submission);
              const actionOptions = getReviewActionOptions(submission);

              return (
                <article key={submission.id} className="overflow-hidden rounded-lg border border-border-light bg-bg shadow-sm">
                  <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border-light px-4 py-3 sm:px-5">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[submission.status]}`}>
                          {statusDisplay.label}
                        </span>
                        <span className="rounded-full bg-bg-warm px-2.5 py-1 text-xs font-semibold text-text-sub">
                          {REVIEW_CHANNEL_LABELS[submission.channel]}
                        </span>
                        <span className="font-mono text-xs text-text-muted">#{shortId(submission.id)}</span>
                      </div>
                      <h2 className="text-base font-bold">
                        {submitterLabel} · {submission.phone}
                      </h2>
                    </div>
                    <p className="text-right text-xs text-text-muted">
                      제출 {formatDateTime(submission.createdAt)}
                    </p>
                  </header>

                  <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
                    <section className="px-4 py-4 sm:px-5">
                      {screenshotUrls.length > 0 ? (
                        <div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {screenshotUrls.map((url, index) => (
                              <a
                                key={url}
                                href={submission.postUrl || url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block overflow-hidden rounded-md border border-border-light bg-bg-warm"
                              >
                                <div className="aspect-[9/16] w-full">
                                  <img
                                    src={url}
                                    alt={`${submitterLabel} 제출 PNG 캡처 ${index + 1}`}
                                    className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                                  />
                                </div>
                                <div className="flex items-center justify-between border-t border-border-light px-3 py-2 text-xs">
                                  <span className="font-semibold text-text-sub">PNG 캡처 {index + 1}</span>
                                  <span className="text-text-muted">{submission.postUrl ? "제출 URL 열기" : "원본 열기"}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
                            <span>제출 캡처 {submission.screenshotUrls.length}장</span>
                            {submission.screenshotUrls.length > screenshotUrls.length && (
                              <span>추가 캡처 {submission.screenshotUrls.length - screenshotUrls.length}장</span>
                            )}
                            {submission.postUrl && <span>링크 1개</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-md bg-bg-warm px-3 py-8 text-center text-sm text-text-muted">
                          제출된 PNG 캡처가 없습니다
                        </div>
                      )}

                    </section>

                    <aside className="border-t border-border-light px-4 py-4 sm:px-5 lg:border-l lg:border-t-0">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-text-muted">후기 링크</p>
                          {submission.postUrl ? (
                            <div className="mt-2">
                              {submission.fetchedTitle && (
                                <p className="mb-1 text-sm font-semibold text-text-primary">
                                  {submission.fetchedTitle}
                                </p>
                              )}
                              <a
                                href={submission.postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block break-all text-sm text-primary underline-offset-2 hover:underline"
                              >
                                {submission.postUrl}
                              </a>
                              <p className="mt-1 text-xs text-text-muted">
                                링크 {URL_FETCH_LABELS[submission.urlFetchStatus]}
                              </p>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-text-muted">없음</p>
                          )}
                        </div>

                        {(submission.contentAuthorHandle || submission.contentAuthorId || submission.accountName || submission.postedAt) && (
                          <div>
                            <p className="text-xs font-semibold text-text-muted">게시 계정</p>
                            <div className="mt-2 space-y-1 text-sm text-text-sub">
                              {(submission.contentAuthorHandle || submission.accountName) && (
                                <p>{submission.contentAuthorHandle || submission.accountName}</p>
                              )}
                              {submission.contentAuthorId && (
                                <p className="font-mono text-xs">ID {submission.contentAuthorId}</p>
                              )}
                              {submission.postedAt && (
                                <p className="text-xs text-text-muted">게시 {formatDateTime(submission.postedAt)}</p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="border-t border-border-light pt-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-text-muted">AI 판정</p>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${COUPON_DECISION_STYLES[couponDecision.recommendation]}`}>
                              {couponDecision.label}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-text-primary">
                            {couponDecision.amountLabel}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-text-muted">
                            신뢰도 {couponDecision.confidenceLabel}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-text-sub">
                            {couponDecision.summary}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-text-muted">
                            {couponDecision.nextAction}
                          </p>
                          <div className={`mt-3 rounded-md px-3 py-2 ${COUPON_GRANT_STYLES[couponGrant.tone]}`}>
                            <p className="text-xs font-bold">쿠폰 상태: {couponGrant.label}</p>
                            <p className="mt-1 text-xs leading-5 opacity-80">{couponGrant.description}</p>
                          </div>
                          {flagChecks.length > 0 && (
                            <div className="mt-3 rounded-md bg-semantic-orange-tint px-3 py-2">
                              <p className="text-xs font-bold text-semantic-orange">주의 신호</p>
                              <ul className="mt-1 space-y-1 text-xs leading-5 text-semantic-orange">
                                {flagChecks.map((check) => (
                                  <li key={check.key}>
                                    {check.label}: {check.evidence[0] || "확인 필요"}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {submission.aiPrecheck.checks.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-semibold text-text-muted">AI 근거</p>
                              {submission.aiPrecheck.checks.map((check) => (
                                <div key={check.key} className="rounded-md border border-border-light bg-bg-warm px-3 py-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs font-bold text-text-primary">{check.label}</p>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${CHECK_STATUS_STYLES[check.status]}`}>
                                      {CHECK_STATUS_LABELS[check.status]}
                                    </span>
                                  </div>
                                  {check.evidence.length > 0 && (
                                    <ul className="mt-1 space-y-1 text-xs leading-5 text-text-muted">
                                      {check.evidence.map((evidence) => (
                                        <li key={evidence}>{evidence}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {submission.rejectReason && (
                          <p className="rounded-md bg-semantic-red-tint px-3 py-2 text-sm text-semantic-red">
                            반려 사유: {submission.rejectReason}
                          </p>
                        )}
                        {submission.adminMemo && (
                          <p className="rounded-md bg-primary-bg px-3 py-2 text-sm text-primary">
                            운영 메모: {submission.adminMemo}
                          </p>
                        )}
                      </div>
                    </aside>
                  </div>

                  <footer className="flex flex-wrap items-center gap-2 border-t border-border-light px-4 py-3 sm:px-5">
                    <p className="mr-1 text-xs font-semibold text-text-muted">운영자 최종 판단</p>
                    {actionOptions.map((option) => (
                      <button
                        key={option.status}
                        onClick={() => updateStatus(submission, option.status)}
                        disabled={updatingId === submission.id || option.disabled}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-opacity disabled:cursor-default disabled:opacity-70 ${
                          option.selected
                            ? ACTION_BUTTON_STYLES[option.status].selected
                            : ACTION_BUTTON_STYLES[option.status].idle
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
