import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import type { PagedResponse, PaginationParams } from "@/api/config";
import { DEFAULT_PAGE_SIZE } from "@/api/config";
import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  CommentResponseDto,
  GetCommentsParams,
  GetCommentsResponse,
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
  list: (params: Omit<GetCommentsParams, "page" | "size">) =>
    [...commentKeys.all, "infinite", params] as const,
  my: (params?: PaginationParams) =>
    [...commentKeys.all, "my", params] as const,
  myInfinite: () => [...commentKeys.all, "myInfinite"] as const,
};

export const commentQueries = {
  getCommentsInfiniteQuery: (
    params: Omit<GetCommentsParams, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: commentKeys.list(params),
      queryFn: async ({ pageParam }) => {
        const res = await getComments({
          ...params,
          page: pageParam as number,
          size: DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetCommentsResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  getMyCommentsQuery: (params?: PaginationParams) =>
    queryOptions({
      queryKey: commentKeys.my(params),
      queryFn: () => getMyComments(params),
      select: (data): PagedResponse<CommentResponseDto> =>
        data.ok
          ? {
              ...data.data.data,
              items: data.data.data.items.map(({ writer, ...rest }) => ({
                ...rest,
                writerName: writer,
                isOwner: true,
                children: [],
              })),
            }
          : {
              items: [],
              currentPage: 0,
              hasNext: false,
              hasPrevious: false,
              totalPages: 0,
              totalItems: 0,
              take: 0,
            },
    }),

  getMyCommentsInfiniteQuery: () =>
    infiniteQueryOptions({
      queryKey: commentKeys.myInfinite(),
      queryFn: async ({ pageParam }): Promise<GetCommentsResponse> => {
        const res = await getMyComments({
          page: pageParam as number,
          size: DEFAULT_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetCommentsResponse;
        }
        return {
          ...res.data,
          data: {
            ...res.data.data,
            items: res.data.data.items.map(({ writer, ...rest }) => ({
              ...rest,
              writerName: writer,
              isOwner: true,
              children: [],
            })),
          },
        };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
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
