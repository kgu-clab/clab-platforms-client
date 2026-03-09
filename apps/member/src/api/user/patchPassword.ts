import { authApi, END_POINT } from "../config";
import type { PatchPasswordRequest } from "./api.model";
import type { BaseApiResponse } from "../config/api-base-types";

export function patchPassword(memberId: string, body: PatchPasswordRequest) {
  return authApi.patch<BaseApiResponse<string>, PatchPasswordRequest>(
    END_POINT.USER.UPDATE(memberId),
    body,
  );
}
