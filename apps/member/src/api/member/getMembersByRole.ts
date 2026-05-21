import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type {
  GetMembersByRoleParams,
  MemberRoleInfoResponseDto,
} from "./api.model";

export function getMembersByRole(params?: GetMembersByRoleParams) {
  const searchParams = new URLSearchParams();
  if (params?.memberId) searchParams.set("memberId", params.memberId);
  if (params?.memberName) searchParams.set("memberName", params.memberName);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));
  params?.sortBy?.forEach((s) => searchParams.append("sortBy", s));
  params?.sortDirection?.forEach((d) =>
    searchParams.append("sortDirection", d),
  );

  return authApi.get<ApiResponse<PagedResponse<MemberRoleInfoResponseDto>>>(
    END_POINT.MEMBER.ROLES_LIST,
    { searchParams },
  );
}
