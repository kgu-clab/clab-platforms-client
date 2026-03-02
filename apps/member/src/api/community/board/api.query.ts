import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type {
  BoardDetailsResponseDto,
  BoardFileInfo,
  BoardHotListResponseDto,
  BoardListResponseDto,
  BoardMyResponseDto,
  BoardRequestDto,
  BoardUpdateRequestDto,
  GetBoardsByCategoryParams,
  GetBoardsByHashtagParams,
} from "./api.model";
import type { PagedResponse, PaginationParams } from "@/api/config";
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
  category: (params: GetBoardsByCategoryParams) =>
    [...boardKeys.lists, "category", params] as const,
  hashtag: (params: GetBoardsByHashtagParams) =>
    [...boardKeys.lists, "hashtag", params] as const,
  hot: () => [...boardKeys.lists, "hot"] as const,
  my: (params?: PaginationParams) =>
    [...boardKeys.lists, "my", params] as const,
};

export const boardQueries = {
  getBoardQuery: (boardId: number) =>
    queryOptions({
      queryKey: boardKeys.detail(boardId),
      queryFn: () => getBoard(boardId),
      select: (data): BoardDetailsResponseDto | null =>
        data.ok ? data.data.data : null,
    }),

  getBoardsByCategoryQuery: (params: GetBoardsByCategoryParams) =>
    queryOptions({
      queryKey: boardKeys.category(params),
      queryFn: () => getBoardsByCategory(params),
      select: (data): PagedResponse<BoardListResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  getBoardsByHashtagQuery: (params: GetBoardsByHashtagParams) =>
    queryOptions({
      queryKey: boardKeys.hashtag(params),
      queryFn: () => getBoardsByHashtag(params),
      select: (data): PagedResponse<BoardListResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  getHotBoardsQuery: () =>
    queryOptions({
      queryKey: boardKeys.hot(),
      queryFn: () => getHotBoards(),
      select: (data): BoardHotListResponseDto[] =>
        data.ok ? (data.data.data ?? []) : [],
    }),

  getMyBoardsQuery: (params?: PaginationParams) =>
    queryOptions({
      queryKey: boardKeys.my(params),
      queryFn: () => getMyBoards(params),
      select: (data): PagedResponse<BoardMyResponseDto> =>
        data.ok
          ? data.data.data
          : { items: [], currentPage: 0, totalPage: 0, totalItems: 0 },
    }),

  postBoardMutation: mutationOptions<unknown, Error, BoardRequestDto>({
    mutationFn: (body: BoardRequestDto) => postBoard(body),
  }),

  patchBoardMutation: mutationOptions<
    unknown,
    Error,
    { boardId: number; body: BoardUpdateRequestDto }
  >({
    mutationFn: ({ boardId, body }) => patchBoard(boardId, body),
  }),

  deleteBoardMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (boardId: number) => deleteBoard(boardId),
  }),

  postBoardEmojiMutation: mutationOptions<
    unknown,
    Error,
    { boardId: number; emoji: string }
  >({
    mutationFn: ({ boardId, emoji }) => postBoardEmoji(boardId, emoji),
  }),

  postBoardFileMutation: mutationOptions<BoardFileInfo[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const result = await postBoardFile(files);
      if (!result.ok) throw new Error(result.error.message);
      return result.data.data;
    },
  }),
};
