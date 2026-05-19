import { authApi, END_POINT } from "../config";
import type { deleteBookLoanRecordRequest } from "./api.model";
import type { BaseApiResponse } from "../config/api-base-types";

export const deleteBookLoanRecord = ({
  bookLoanRecordId,
}: deleteBookLoanRecordRequest) =>
  authApi.del<BaseApiResponse<number>>(
    `${END_POINT.LIBRARY.BOOKS_LOAN}/${bookLoanRecordId}`,
  );
