import { authApi, END_POINT } from "@/api/config";
import type { ApiResponse } from "@/api/config";
import type { PatchSupportRequest } from "./api.model";

export async function patchSupport(
  supportId: number,
  body: PatchSupportRequest["body"],
) {
  const result = await authApi.patch<
    ApiResponse<string>,
    PatchSupportRequest["body"]
  >(END_POINT.SUPPORT.DETAIL(supportId), body);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
