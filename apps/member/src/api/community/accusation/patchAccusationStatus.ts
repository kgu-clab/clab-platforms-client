import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";

import type { PatchAccusationStatusParams } from "./api.model";

export function patchAccusationStatus({
  targetType,
  targetId,
  accuseStatus,
}: PatchAccusationStatusParams) {
  return authApi.patch<ApiResponse<number>, undefined>(
    END_POINT.COMMUNITY.ACCUSATION.STATUS(targetType, targetId),
    undefined,
    {
      searchParams: { accuseStatus } as Record<string, string>,
    },
  );
}
