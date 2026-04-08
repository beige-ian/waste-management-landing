"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { track } from "@/lib/analytics";

/* 에어브릿지 대시보드에서 트래킹 링크 생성 후 교체 */
const AIRBRIDGE_DOWNLOAD_URL = "https://abr.ge/coveringprod";

function buildDownloadUrl(code: string) {
  return `${AIRBRIDGE_DOWNLOAD_URL}?referral_code=${encodeURIComponent(code)}&channel=referral_bridge`;
}

function GiftIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12V22H4V12" />
      <path d="M22 7H2V12H22V7Z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" />
      <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" />
    </svg>
  );
}

function InviteBridgeContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";
  const [copied, setCopied] = useState(false);

  const displayName = name || "친구";

  useEffect(() => {
    if (code) {
      track("referral_bridge_view", { code, name: name || undefined });
    }
  }, [code, name]);

  const handleCopyCode = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    track("referral_bridge_cta", { cta_type: "copy_code", code });
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleDownload = useCallback(() => {
    track("referral_bridge_cta", { cta_type: "app_download", code });
  }, [code]);

  return (
    <div className="min-h-dvh bg-brand-50 flex flex-col items-center justify-center px-md py-3xl">
      <div className="w-full max-w-[360px] bg-bg rounded-lg shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-primary pt-3xl pb-xl px-xl text-center">
          <div className="mx-auto mb-lg flex h-[72px] w-[72px] items-center justify-center rounded-max bg-white/20">
            <GiftIcon />
          </div>
          <p className="mb-2xs text-[14px] font-medium text-white/80">
            {displayName}님이 보낸
          </p>
          <h1 className="text-[24px] font-bold leading-tight text-white">
            집정리 3만원 지원금
          </h1>
        </div>

        {/* 본문 */}
        <div className="px-xl py-2xl">
          <p className="mb-xl text-center text-[14px] leading-relaxed text-text-sub">
            커버링 앱에서 대형폐기물 수거를
            <br />
            <span className="font-semibold text-primary">3만원 할인</span>받고
            이용하세요
          </p>

          {/* 코드 표시 */}
          {code && (
            <div className="mb-lg rounded-md bg-bg-warm p-md">
              <p className="mb-xs text-center text-[12px] text-text-muted">
                초대코드
              </p>
              <p className="text-center text-[20px] font-bold tracking-wider text-text-primary">
                {code}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-sm">
            {code && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full rounded-md border border-primary py-[14px] text-[15px] font-semibold text-primary transition-colors duration-fast hover:bg-primary-tint active:bg-primary-tint"
              >
                {copied ? "복사 완료!" : "초대코드 복사"}
              </button>
            )}
            <a
              href={code ? buildDownloadUrl(code) : AIRBRIDGE_DOWNLOAD_URL}
              onClick={handleDownload}
              className="block w-full rounded-md bg-primary py-[14px] text-center text-[15px] font-semibold text-white transition-colors duration-fast hover:bg-primary-dark active:bg-primary-dark"
            >
              앱 다운로드
            </a>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="px-xl pb-xl">
          <p className="text-center text-[11px] leading-relaxed text-text-muted">
            앱 설치 후 초대코드를 입력하면
            <br />첫 수거 시 3만원 할인이 적용됩니다
          </p>
        </div>
      </div>

      {/* 브랜딩 */}
      <p className="mt-xl text-[12px] text-text-muted">커버링 방문수거</p>
    </div>
  );
}

export function InviteBridge() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-brand-50">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
        </div>
      }
    >
      <InviteBridgeContent />
    </Suspense>
  );
}
