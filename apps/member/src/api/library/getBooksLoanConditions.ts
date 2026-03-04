import { authApi, END_POINT } from "../config";
import type {
  getBooksLoanConditionsRequest,
  getBooksLoanConditionsResponse,
} from "./api.model";

export const getBooksLoanConditions = (
  request: getBooksLoanConditionsRequest,
) =>
  authApi.get<getBooksLoanConditionsResponse>(
    END_POINT.LIBRARY.BOOKS_LOAN_CONDITIONS,
    {
      searchParams: {
        status: request.status,
        page: request.page,
        size: request.size,
        sortBy: request.sortBy,
        sortDirection: request.sortDirection,
      },
    },
  );
