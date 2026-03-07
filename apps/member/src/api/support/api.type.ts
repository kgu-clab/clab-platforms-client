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
  Answer,
  SupportFileInfo,
  SupportWriteForm,
} from "./api.model";

export type Support = GetSupportResponse["data"]["items"][number];
export type SupportDetail = GetSupportDetailResponse["data"];
export type MySupport = GetMySupportsResponse["data"]["items"][number];

export const getStatusLabel = (status: SupportStatus) => {
  switch (status) {
    case "PENDING":
      return "답변 대기";
    case "COMPLETED":
      return "답변 완료";
  }
};

export const getStatusColor = (status: SupportStatus) => {
  switch (status) {
    case "PENDING":
      return "disabled" as const;
    case "COMPLETED":
      return "primary" as const;
  }
};

export const getCategoryLabel = (category: SupportCategory) => {
  return category === "INQUIRY" ? "문의" : "버그";
};
