import type { getBooksResponse } from "./api.model";

export type Book = getBooksResponse["data"]["items"][number];
