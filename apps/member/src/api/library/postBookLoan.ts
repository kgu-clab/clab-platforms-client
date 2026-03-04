import { authApi, END_POINT } from "../config";
import type { postBookLoanRequest } from "./api.model";
import type { BaseApiResponse } from "../config/api-base-types";

export const postBookLoan = (request: postBookLoanRequest) =>
  authApi.post<BaseApiResponse<number>, postBookLoanRequest>(
    END_POINT.LIBRARY.BOOKS_LOAN,
    request,
  );
