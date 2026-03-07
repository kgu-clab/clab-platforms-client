import type {
  BaseApiResponse,
  BasePaginationResponse,
} from "../config/api-base-types";

export type SupportStatus = "PENDING" | "COMPLETED";
export type SupportCategory = "INQUIRY" | "BUG";

export type GetSupportRequest = {
  page?: number;
  size?: number;
  sortBy?: string[];
  sortDirection?: ("asc" | "desc")[];
};

export type GetSupportResponse = BasePaginationResponse<
  {
    id: number;
    name: string;
    category: SupportCategory;
    title: string;
    createdAt: string;
    status: SupportStatus;
  }[]
>;

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

export type SupportWriteForm = {
  category: SupportCategory;
  title: string;
  content: string;
  fileUrlList: string[];
};

export type PostSupportRequest = {
  body: {
    title: string;
    content: string;
    category: SupportCategory;
    fileUrlList?: string[];
  };
};

export type PatchSupportRequest = {
  supportId: number;
  body: {
    title?: string;
    content?: string;
    category?: SupportCategory;
  };
};

export type PostAnswerRequest = {
  supportId: number;
  body: {
    content: string;
  };
};

export type GetMySupportsRequest = {
  page?: number;
  size?: number;
  sortBy?: string[];
  sortDirection?: ("asc" | "desc")[];
};

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
