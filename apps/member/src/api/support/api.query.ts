import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { showErrorToast } from "@/utils/toast";

import type {
  GetSupportRequest,
  GetMySupportsRequest,
  PostSupportRequest,
  PostAnswerRequest,
} from "./api.model";
import type { Support, SupportDetail, MySupport } from "./api.type";
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

export const supportKeys = {
  all: ["support"] as const,
  detail: (supportId: number) => [...supportKeys.all, supportId] as const,
  lists: ["supports"] as const,
  list: (params?: GetSupportRequest) =>
    [...supportKeys.lists, "list", params] as const,
  my: (params?: GetMySupportsRequest) =>
    [...supportKeys.lists, "my", params] as const,
};

export const supportQueries = {
  getSupportsQuery: (params?: GetSupportRequest) =>
    queryOptions({
      queryKey: supportKeys.list(params),
      queryFn: () => getSupports(params),
      select: (data): { items: Support[]; totalItems: number } =>
        data.ok
          ? {
              items: data.data.data.items,
              totalItems: data.data.data.totalItems,
            }
          : { items: [], totalItems: 0 },
    }),

  getSupportDetailQuery: (supportId: number) =>
    queryOptions({
      queryKey: supportKeys.detail(supportId),
      queryFn: () => getSupportDetail(supportId),
      select: (data): SupportDetail | null => (data.ok ? data.data.data : null),
    }),

  getMySupportsQuery: (params?: GetMySupportsRequest) =>
    queryOptions({
      queryKey: supportKeys.my(params),
      queryFn: () => getMySupports(params),
      select: (data): { items: MySupport[]; totalItems: number } =>
        data.ok
          ? {
              items: data.data.data.items,
              totalItems: data.data.data.totalItems,
            }
          : { items: [], totalItems: 0 },
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
    { supportId: number; title: string }
  >({
    mutationFn: ({ supportId, title }) => patchSupport(supportId, title),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.SUPPORT_UPDATE);
    },
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
