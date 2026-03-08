import { authApi, END_POINT } from "@/api/config";

import type {
  PostActivityCreateRequest,
  PostActivityCreateResponse,
} from "./api.model";

export const postActivityCreate = (request: PostActivityCreateRequest) =>
  authApi.post<PostActivityCreateResponse, PostActivityCreateRequest>(
    END_POINT.ACTIVITY.CREATE,
    request,
  );
