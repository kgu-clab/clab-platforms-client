import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { PaginationParams } from "@/api/config";
import type {
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

  postAccusationMutation: mutationOptions<unknown, Error, AccuseRequestDto>({
    mutationFn: (body: AccuseRequestDto) => postAccusation(body),
  }),

  patchAccusationStatusMutation: mutationOptions<
    unknown,
    Error,
    PatchAccusationStatusParams
  >({
    mutationFn: (params) => patchAccusationStatus(params),
  }),
};
