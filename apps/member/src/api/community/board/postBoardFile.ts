import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { BoardFileInfo } from "./api.model";

export function postBoardFile(files: File[], storagePeriod = 365) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("multipartFile", file);
  }

  return authApi.postForm<ApiResponse<BoardFileInfo[]>>(
    END_POINT.COMMUNITY.FILE.BOARD,
    formData,
    {
      searchParams: { storagePeriod },
    },
  );
}
