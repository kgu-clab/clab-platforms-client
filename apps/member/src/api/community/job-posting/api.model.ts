import type { PaginationParams } from "@/api/config";

export type JobPostingResponseDto = {
  id: number;
  title: string;
  recruitmentPeriod: string;
  jobPostingUrl: string;
  createdAt: string;
};

export type JobPostingDetailsResponseDto = {
  id: number;
  title: string;
  careerLevel: string;
  employmentType: string;
  companyName: string;
  recruitmentPeriod: string;
  jobPostingUrl: string;
  createdAt: string;
};

export type GetJobPostingsParams = PaginationParams & JobPostingResponseDto;
