import type { GetScheduleResponse } from "./api.model";

export type Schedule = GetScheduleResponse["data"]["items"][number];
