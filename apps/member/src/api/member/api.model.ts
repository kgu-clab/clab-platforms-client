import type { PaginationParams } from "@/api/config";

export type MemberRole = "GUEST" | "USER" | "ADMIN" | "SUPER";

export type StudentStatus = "CURRENT" | "ON_LEAVE" | "GRADUATED";

export type MemberResponseDto = {
  id: string;
  name: string;
  contact: string;
  email: string;
  department: string;
  grade: number;
  birth: string;
  address: string;
  interests: string;
  githubUrl: string;
  studentStatus: StudentStatus;
  imageUrl: string;
  role: MemberRole;
  lastLoginTime: string;
  loanSuspensionDate: string;
  isOtpEnabled: boolean;
  createdAt: string;
};

export type MemberRoleInfoResponseDto = {
  id: string;
  name: string;
  role: MemberRole;
  // TODO: 역할별 회원 목록 응답 필드 백엔드 확인
  department?: string;
  grade?: number;
  studentStatus?: StudentStatus;
  createdAt?: string;
};

export type GetMembersParams = PaginationParams & {
  id?: string;
  name?: string;
};

export type GetMembersByRoleParams = PaginationParams & {
  memberId?: string;
  memberName?: string;
  role?: MemberRole;
};

export type ChangeMemberRoleRequest = {
  role: MemberRole;
};
