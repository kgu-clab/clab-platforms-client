import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  ApplicationActionParams,
  GetApplicationConditionsParams,
} from "./api.model";
import { getApplicationConditions } from "./getApplicationConditions";
import { patchApplicationApprove } from "./patchApplicationApprove";
import { patchApplicationReject } from "./patchApplicationReject";

export const applicationKeys = {
  all: ["application"] as const,
  conditions: (params?: GetApplicationConditionsParams) =>
    [...applicationKeys.all, "conditions", params] as const,
};

export const applicationQueries = {
  getApplicationConditionsQuery: (params?: GetApplicationConditionsParams) =>
    queryOptions({
      queryKey: applicationKeys.conditions(params),
      queryFn: () => getApplicationConditions(params),
    }),

  patchApplicationApproveMutation: mutationOptions<
    unknown,
    Error,
    ApplicationActionParams
  >({
    mutationFn: (params) => patchApplicationApprove(params),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.APPLICATION_APPROVE);
    },
  }),

  patchApplicationRejectMutation: mutationOptions<
    unknown,
    Error,
    ApplicationActionParams
  >({
    mutationFn: (params) => patchApplicationReject(params),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.APPLICATION_REJECT);
    },
  }),
};
