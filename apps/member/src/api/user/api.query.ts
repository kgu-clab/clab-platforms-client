import { queryOptions } from "@tanstack/react-query";

import type { getUserInfoResponse } from "./api.model";
import { getUserInfo } from "./getUserInfo";

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
};
