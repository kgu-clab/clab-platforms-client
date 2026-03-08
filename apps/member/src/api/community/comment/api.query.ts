import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { PagedResponse, PaginationParams } from "@/api/config";
import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  CommentResponseDto,
  GetCommentsParams,
  PatchCommentParams,
  PostCommentParams,
} from "./api.model";
import { deleteComment } from "./deleteComment";
import { getComments } from "./getComments";
import { getMyComments } from "./getMyComments";
import { patchComment } from "./patchComment";
import { postComment } from "./postComment";
import { postCommentLike } from "./postCommentLike";

export const commentKeys = {
  all: ["community", "comments"] as const,
  list: (params: GetCommentsParams) => [...commentKeys.all, params] as const,
  my: (params?: PaginationParams) =>
    [...commentKeys.all, "my", params] as const,
};

export const commentQueries = {
  getCommentsQuery: (params: GetCommentsParams) =>
    queryOptions({
      queryKey: commentKeys.list(params),
      queryFn: () => getComments(params),
      select: (data): PagedResponse<CommentResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  getMyCommentsQuery: (params?: PaginationParams) =>
    queryOptions({
      queryKey: commentKeys.my(params),
      queryFn: () => getMyComments(params),
      select: (data): PagedResponse<CommentResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  postCommentMutation: mutationOptions<unknown, Error, PostCommentParams>({
    mutationFn: ({ boardId, body, parentId }) =>
      postComment(boardId, body, parentId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.COMMENT_CREATE);
    },
  }),

  patchCommentMutation: mutationOptions<unknown, Error, PatchCommentParams>({
    mutationFn: ({ commentId, body }) => patchComment(commentId, body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.COMMENT_UPDATE);
    },
  }),

  deleteCommentMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.COMMENT_DELETE);
    },
  }),

  postCommentLikeMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (commentId: number) => postCommentLike(commentId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.COMMENT_LIKE);
    },
  }),
};
