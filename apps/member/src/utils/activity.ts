import type { ActivityStatus } from "@/api/activity/api.model";

export function getActivityApplicationState(
  status: ActivityStatus | undefined,
) {
  switch (status) {
    case "PROGRESSING":
      return { canApply: true, label: "참여 신청" };
    case "WAITING":
      return { canApply: false, label: "관리자 승인 대기 중" };
    case "END":
      return { canApply: false, label: "종료된 활동" };
    default:
      return { canApply: false, label: "신청 불가" };
  }
}
