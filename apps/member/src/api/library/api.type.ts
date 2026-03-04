import type { getBooksDetailResponse, getBooksResponse } from "./api.model";

export type Book = getBooksResponse["data"]["items"][number];

export type BookDetail = getBooksDetailResponse["data"];
