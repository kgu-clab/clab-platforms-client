import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { GetMembersParams, MemberResponseDto } from "./api.model";

export function getMembers(params?: GetMembersParams) {
  const searchParams = new URLSearchParams();
  if (params?.id) searchParams.set("id", params.id);
  if (params?.name) searchParams.set("name", params.name);
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));
  params?.sortBy?.forEach((s) => searchParams.append("sortBy", s));
  params?.sortDirection?.forEach((d) =>
    searchParams.append("sortDirection", d),
  );

  return authApi.get<ApiResponse<PagedResponse<MemberResponseDto>>>(
    END_POINT.MEMBER.BASE,
    { searchParams },
  );
}
