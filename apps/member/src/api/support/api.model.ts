import type {
  BaseApiResponse,
  BasePaginationResponse,
} from "../config/api-base-types";

export type SortDirection = "asc" | "desc";
export type SupportStatus = "PENDING" | "ANSWERED" | "CLOSED";
export type SupportCategory = "INQUIRY" | "BUG";

export type PaginationParams = {
  page?: number;
  size?: number;
  sortBy?: string[];
  sortDirection?: SortDirection[];
};

export type SupportIdParam = {
  supportId: number;
};

export type GetSupportRequest = PaginationParams;

export type GetSupportResponse = BasePaginationResponse<
  {
    id: number;
    writerId: string;
    name: string;
    category: SupportCategory;
    title: string;
    createdAt: string;
    status: SupportStatus;
  }[]
>;

export type GetSupportDetailRequest = SupportIdParam;

export type GetSupportDetailResponse = BaseApiResponse<{
  id: number;
  writerId: string;
  name: string;
  title: string;
  content: string;
  uploadedFiles: SupportFileInfo[];
  category: SupportCategory;
  status: SupportStatus;
  answer: Answer;
  createdAt: string;
  isOwner: boolean;
}>;

export type Answer = {
  content: string;
  responder: string;
  createdAt: string;
};

export type SupportFileInfo = {
  fileUrl: string;
  originalFileName: string;
  storagePeriod: number;
  createdAt: string;
};

export type DeleteSupportRequest = SupportIdParam;

export type PostSupportRequest = SupportIdParam & {
  body: {
    title: string;
    content: string;
    category: SupportCategory;
  };
};

export type PostAnswerRequest = SupportIdParam & {
  body: {
    content: string;
  };
};

export type DeleteAnswerRequest = SupportIdParam;

export type GetMySupportsRequest = PaginationParams;

export type GetMySupportsResponse = BasePaginationResponse<
  {
    id: number;
    title: string;
    name: string;
    status: SupportStatus;
    category: SupportCategory;
    createdAt: string;
  }[]
>;
