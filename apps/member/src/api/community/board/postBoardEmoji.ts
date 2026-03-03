import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardEmojiToggleResponseDto } from "./api.model";

export function postBoardEmoji(boardId: number, emoji: string) {
  return authApi.post<ApiResponse<BoardEmojiToggleResponseDto>, undefined>(
    END_POINT.COMMUNITY.BOARD.EMOJI(boardId, emoji),
    undefined,
  );
}
