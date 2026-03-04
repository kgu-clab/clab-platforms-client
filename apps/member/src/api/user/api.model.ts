import type { BaseApiResponse } from "../config/api-base-types";

export type getUserInfoResponse = BaseApiResponse<{
  name: string;
  id: string;
  interests: string;
  contact: string;
  email: string;
  address: string;
  githubUrl: string;
  studentStatus: string;
  imageUrl: string;
  roleLevel: number;
  isOtpEnabled: boolean;
  createdAt: string;
}>;

export type ProfileFileResponse = {
  fileUrl: string;
  originalFileName: string;
  storagePeriod: number;
  createdAt: string;
};

export type PatchMemberRequest = {
  imageUrl?: string;
  contact?: string;
  email?: string;
  githubUrl?: string;
};
