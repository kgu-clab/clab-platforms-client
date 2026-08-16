import type { ApplicationType } from "@/api/application";

export type OpenRecruitmentResponseDto = {
  id: number;
  applicationType: ApplicationType;
};

export type RecruitmentDetailsResponseDto = {
  id: number;
  title: string;
  applicationType: ApplicationType;
  startDate: string;
  endDate: string;
  status: string;
};
