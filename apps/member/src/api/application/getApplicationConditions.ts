import type { ApiResponse, PagedResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type {
  ApplicationResponseDto,
  GetApplicationConditionsParams,
} from "./api.model";

export function getApplicationConditions(
  params?: GetApplicationConditionsParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.recruitmentId !== undefined)
    searchParams.set("recruitmentId", String(params.recruitmentId));
  if (params?.studentId) searchParams.set("studentId", params.studentId);
  if (params?.isPass !== undefined)
    searchParams.set("isPass", String(params.isPass));
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));
  params?.sortBy?.forEach((s) => searchParams.append("sortBy", s));
  params?.sortDirection?.forEach((d) =>
    searchParams.append("sortDirection", d),
  );

  return authApi.get<ApiResponse<PagedResponse<ApplicationResponseDto>>>(
    END_POINT.APPLICATION.CONDITIONS,
    { searchParams },
  );
}
