import { authApi, END_POINT } from "@/api/config";

import type { GetMySupportsRequest, GetMySupportsResponse } from "./api.model";

export function getMySupports(params?: GetMySupportsRequest) {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));
  params?.sortBy?.forEach((s) => searchParams.append("sortBy", s));
  params?.sortDirection?.forEach((d) =>
    searchParams.append("sortDirection", d),
  );

  return authApi.get<GetMySupportsResponse>(END_POINT.SUPPORT.MY_SUPPORTS, {
    searchParams,
  });
}
