import trackingService from "../services/tracking.service";
import type {
  TrackingEventType,
  TrackingPayload,
} from "../services/tracking.service";

const sessionStorageKey = "hoang-long-visitor-session-id";

function getSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingSessionId = window.localStorage.getItem(sessionStorageKey);

  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = window.crypto.randomUUID();
  window.localStorage.setItem(sessionStorageKey, newSessionId);

  return newSessionId;
}

export function trackEvent(
  eventType: TrackingEventType,
  payload: TrackingPayload = {},
) {
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_ENABLE_TRACKING === "false"
  ) {
    return;
  }

  const sessionId = getSessionId();

  if (!sessionId) {
    return;
  }

  void trackingService
    .createEvent({
      sessionId,
      eventType,
      path: window.location.pathname,
      url: window.location.href,
      payload,
    })
    .catch((error: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Tracking event failed", error);
      }
    });
}
