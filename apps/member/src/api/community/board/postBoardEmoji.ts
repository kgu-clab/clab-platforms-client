import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { PostBoardEmojiResponse } from "./api.model";

export async function postBoardEmoji(boardId: number, emoji: string) {
  const result = await authApi.post<
    ApiResponse<PostBoardEmojiResponse>,
    undefined
  >(END_POINT.COMMUNITY.BOARD.EMOJI(boardId, emoji), undefined);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
