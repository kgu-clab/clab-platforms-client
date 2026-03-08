import type { BaseApiResponse } from "../config/api-base-types";
import { authApi, END_POINT } from "../config";

import type { PatchMemberRequest } from "./api.model";

export function patchMember(memberId: string, body: PatchMemberRequest) {
  return authApi.patch<BaseApiResponse<string>, PatchMemberRequest>(
    END_POINT.USER.UPDATE(memberId),
    body,
  );
}
