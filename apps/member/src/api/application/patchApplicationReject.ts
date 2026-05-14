import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { ApplicationActionParams } from "./api.model";

export function patchApplicationReject({
  recruitmentId,
  studentId,
}: ApplicationActionParams) {
  return authApi.patch<ApiResponse<string>, undefined>(
    END_POINT.APPLICATION.REJECT(recruitmentId, studentId),
    undefined,
  );
}
