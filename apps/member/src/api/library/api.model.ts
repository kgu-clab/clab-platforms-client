import type {
  BaseApiResponse,
  BasePaginationResponse,
} from "../config/api-base-types";

export type getBooksRequest = {
  title?: string;
  category?: string;
  publisher?: string;
  borrowerId?: string;
  borrowerName?: string;
  page?: number;
  size?: number;
  sortBy?: string[];
  sortDirection?: SortDirection[];
};

type SortDirection = "asc" | "desc";

export type getBooksResponse = BasePaginationResponse<
  {
    id: number;
    borrowerId: string;
    borrowerName: string;
    category: string;
    title: string;
    author: string;
    publisher: string;
    imageUrl: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
  }[]
>;

export type getBooksDetailRequest = {
  id: number;
};

export type getBooksDetailResponse = BaseApiResponse<{
  id: number;
  borrowerId: string;
  borrowerName: string;
  category: string;
  title: string;
  author: string;
  publisher: string;
  imageUrl: string;
  reviewLinks: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}>;

export type postBookLoanRequest = {
  bookId: number;
};

export type BookLoanStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";

export type getBooksLoanConditionsRequest = {
  status: BookLoanStatus;
  page: number;
  size: number;
  sortBy: "borrowedAt";
  sortDirection?: SortDirection;
};

export type getBooksLoanConditionsResponse = BasePaginationResponse<
  {
    bookLoanRecordId: number;
    bookId: number;
    bookTitle: string;
    bookImageUrl: string;
    borrowerId: string;
    borrowerName: string;
    borrowedAt: string;
    returnedAt: string;
    dueDate: string;
    loanExtensionCount: number;
    status: BookLoanStatus;
  }[]
>;
