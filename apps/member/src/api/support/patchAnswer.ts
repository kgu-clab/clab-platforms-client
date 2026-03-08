import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";

export async function patchAnswer(supportId: number, content: string) {
  const result = await authApi.patch<ApiResponse<string>, { content: string }>(
    END_POINT.SUPPORT.ANSWER(supportId),
    { content },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
