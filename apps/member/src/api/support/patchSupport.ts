import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

export async function patchSupport(supportId: number, title: string) {
  const result = await authApi.patch<ApiResponse<string>, { title: string }>(
    END_POINT.SUPPORT.DETAIL(supportId),
    { title },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
