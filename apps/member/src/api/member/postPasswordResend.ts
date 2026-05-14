import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

export function postPasswordResend(memberId: string) {
  return authApi.post<ApiResponse<string>, undefined>(
    END_POINT.MEMBER.PASSWORD_RESEND(memberId),
    undefined,
  );
}
