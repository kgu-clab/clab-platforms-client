import { useEffect, useRef } from "react";

export interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  useViewport?: boolean;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  useViewport = false,
}: UseInfiniteScrollOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const timeoutId = setTimeout(() => {
      const sentinel = bottomSentinelRef.current;

      if (!useViewport) {
        const scrollEl = scrollRef.current;

        if (!sentinel || !scrollEl) {
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            });
          },
          {
            root: scrollEl,
            threshold: 0,
          },
        );
      } else {
        if (!sentinel) {
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            });
          },
          {
            root: null,
            threshold: 0,
          },
        );
      }

      observer.observe(sentinel);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, useViewport]);

  return {
    scrollRef,
    bottomSentinelRef,
  };
}
