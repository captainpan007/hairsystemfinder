type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: {
      track?: (eventName: string, payload?: AnalyticsPayload) => void;
    };
  }
}

export function trackEvent(eventName: string, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') return;
  window.umami?.track?.(eventName, payload);
}
