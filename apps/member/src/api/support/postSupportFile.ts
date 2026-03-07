import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { SupportFileInfo } from "./api.model";

export function postSupportFile(files: File[], storagePeriod = 365) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("multipartFile", file);
  }

  return authApi.postForm<ApiResponse<SupportFileInfo[]>>(
    END_POINT.SUPPORT.FILE,
    formData,
    {
      searchParams: { storagePeriod },
    },
  );
}
