import { authApi, END_POINT } from "@/api/config";

import type { GetActivityAppliedResponse } from "./api.model";

export const getActivityApplied = () =>
  authApi.get<GetActivityAppliedResponse>(END_POINT.ACTIVITY.MY_ACTIVITY_APPLY);
