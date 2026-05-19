import type {
  getBooksDetailResponse,
  getBooksLoanConditionsResponse,
  getBooksResponse,
} from "./api.model";

export type Book = getBooksResponse["data"]["items"][number];

export type BookDetail = getBooksDetailResponse["data"];
export type BookLoanCondition =
  getBooksLoanConditionsResponse["data"]["items"][number];
