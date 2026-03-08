import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

import type { BasePaginationResponse } from "@/api/config/api-base-types";

type InfiniteResult = UseInfiniteQueryResult<
  InfiniteData<BasePaginationResponse<Record<string, unknown>[]>>
>;

interface Options {
  queries: InfiniteResult[];
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * 여러 무한 스크롤 쿼리의 결과를 하나의 정렬된 리스트로 병합합니다.
 *
 * @example
 * const supportsQuery = useInfiniteQuery(
    supportQueries.getMySupportsInfiniteQuery(),
  );

  const accusationsQuery = useInfiniteQuery(
    accusationQueries.getMyAccusationsInfiniteQuery(),
  );

  const { items } = useMergedInfiniteScroll({
    queries: [supportsQuery, accusationsQuery],
  });
 */
export default function useMergedInfiniteScroll({
  queries,
  sortKey = "createdAt",
  sortOrder = "desc",
}: Options) {
  const mergedItems = useMemo(() => {
    const allItems = queries.flatMap(
      (q) => q.data?.pages.flatMap((page) => page.data.items) ?? [],
    );
    return allItems.sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      return sortOrder === "desc"
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    });
  }, [queries, sortKey, sortOrder]);

  const fetchNextPage = useCallback(() => {
    for (const q of queries) {
      if (q.hasNextPage && !q.isFetchingNextPage) {
        q.fetchNextPage();
      }
    }
  }, [queries]);

  return {
    items: mergedItems,
    fetchNextPage,
    hasNextPage: queries.some((q) => q.hasNextPage),
    isFetching: queries.some((q) => q.isFetching),
    isFetchingNextPage: queries.some((q) => q.isFetchingNextPage),
    isLoading: queries.every((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}
