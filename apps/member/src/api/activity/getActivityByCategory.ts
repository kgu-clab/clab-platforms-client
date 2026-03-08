import { authApi, END_POINT } from "@/api/config";

import type {
  GetActivitiyByCategoryRequest,
  GetActivitiyByCategoryResponse,
} from "./api.model";

export const getActivityByCategory = (request: GetActivitiyByCategoryRequest) =>
  authApi.get<GetActivitiyByCategoryResponse>(
    END_POINT.ACTIVITY.LIST_BY_CATEGORY,
    {
      searchParams: {
        category: request.category,
        page: request.page,
        size: request.size,
      },
    },
  );
