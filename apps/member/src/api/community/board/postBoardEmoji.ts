import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardEmojiToggleResponseDto } from "./api.model";

export async function postBoardEmoji(boardId: number, emoji: string) {
  const result = await authApi.post<
    ApiResponse<BoardEmojiToggleResponseDto>,
    undefined
  >(END_POINT.COMMUNITY.BOARD.EMOJI(boardId, emoji), undefined);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
