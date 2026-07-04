import trackingService from "../services/tracking.service";
import type {
  TrackingEventType,
  TrackingPayload,
} from "../services/tracking.service";
import { AxiosError } from "axios";

const sessionStorageKey = "hoang-long-visitor-session-id";
let trackingDisabledForMissingEndpoint = false;
let trackingMissingEndpointWarned = false;

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
    process.env.NEXT_PUBLIC_ENABLE_TRACKING === "false" ||
    trackingDisabledForMissingEndpoint
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
      const status =
        error instanceof AxiosError ? error.response?.status : undefined;

      if (status === 404) {
        trackingDisabledForMissingEndpoint = true;

        if (
          process.env.NODE_ENV !== "production" &&
          !trackingMissingEndpointWarned
        ) {
          trackingMissingEndpointWarned = true;
          console.warn(
            "Tracking API endpoint is missing. Tracking is disabled for this session.",
          );
        }

        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("Tracking event failed", error);
      }
    });
}
