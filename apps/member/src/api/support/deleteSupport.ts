import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

export async function deleteSupport(supportId: number) {
  const result = await authApi.del<ApiResponse<string>>(
    END_POINT.SUPPORT.DETAIL(supportId),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
