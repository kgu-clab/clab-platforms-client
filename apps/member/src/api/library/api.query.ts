import { infiniteQueryOptions } from "@tanstack/react-query";

import type { getBooksRequest, getBooksResponse } from "./api.model";
import { getBooks } from "./getBooks";

const libraryQueryKey = ["library"] as const;
const BOOKS_PAGE_SIZE = 20;

export const libraryQueries = {
  all: libraryQueryKey,
  booksKey: (request?: getBooksRequest) =>
    [...libraryQueryKey, request] as const,
  getBooksInfiniteQuery: (request: Omit<getBooksRequest, "page" | "size">) =>
    infiniteQueryOptions({
      queryKey: [...libraryQueries.all, "infinite", request] as const,
      queryFn: async ({ pageParam }) => {
        const res = await getBooks({
          ...request,
          page: pageParam as number,
          size: BOOKS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as getBooksResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: getBooksResponse) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),
};
