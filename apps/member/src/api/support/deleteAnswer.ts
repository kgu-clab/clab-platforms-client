import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

export async function deleteAnswer(supportId: number) {
  const result = await authApi.del<ApiResponse<string>>(
    END_POINT.SUPPORT.ANSWER(supportId),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
