import type {
  GetActivitiyByCategoryResponse,
  GetActivitiyByStatusResponse,
  GetActivitiyDetailResponse,
} from "./api.model";

export type Activity = GetActivitiyByCategoryResponse["data"]["items"][number];
export type ActivityByStatus =
  GetActivitiyByStatusResponse["data"]["items"][number];
export type ActivityDetail = GetActivitiyDetailResponse["data"];
export type ActivityGroupMember =
  GetActivitiyDetailResponse["data"]["groupMembers"][number];
export type ActivityGroupBoard =
  GetActivitiyDetailResponse["data"]["activityGroupBoards"][number];
export type ActivityGroupBoardFile =
  GetActivitiyDetailResponse["data"]["activityGroupBoards"][number]["files"][number];
