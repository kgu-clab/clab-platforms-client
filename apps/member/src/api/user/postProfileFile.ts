import type { BaseApiResponse } from "../config/api-base-types";
import { authApi, END_POINT } from "../config";

import type { ProfileFileResponse } from "./api.model";

export function postProfileFile(file: File, storagePeriod = 1460) {
  const formData = new FormData();
  formData.append("multipartFile", file);

  return authApi.postForm<BaseApiResponse<ProfileFileResponse>>(
    END_POINT.COMMUNITY.FILE.PROFILE,
    formData,
    {
      searchParams: { storagePeriod },
    },
  );
}
