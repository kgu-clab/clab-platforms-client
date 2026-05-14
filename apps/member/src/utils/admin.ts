import type { MemberRole } from "@/api/member";

export type AdminMemberPendingAction =
  | { type: "role"; memberId: string; name: string; role: MemberRole }
  | { type: "password"; memberId: string; name: string }
  | { type: "delete"; memberId: string; name: string }
  | { type: "approve"; recruitmentId: number; studentId: string; name: string }
  | { type: "reject"; recruitmentId: number; studentId: string; name: string };

export function getConfirmMessage(action: AdminMemberPendingAction) {
  if (action.type === "role") {
    return `${action.name} 회원의 권한을 ${action.role}(으)로 변경하시겠습니까?`;
  }
  if (action.type === "password") {
    return `${action.name} 회원에게 비밀번호 재설정 메일을 보냅니다.`;
  }
  if (action.type === "delete") {
    return `${action.name} 회원을 정말 삭제하시겠습니까?`;
  }
  if (action.type === "approve") {
    return `${action.name}님의 가입 신청을 승인하시겠습니까?`;
  }
  return `${action.name}님의 가입 신청을 거절하시겠습니까?`;
}
