import { authApi, END_POINT } from "@/api/config";
import type { BaseApiResponse } from "@/api/config/api-base-types";

import type { PostActivityCreateRequest } from "./api.model";

export const postActivityCreate = (request: PostActivityCreateRequest) =>
  authApi.post<BaseApiResponse<unknown>, PostActivityCreateRequest>(
    END_POINT.ACTIVITY.CREATE,
    request,
  );
