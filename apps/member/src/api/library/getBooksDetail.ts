import { authApi, END_POINT } from "../config";
import type {
  getBooksDetailRequest,
  getBooksDetailResponse,
} from "./api.model";

export const getBooksDetail = (request: getBooksDetailRequest) =>
  authApi.get<getBooksDetailResponse>(
    END_POINT.LIBRARY.BOOKS + "/" + request.id,
  );
