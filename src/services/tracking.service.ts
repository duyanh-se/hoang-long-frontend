import apiClient from "../lib/axios";

export type TrackingEventType =
  | "PAGE_VIEW"
  | "SCROLL"
  | "CLICK"
  | "ADD_TO_CART"
  | "ADD_TO_FAVORITE";

export type TrackingPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export type CreateTrackingEventRequest = {
  sessionId: string;
  eventType: TrackingEventType;
  path?: string;
  url?: string;
  payload?: TrackingPayload;
};

const trackingService = {
  createEvent(payload: CreateTrackingEventRequest) {
    return apiClient.post("/tracking/events", payload);
  },
};

export default trackingService;
