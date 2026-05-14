import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

import type {
  ChangeMemberRoleRequest,
  GetMembersByRoleParams,
  GetMembersParams,
} from "./api.model";
import { deleteMember } from "./deleteMember";
import { getMembers } from "./getMembers";
import { getMembersByRole } from "./getMembersByRole";
import { patchMemberRole } from "./patchMemberRole";
import { postPasswordResend } from "./postPasswordResend";

export const memberKeys = {
  all: ["member"] as const,
  list: (params?: GetMembersParams) =>
    [...memberKeys.all, "list", params] as const,
  byRole: (params?: GetMembersByRoleParams) =>
    [...memberKeys.all, "by-role", params] as const,
};

export const memberQueries = {
  getMembersQuery: (params?: GetMembersParams) =>
    queryOptions({
      queryKey: memberKeys.list(params),
      queryFn: () => getMembers(params),
    }),

  getMembersByRoleQuery: (params?: GetMembersByRoleParams) =>
    queryOptions({
      queryKey: memberKeys.byRole(params),
      queryFn: () => getMembersByRole(params),
    }),

  patchMemberRoleMutation: mutationOptions<
    unknown,
    Error,
    { memberId: string; body: ChangeMemberRoleRequest }
  >({
    mutationFn: ({ memberId, body }) => patchMemberRole(memberId, body),
    onSuccess: () => {
      showSuccessToast(TOAST_MESSAGES.MEMBER_ROLE_UPDATE);
    },
    onError: () => {
      showErrorToast(TOAST_MESSAGES.MEMBER_ROLE_UPDATE);
    },
  }),

  deleteMemberMutation: mutationOptions<unknown, Error, string>({
    mutationFn: (memberId: string) => deleteMember(memberId),
    onSuccess: () => {
      showSuccessToast(TOAST_MESSAGES.MEMBER_DELETE);
    },
    onError: () => {
      showErrorToast(TOAST_MESSAGES.MEMBER_DELETE);
    },
  }),

  postPasswordResendMutation: mutationOptions<unknown, Error, string>({
    mutationFn: (memberId: string) => postPasswordResend(memberId),
    onSuccess: () => {
      showSuccessToast(TOAST_MESSAGES.MEMBER_PASSWORD_RESEND);
    },
    onError: () => {
      showErrorToast(TOAST_MESSAGES.MEMBER_PASSWORD_RESEND);
    },
  }),
};
