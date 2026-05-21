import type { MemberRole, StudentStatus } from "@/api/member";

export function getRoleColor(role: MemberRole) {
  if (role === "SUPER") return "red";
  if (role === "ADMIN") return "purple";
  if (role === "USER") return "green";
  return "disabled";
}

export function formatStudentStatus(status?: StudentStatus | string) {
  if (status === "CURRENT") return "재학";
  if (status === "ON_LEAVE") return "휴학";
  if (status === "GRADUATED") return "졸업";
  return status ?? "-";
}
