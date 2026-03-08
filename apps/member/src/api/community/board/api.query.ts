import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import type { PagedResponse } from "@/api/config";
import { BOARDS_PAGE_SIZE } from "@/api/config";
import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  BoardFileInfo,
  GetBoardDetailResponse,
  GetBoardsByCategoryRequest,
  GetBoardsByHashtagRequest,
  GetMyBoardsRequest,
  HotBoardListItem,
  PatchBoardRequest,
  PostBoardRequest,
} from "./api.model";
import { deleteBoard } from "./deleteBoard";
import { getBoard } from "./getBoard";
import { getBoardsByCategory } from "./getBoardsByCategory";
import { getBoardsByHashtag } from "./getBoardsByHashtag";
import { getHotBoards } from "./getHotBoards";
import { getMyBoards } from "./getMyBoards";
import { patchBoard } from "./patchBoard";
import { postBoard } from "./postBoard";
import { postBoardEmoji } from "./postBoardEmoji";
import { postBoardFile } from "./postBoardFile";

export const boardKeys = {
  all: ["community", "board"] as const,
  detail: (boardId: number) => [...boardKeys.all, boardId] as const,
  lists: ["community", "boards"] as const,
  category: (params: Omit<GetBoardsByCategoryRequest, "page" | "size">) =>
    [...boardKeys.lists, "category", "infinite", params] as const,
  hashtag: (params: Omit<GetBoardsByHashtagRequest, "page" | "size">) =>
    [...boardKeys.lists, "hashtag", "infinite", params] as const,
  hot: () => [...boardKeys.lists, "hot"] as const,
  my: (params?: Omit<GetMyBoardsRequest, "page" | "size">) =>
    [...boardKeys.lists, "my", "infinite", params] as const,
};

export const boardQueries = {
  getBoardQuery: (boardId: number) =>
    queryOptions({
      queryKey: boardKeys.detail(boardId),
      queryFn: () => getBoard(boardId),
      select: (data): GetBoardDetailResponse | null =>
        data.ok ? data.data.data : null,
    }),

  getBoardsByCategoryInfiniteQuery: (
    params: Omit<GetBoardsByCategoryRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: boardKeys.category(params),
      queryFn: async ({ pageParam }) => {
        const res = await getBoardsByCategory({
          ...params,
          page: pageParam as number,
          size: BOARDS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
          } as unknown as PagedResponse<never>;
        }
        return res.data.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPage - 1
          ? lastPage.currentPage + 1
          : undefined,
    }),

  getBoardsByHashtagInfiniteQuery: (
    params: Omit<GetBoardsByHashtagRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: boardKeys.hashtag(params),
      queryFn: async ({ pageParam }) => {
        const res = await getBoardsByHashtag({
          ...params,
          page: pageParam as number,
          size: BOARDS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
          } as unknown as PagedResponse<never>;
        }
        return res.data.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPage - 1
          ? lastPage.currentPage + 1
          : undefined,
    }),

  getHotBoardsQuery: () =>
    queryOptions({
      queryKey: boardKeys.hot(),
      queryFn: () => getHotBoards(),
      select: (data): HotBoardListItem[] =>
        data.ok ? (data.data.data ?? []) : [],
    }),

  getMyBoardsCountQuery: () =>
    queryOptions({
      queryKey: [...boardKeys.lists, "my", "count"] as const,
      queryFn: () => getMyBoards({ page: 0, size: 1 }),
      select: (data) => (data.ok ? data.data.data.totalItems : 0),
    }),

  getMyBoardsInfiniteQuery: (
    params?: Omit<GetMyBoardsRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: boardKeys.my(params),
      queryFn: async ({ pageParam }) => {
        const res = await getMyBoards({
          ...params,
          page: pageParam as number,
          size: BOARDS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
          } as unknown as PagedResponse<never>;
        }
        return res.data.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPage - 1
          ? lastPage.currentPage + 1
          : undefined,
    }),

  postBoardMutation: mutationOptions<unknown, Error, PostBoardRequest>({
    mutationFn: (body: PostBoardRequest) => postBoard(body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.BOARD_CREATE);
    },
  }),

  patchBoardMutation: mutationOptions<
    unknown,
    Error,
    { boardId: number; body: PatchBoardRequest }
  >({
    mutationFn: ({ boardId, body }) => patchBoard(boardId, body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.BOARD_UPDATE);
    },
  }),

  deleteBoardMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (boardId: number) => deleteBoard(boardId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.BOARD_DELETE);
    },
  }),

  postBoardEmojiMutation: mutationOptions<
    unknown,
    Error,
    { boardId: number; emoji: string }
  >({
    mutationFn: ({ boardId, emoji }) => postBoardEmoji(boardId, emoji),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.BOARD_EMOJI);
    },
  }),

  postBoardFileMutation: mutationOptions<BoardFileInfo[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const result = await postBoardFile(files);
      if (!result.ok) throw new Error(result.error.message);
      return result.data.data;
    },
    onError: () => {
      showErrorToast(TOAST_MESSAGES.FILE_UPLOAD);
    },
  }),
};
