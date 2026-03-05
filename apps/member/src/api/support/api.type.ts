import type {
  GetSupportDetailResponse,
  GetSupportResponse,
  GetMySupportsResponse,
  SupportCategory,
  SupportStatus,
} from "./api.model";

export type {
  SupportCategory,
  SupportStatus,
  SortDirection,
  PaginationParams,
  SupportIdParam,
  Answer,
  SupportFileInfo,
} from "./api.model";

export type Support = GetSupportResponse["data"]["items"][number];
export type SupportDetail = GetSupportDetailResponse["data"];
export type MySupport = GetMySupportsResponse["data"]["items"][number];

export const SUPPORT_CATEGORY = {
  INQUIRY: "INQUIRY",
  BUG: "BUG",
} as const;

export const SUPPORT_STATUS = {
  PENDING: "PENDING",
  ANSWERED: "ANSWERED",
  CLOSED: "CLOSED",
} as const;

export const isSupportCategory = (value: string): value is SupportCategory => {
  return Object.values(SUPPORT_CATEGORY).includes(value as SupportCategory);
};

export const isSupportStatus = (value: string): value is SupportStatus => {
  return Object.values(SUPPORT_STATUS).includes(value as SupportStatus);
};
