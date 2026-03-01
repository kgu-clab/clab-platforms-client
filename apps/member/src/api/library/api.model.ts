import type { BasePaginationResponse } from "../config/api-base-types";

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
