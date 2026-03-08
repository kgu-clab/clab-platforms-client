import type { BasePaginationResponse } from "../config/api-base-types";

export type SchedulePriority = "HIGH" | "MEDIUM" | "LOW";

export type GetScheduleRequest = {
  startDate: string;
  endDate: string;
  page: number;
  size: number;
};

export type GetScheduleResponse = BasePaginationResponse<
  {
    id: number;
    title: string;
    detail: string;
    activityName: string;
    startDateTime: string;
    endDateTime: string;
    priority: SchedulePriority;
  }[]
>;
