import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { PostBoardRequest } from "./api.model";

export async function postBoard(body: PostBoardRequest) {
  const result = await authApi.post<ApiResponse<string>, PostBoardRequest>(
    END_POINT.COMMUNITY.BOARD.BASE,
    body,
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
