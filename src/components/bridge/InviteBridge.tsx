"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";
import { KakaoIcon } from "@/components/ui/KakaoIcon";

/* 에어브릿지 대시보드에서 트래킹 링크 생성 후 교체 */
const AIRBRIDGE_DOWNLOAD_URL = "https://abr.ge/coveringprod";
const AIRBRIDGE_DEEPLINK = "coveringapp://";
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const BRIDGE_PATH = "/bridge/invite";

function buildDownloadUrl(code?: string) {
  const url = new URL(AIRBRIDGE_DOWNLOAD_URL);
  url.searchParams.set("airbridge_deeplink", AIRBRIDGE_DEEPLINK);
  url.searchParams.set("channel", "referral_bridge");

  if (code) {
    url.searchParams.set("referral_code", code);
  }

  return url.toString();
}

function buildShareUrl(code: string, name: string) {
  const params = new URLSearchParams({ code, ...(name ? { name } : {}), channel: "kakao_share" });
  return `${window.location.origin}${BRIDGE_PATH}?${params.toString()}`;
}

function buildShareImageUrl() {
  return `${window.location.origin}/images/logo.png`;
}

function GiftIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
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
  const channel = searchParams.get("channel") || "";
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayName = name || "친구";

  useEffect(() => {
    if (code) {
      track("referral_bridge_view", { code, name: name || undefined, channel: channel || undefined });
    }
  }, [code, name, channel]);

  const handleKakaoLoad = useCallback(() => {
    if (typeof window !== "undefined" && window.Kakao && KAKAO_JS_KEY) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      setKakaoReady(true);
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    if (!code || !window.Kakao?.Share) return;
    const shareUrl = buildShareUrl(code, name);
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${displayName}님이 보낸 집정리 3만원 지원금`,
        description: "커버링 앱 첫 수거 시 3만원 할인",
        imageUrl: buildShareImageUrl(),
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: "할인받으러 가기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
    track("referral_bridge_cta", { cta_type: "kakao_share", code });
  }, [code, name, displayName]);

  const handleCopyCode = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
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

  const fadeIn = (delay: string) =>
    `transition-opacity duration-500 ${delay} ${isMounted ? "opacity-100" : "opacity-0"}`;

  return (
    <div className="min-h-dvh bg-[#EEF2F6] flex items-center justify-center px-4 py-10">
      {KAKAO_JS_KEY && (
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          onLoad={handleKakaoLoad}
        />
      )}
      <div className="w-full max-w-[360px] rounded-[32px] bg-white overflow-hidden">
        {/* [A] Hero */}
        <div className={fadeIn("")}>
          <div className="bg-gradient-to-b from-[#E5F4FF] via-[#B2DFFF] to-[#80CAFF] pt-10 pb-8 px-6 text-center relative overflow-hidden">
            <div className="absolute w-32 h-32 top-[-20px] left-[-40px] rounded-full bg-white/20 blur-xl" />
            <div className="absolute w-24 h-24 bottom-[-30px] right-[-40px] rounded-full bg-white/20 blur-xl" />
            <div className="relative w-[72px] h-[72px] rounded-full bg-white/30 flex items-center justify-center mx-auto mb-4">
              <GiftIcon />
            </div>
            <p className="relative text-sm font-medium text-[#1565A0] mb-1">
              {displayName}님이 보낸
            </p>
            <h1 className="relative text-[28px] font-bold text-[#1A3A5C] leading-tight">
              집정리 3만원 지원금
            </h1>
          </div>
        </div>

        {/* [B] Benefit Card */}
        <div className={`${fadeIn("delay-100")} p-5`}>
          <div className="bg-gradient-to-r from-[#DDF0FF] to-[#BEE3FF] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 rounded-full bg-[#1AA3FF] flex items-center justify-center">
              <span className="text-white text-[13px] font-bold text-center leading-tight">
                3만원
              </span>
            </div>
            <p className="text-[15px] font-semibold text-[#1A3A5C] leading-snug">
              커버링 앱 첫 수거 시
              <br />
              할인 적용
            </p>
          </div>
        </div>

        {/* [C] Code Section */}
        {code && (
          <div className={`${fadeIn("delay-200")} px-5 pb-4`}>
            <span className="text-[11px] text-[#8A9BB0] mb-2 block">
              초대코드
            </span>
            <div className="flex items-center justify-between bg-[#F0F7FF] rounded-xl px-4 py-3">
              <p className="text-[28px] font-bold tracking-[0.15em] text-[#1A3A5C]">
                {code}
              </p>
              {copied ? (
                <div className="bg-[#E8F8F0] rounded-lg px-3 py-1 text-[13px] font-medium text-[#10B981] shrink-0">
                  복사 완료!
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[13px] font-medium text-[#1AA3FF] shrink-0"
                >
                  복사
                </button>
              )}
            </div>
          </div>
        )}

        {/* [D] CTA */}
        <div className={`${fadeIn("delay-300")} px-5 ${kakaoReady && code ? "pb-3" : "pb-6"}`}>
          <a
            href={buildDownloadUrl(code)}
            onClick={handleDownload}
            className="block w-full bg-[#1AA3FF] text-white rounded-2xl py-4 text-center text-[16px] font-bold active:scale-[0.97] transition-transform duration-150"
          >
            앱 다운로드하고 할인받기
          </a>
        </div>

        {/* [D-2] Kakao Share */}
        {kakaoReady && code && (
          <div className={`${fadeIn("delay-350")} px-5 pb-6`}>
            <button
              type="button"
              onClick={handleKakaoShare}
              className="flex items-center justify-center gap-2 w-full bg-[#FEE500] text-[#191919] rounded-2xl py-4 text-[16px] font-bold active:scale-[0.97] transition-transform duration-150"
            >
              <KakaoIcon size={20} />
              카카오톡으로 공유하기
            </button>
          </div>
        )}

        {/* [E] Footer */}
        <div className={`${fadeIn("delay-400")} pb-5 text-center`}>
          <p className="text-[11px] text-[#A0B0BF]">커버링 방문수거</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#EEF2F6] px-4 py-10">
      <div className="w-full max-w-[360px] animate-pulse">
        <div className="rounded-[32px] bg-white overflow-hidden">
          <div className="bg-gray-200 pt-10 pb-8 px-6">
            <div className="h-[72px] w-[72px] rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="h-4 w-24 bg-gray-300 rounded mx-auto mb-2" />
            <div className="h-8 w-48 bg-gray-300 rounded mx-auto" />
          </div>
          <div className="p-5 space-y-4">
            <div className="h-[96px] bg-gray-200 rounded-2xl" />
            <div className="h-[74px] bg-gray-200 rounded-xl" />
            <div className="h-[56px] bg-gray-200 rounded-2xl" />
          </div>
          <div className="pb-5">
            <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function InviteBridge() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <InviteBridgeContent />
    </Suspense>
  );
}
