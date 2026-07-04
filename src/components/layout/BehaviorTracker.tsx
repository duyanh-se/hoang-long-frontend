"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { trackEvent } from "@/src/lib/tracking";

const scrollMilestones = [25, 50, 75, 90, 100];

function getElementLabel(element: HTMLElement) {
  return (
    element.dataset.trackLabel ||
    element.getAttribute("aria-label") ||
    element.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) ||
    element.tagName.toLowerCase()
  );
}

function getTrackableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>(
    "[data-track], a, button, input, select, textarea",
  );
}

function BehaviorTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams.toString(), [searchParams]);
  const sentScrollMilestonesRef = useRef(new Set<number>());

  useEffect(() => {
    sentScrollMilestonesRef.current = new Set<number>();

    trackEvent("PAGE_VIEW", {
      title: document.title,
      referrer: document.referrer || null,
      query: search || null,
    });
  }, [pathname, search]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = getTrackableElement(event.target);

      if (!element) {
        return;
      }

      trackEvent("CLICK", {
        label: getElementLabel(element),
        target: element.dataset.track || element.tagName.toLowerCase(),
        href: element instanceof HTMLAnchorElement ? element.href : undefined,
        section: element.closest("section")?.id || null,
      });
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollDepth = Math.min(
        100,
        Math.round((window.scrollY / scrollableHeight) * 100),
      );
      const reachedMilestone = scrollMilestones.find(
        (milestone) =>
          scrollDepth >= milestone &&
          !sentScrollMilestonesRef.current.has(milestone),
      );

      if (!reachedMilestone) {
        return;
      }

      sentScrollMilestonesRef.current.add(reachedMilestone);
      trackEvent("SCROLL", {
        scrollDepth: reachedMilestone,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, search]);

  return null;
}

export default function BehaviorTracker() {
  return (
    <Suspense fallback={null}>
      <BehaviorTrackerContent />
    </Suspense>
  );
}
