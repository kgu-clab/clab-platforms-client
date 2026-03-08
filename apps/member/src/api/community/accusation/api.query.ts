import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import { ACCUSATIONS_PAGE_SIZE } from "@/api/config";
import type { PaginationParams } from "@/api/config";
import type { BasePaginationResponse } from "@/api/config/api-base-types";
import { TOAST_MESSAGES } from "@/constants";
import { showErrorToast } from "@/utils/toast";

import type {
  AccuseMyResponseDto,
  AccuseRequestDto,
  GetAccusationsParams,
  PatchAccusationStatusParams,
} from "./api.model";
import { getAccusations } from "./getAccusations";
import { getMyAccusations } from "./getMyAccusations";
import { patchAccusationStatus } from "./patchAccusationStatus";
import { postAccusation } from "./postAccusation";

export const accusationQueries = {
  getAccusationsQuery: (params?: GetAccusationsParams) =>
    queryOptions({
      queryKey: ["community", "accusations", params],
      queryFn: () => getAccusations(params),
    }),

  getMyAccusationsQuery: (params?: PaginationParams) =>
    queryOptions({
      queryKey: ["community", "accusations", "my", params],
      queryFn: () => getMyAccusations(params),
    }),

  getMyAccusationsInfiniteQuery: (
    params?: Omit<PaginationParams, "page" | "size">,
  ) =>
    infiniteQueryOptions({
      queryKey: ["community", "accusations", "myInfinite", params] as const,
      queryFn: async ({ pageParam }) => {
        const res = await getMyAccusations({
          ...params,
          page: pageParam as number,
          size: ACCUSATIONS_PAGE_SIZE,
        });
        if (!res.ok) {
          return {
            data: { hasNext: false, items: [], currentPage: 0 },
          } as unknown as BasePaginationResponse<AccuseMyResponseDto[]>;
        }
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    }),

  postAccusationMutation: mutationOptions<unknown, Error, AccuseRequestDto>({
    mutationFn: (body: AccuseRequestDto) => postAccusation(body),
    onError: () => {
      showErrorToast(TOAST_MESSAGES.ACCUSATION);
    },
  }),

  patchAccusationStatusMutation: mutationOptions<
    unknown,
    Error,
    PatchAccusationStatusParams
  >({
    mutationFn: (params) => patchAccusationStatus(params),
  }),
};
