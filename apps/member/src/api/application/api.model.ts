import type { PaginationParams } from "@/api/config";

export type ApplicationType = "NORMAL" | "OPERATION" | "CORE_TEAM";

export type ApplicationResponseDto = {
  studentId: string;
  recruitmentId: number;
  name: string;
  contact: string;
  email: string;
  department: string;
  grade: number;
  // TODO: 백엔드 응답 필드 확인
  studentStatus?: string;
  birth: string;
  address: string;
  interests: string;
  otherActivities: string;
  githubUrl: string;
  applicationType: ApplicationType;
  isPass: boolean;
  updatedAt: string;
  createdAt: string;
};

export type GetApplicationConditionsParams = PaginationParams & {
  recruitmentId?: number;
  studentId?: string;
  isPass?: boolean;
};

export type ApplicationActionParams = {
  recruitmentId: number;
  studentId: string;
};
