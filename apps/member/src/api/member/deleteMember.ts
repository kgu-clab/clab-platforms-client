import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export function deleteMember(memberId: string) {
  return authApi.del<ApiResponse<string>>(END_POINT.MEMBER.DETAIL(memberId));
}
