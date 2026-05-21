import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { ChangeMemberRoleRequest } from "./api.model";

export function patchMemberRole(
  memberId: string,
  body: ChangeMemberRoleRequest,
) {
  return authApi.patch<ApiResponse<string>, ChangeMemberRoleRequest>(
    END_POINT.MEMBER.ROLE(memberId),
    body,
  );
}
