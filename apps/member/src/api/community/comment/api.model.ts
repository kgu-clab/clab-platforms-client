import type {
  ApiResponse,
  PagedResponse,
  PaginationParams,
} from "@/api/config";

export type GetCommentsResponse = ApiResponse<
  PagedResponse<CommentResponseDto>
>;

export type CommentResponseDto = {
  id: number;
  isDeleted: boolean;
  writerId: string | null;
  writerName: string;
  writerImageUrl: string | null;
  writerRoleLevel: number | null;
  content: string | null;
  likes: number;
  hasLikeByMe: boolean | null;
  createdAt: string;
  isOwner: boolean | null;
  children: CommentResponseDto[];
};

export type MyCommentResponseDto = Omit<CommentResponseDto, "writerName"> & {
  writer: string;
};

export type GetMyCommentsResponse = ApiResponse<
  PagedResponse<MyCommentResponseDto>
>;

export type CommentLikeToggleResponseDto = {
  boardId: number;
  likes: number;
  hasLikeByMe: boolean;
};

export type CommentRequestDto = {
  content: string;
  wantAnonymous: boolean;
};

export type CommentUpdateRequestDto = {
  content: string;
  wantAnonymous: boolean;
};

export type GetCommentsParams = PaginationParams & {
  boardId: number;
};

export type PostCommentParams = {
  boardId: number;
  parentId?: number;
  body: CommentRequestDto;
};

export type PatchCommentParams = {
  commentId: number;
  body: CommentUpdateRequestDto;
};
