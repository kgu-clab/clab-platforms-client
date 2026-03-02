import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { PagedResponse, PaginationParams } from "@/api/config";
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
  }),

  patchCommentMutation: mutationOptions<unknown, Error, PatchCommentParams>({
    mutationFn: ({ commentId, body }) => patchComment(commentId, body),
  }),

  deleteCommentMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (commentId: number) => deleteComment(commentId),
  }),

  postCommentLikeMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (commentId: number) => postCommentLike(commentId),
  }),
};
