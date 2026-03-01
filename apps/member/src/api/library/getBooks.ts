import { authApi, END_POINT } from "../config";
import type { getBooksRequest, getBooksResponse } from "./api.model";

export const getBooks = (request: getBooksRequest) =>
  authApi.get<getBooksResponse>(END_POINT.LIBRARY.BOOKS, {
    searchParams: {
      title: request.title,
      category: request.category,
      publisher: request.publisher,
      borrowerId: request.borrowerId,
      borrowerName: request.borrowerName,
      page: request.page,
      size: request.size,
      sortBy: request.sortBy?.toString(),
      sortDirection: request.sortDirection?.toString(),
    },
  });
