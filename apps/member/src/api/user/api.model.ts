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
