type EventName =
  | "page_view"
  | "cta_click"
  | "coveringspt_landing_click"
  | "carousel_interact"
  | "price_tab_select"
  | "faq_open"
  | "compare_section_viewed"
  | "scroll_depth"
  | "booking_start"
  | "booking_step_complete"
  | "booking_item_select"
  | "booking_photo_upload"
  | "booking_submit"
  | "booking_complete"
  | "booking_manage_view"
  | "booking_cancel"
  | "quote_preview"
  | "referral_bridge_view"
  | "referral_bridge_cta";

interface EventProps {
  cta_click: { location: "hero" | "price" | "floating" | "bottom" | "nav" };
  coveringspt_landing_click: {
    location: "bottom";
    airbridge_client_id?: string;
    airbridge_event_uuid?: string;
    airbridge_channel?: string;
    airbridge_campaign?: string;
    airbridge_ad_group?: string;
    airbridge_ad_creative?: string;
    airbridge_routing_short_id?: string;
    mixpanel_distinct_id?: string;
    utm_source?: string;
    utm_campaign?: string;
  };
  carousel_interact: {
    type: "scroll" | "arrow" | "dot";
    direction?: "left" | "right";
  };
  price_tab_select: { item: string };
  faq_open: { question: string; index: number };
  scroll_depth: { depth: 25 | 50 | 75 | 100 };
  compare_section_viewed: Record<string, never>;
  page_view: { variant?: string };
  booking_start: Record<string, never>;
  booking_step_complete: { step: number; stepName: string };
  booking_item_select: { category: string; name: string; price: number };
  booking_photo_upload: { count: number };
  booking_submit: { itemCount: number; estimatedTotal: number };
  booking_complete: { bookingId: string };
  booking_manage_view: Record<string, never>;
  booking_cancel: { bookingId: string; reason?: string };
  quote_preview: { itemCount: number; total: number };
  referral_bridge_view: { code: string; name?: string };
  referral_bridge_cta: { cta_type: "copy_code" | "app_download"; code: string };
}

declare global {
  interface Window {
    mixpanel?: {
      track: (event: string, props?: object) => void;
      identify?: (distinctId: string) => void;
      register?: (props: Record<string, unknown>) => void;
    };
    airbridge?: {
      events: { send: (event: string, data?: object) => void };
    };
    gtag?: (...args: unknown[]) => void;
  }
}

const BRIDGE_MIXPANEL_EVENT = "[CLICK] CoveringsptLanding";
const BRIDGE_LOCATION = "bottom" as const;

function getExperimentVariant(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const result: Record<string, string> = {};
  const matches = document.cookie.matchAll(/ab_([^=]+)=([^;]+)/g);
  for (const match of matches) {
    result[`experiment_${match[1]}`] = match[2];
  }
  return result;
}

function getBridgeQueryValue(
  params: URLSearchParams,
  key: string
): string | undefined {
  const directValue = params.get(key);
  if (directValue) return directValue;

  const nestedReferrer = params.get("airbridge_referrer");
  if (!nestedReferrer) return undefined;

  const nestedValue = new URLSearchParams(nestedReferrer).get(key);
  return nestedValue || undefined;
}

function getBridgeTrackingProps(): EventProps["coveringspt_landing_click"] {
  if (typeof window === "undefined") {
    return { location: BRIDGE_LOCATION };
  }

  const params = new URLSearchParams(window.location.search);
  const airbridgeClientId = getBridgeQueryValue(params, "client_id");

  return {
    location: BRIDGE_LOCATION,
    airbridge_client_id: airbridgeClientId,
    airbridge_event_uuid: getBridgeQueryValue(params, "event_uuid"),
    airbridge_channel: getBridgeQueryValue(params, "channel"),
    airbridge_campaign:
      getBridgeQueryValue(params, "campaign") || params.get("utm_campaign") || undefined,
    airbridge_ad_group: getBridgeQueryValue(params, "ad_group"),
    airbridge_ad_creative: getBridgeQueryValue(params, "ad_creative"),
    airbridge_routing_short_id: getBridgeQueryValue(params, "routing_short_id"),
    mixpanel_distinct_id:
      params.get("mixpanel_distinct_id") ||
      params.get("distinct_id") ||
      undefined,
    utm_source: params.get("utm_source") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

function buildProps(properties?: Record<string, unknown>) {
  return {
    ...properties,
    ...getExperimentVariant(),
    timestamp: Date.now(),
    url: window.location.href,
  };
}

export function syncBridgeTrackingIdentity() {
  if (typeof window === "undefined" || !window.mixpanel) return;

  const bridgeProps = getBridgeTrackingProps();
  const hasBridgeContext = Object.entries(bridgeProps).some(
    ([key, value]) => key !== "location" && Boolean(value)
  );
  if (!hasBridgeContext) return;

  window.mixpanel.register?.(bridgeProps);

  if (bridgeProps.mixpanel_distinct_id) {
    window.mixpanel.identify?.(bridgeProps.mixpanel_distinct_id);
  }
}

export function track<T extends EventName>(
  event: T,
  properties?: T extends keyof EventProps ? EventProps[T] : never
) {
  if (typeof window === "undefined") return;

  const props = buildProps(properties as Record<string, unknown> | undefined);
  const mixpanelEventName =
    event === "coveringspt_landing_click"
      ? BRIDGE_MIXPANEL_EVENT
      : `[Spot] ${event}`;

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track(mixpanelEventName, props);
  }

  // Airbridge
  if (window.airbridge) {
    window.airbridge.events.send(event, { customAttributes: props });
  }

  // GA4
  if (window.gtag) {
    window.gtag("event", event, props);
  }
}

export function trackCoveringsptLandingClick() {
  syncBridgeTrackingIdentity();
  track("coveringspt_landing_click", getBridgeTrackingProps());
}
