import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import type {
  getBooksRequest,
  getBooksResponse,
  getBooksDetailRequest,
  postBookLoanRequest,
} from "./api.model";
import { getBooks } from "./getBooks";
import { getBooksDetail } from "./getBooksDetail";
import { postBookLoan } from "./postBookLoan";

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
        lastPage.success ? lastPage.data.currentPage + 1 : undefined,
    }),
  getBooksDetailQuery: (request: getBooksDetailRequest) =>
    queryOptions({
      queryKey: [...libraryQueries.all, "detail", request.id] as const,
      queryFn: async () => {
        const res = await getBooksDetail(request);
        if (!res.ok) throw new Error("도서 상세 조회에 실패했습니다.");
        return res.data.data;
      },
    }),
  postBookLoanMutation: mutationOptions({
    mutationFn: async (request: postBookLoanRequest) => {
      const res = await postBookLoan(request);
      if (!res.ok)
        throw new Error(res.error.message ?? "대출 신청에 실패했습니다.");
      return res.data;
    },
  }),
};
