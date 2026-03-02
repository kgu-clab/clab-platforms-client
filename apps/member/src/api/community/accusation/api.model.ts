import type { PaginationParams } from "@/api/config";

export type TargetType = "BOARD" | "COMMENT";
export type AccuseStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AccuseResponseDto = {
  members: { memberId: string; memberName: string }[];
  targetType: TargetType;
  targetId: number;
  reason: string;
  accuseStatus: AccuseStatus;
  accuseCount: number;
  createdAt: string;
};

export type AccuseMyResponseDto = {
  targetType: TargetType;
  targetId: number;
  reason: string;
  accuseStatus: AccuseStatus;
  createdAt: string;
};

export type AccuseRequestDto = {
  targetType: TargetType;
  targetId: number;
  reason: string;
};

export type GetAccusationsParams = PaginationParams & {
  targetType?: TargetType;
  accuseStatus?: AccuseStatus;
  countOrder?: boolean;
};

export type PatchAccusationStatusParams = {
  targetType: TargetType;
  targetId: number;
  accuseStatus: AccuseStatus;
};
