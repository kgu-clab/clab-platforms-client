import { queryOptions } from "@tanstack/react-query";

import type { getBooksRequest } from "./api.model";
import { getBooks } from "./getBooks";

const libraryQueryKey = ["library"] as const;

export const libraryQueries = {
  all: libraryQueryKey,
  booksKey: (request?: getBooksRequest) =>
    [...libraryQueryKey, request] as const,
  getBooksQuery: (request: getBooksRequest) =>
    queryOptions({
      queryKey: libraryQueries.booksKey(request),
      queryFn: async () => {
        const res = await getBooks(request);
        if (!res.ok) return [];
        return res.data;
      },
    }),
};
