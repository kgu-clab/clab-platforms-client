import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  getUserInfoResponse,
  PatchMemberRequest,
  ProfileFileResponse,
} from "./api.model";
import { getUserInfo } from "./getUserInfo";
import { patchMember } from "./patchMember";
import { postProfileFile } from "./postProfileFile";

const userQueryKey = ["user"] as const;

export const userQueries = {
  all: userQueryKey,
  infoKey: () => [...userQueryKey, "info"] as const,
  getUserInfoQuery: () =>
    queryOptions<getUserInfoResponse>({
      queryKey: userQueries.infoKey(),
      queryFn: async () => {
        const res = await getUserInfo();
        if (!res.ok) throw new Error("사용자 정보 조회에 실패했습니다.");
        return res.data;
      },
    }),

  postProfileFileMutation: mutationOptions<ProfileFileResponse, Error, File>({
    mutationFn: async (file: File) => {
      const result = await postProfileFile(file);
      if (!result.ok) throw new Error("프로필 이미지 업로드에 실패했습니다.");
      return result.data.data;
    },
    onError: () => {
      showErrorToast(TOAST_MESSAGES.PROFILE_IMAGE_UPDATE);
    },
  }),

  patchMemberMutation: mutationOptions<
    unknown,
    Error,
    { memberId: string; body: PatchMemberRequest }
  >({
    mutationFn: ({ memberId, body }) => patchMember(memberId, body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.PROFILE_UPDATE);
    },
  }),
};
