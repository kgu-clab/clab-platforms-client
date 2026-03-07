import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import { showErrorToast } from "@/utils/toast";

import type {
  GetSupportRequest,
  GetSupportResponse,
  GetMySupportsRequest,
  GetMySupportsResponse,
  PostSupportRequest,
  PatchSupportRequest,
  PostAnswerRequest,
} from "./api.model";
import type { SupportDetail } from "./api.type";
import { TOAST_MESSAGES } from "@/constants";
import { getSupports } from "./getSupports";
import { getSupportDetail } from "./getSupportDetail";
import { getMySupports } from "./getMySupports";
import { postSupport } from "./postSupport";
import { patchSupport } from "./patchSupport";
import { deleteSupport } from "./deleteSupport";
import { postAnswer } from "./postAnswer";
import { patchAnswer } from "./patchAnswer";
import { deleteAnswer } from "./deleteAnswer";
import { postSupportFile } from "./postSupportFile";

const SUPPORTS_PAGE_SIZE = 20;

export const supportKeys = {
  all: ["support"] as const,
  detail: (supportId: number) => [...supportKeys.all, supportId] as const,
  lists: ["supports"] as const,
  my: (params?: GetMySupportsRequest) =>
    [...supportKeys.lists, "my", params] as const,
};

export const supportQueries = {
  getSupportsInfiniteQuery: (
    params?: Omit<GetSupportRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: [...supportKeys.lists, "infinite", params] as const,
      queryFn: async ({ pageParam }) => {
        const res = await getSupports({
          ...params,
          page: pageParam as number,
          size: SUPPORTS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetSupportResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  getSupportDetailQuery: (supportId: number) =>
    queryOptions({
      queryKey: supportKeys.detail(supportId),
      queryFn: () => getSupportDetail(supportId),
      select: (res): SupportDetail | null => (res.ok ? res.data.data : null),
    }),

  getMySupportsInfiniteQuery: (
    params?: Omit<GetMySupportsRequest, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: [...supportKeys.lists, "myInfinite", params] as const,
      queryFn: async ({ pageParam }) => {
        const res = await getMySupports({
          ...params,
          page: pageParam as number,
          size: SUPPORTS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as GetMySupportsResponse;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  postSupportMutation: mutationOptions<
    unknown,
    Error,
    PostSupportRequest["body"]
  >({
    mutationFn: (body: PostSupportRequest["body"]) => postSupport(body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.SUPPORT_CREATE);
    },
  }),

  patchSupportMutation: mutationOptions<
    unknown,
    Error,
    { supportId: number; body: PatchSupportRequest["body"] }
  >({
    mutationFn: ({ supportId, body }) => patchSupport(supportId, body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.SUPPORT_UPDATE);
    },
  }),

  postSupportFileMutation: mutationOptions<
    Awaited<ReturnType<typeof postSupportFile>>,
    Error,
    { storagePeriod: number; files: File[] }
  >({
    mutationFn: ({ storagePeriod, files }) =>
      postSupportFile(files, storagePeriod),
  }),

  deleteSupportMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (supportId: number) => deleteSupport(supportId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.SUPPORT_DELETE);
    },
  }),

  postAnswerMutation: mutationOptions<
    unknown,
    Error,
    { supportId: number; body: PostAnswerRequest["body"] }
  >({
    mutationFn: ({ supportId, body }) => postAnswer(supportId, body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.ANSWER_CREATE);
    },
  }),

  patchAnswerMutation: mutationOptions<
    unknown,
    Error,
    { supportId: number; content: string }
  >({
    mutationFn: ({ supportId, content }) => patchAnswer(supportId, content),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.ANSWER_UPDATE);
    },
  }),

  deleteAnswerMutation: mutationOptions<unknown, Error, number>({
    mutationFn: (supportId: number) => deleteAnswer(supportId),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.ANSWER_DELETE);
    },
  }),
};
