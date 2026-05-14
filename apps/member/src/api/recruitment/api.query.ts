import { queryOptions } from "@tanstack/react-query";

import { getOpenRecruitments } from "./getOpenRecruitments";

export const recruitmentKeys = {
  all: ["recruitment"] as const,
  open: () => [...recruitmentKeys.all, "open"] as const,
};

export const recruitmentQueries = {
  getOpenRecruitmentsQuery: () =>
    queryOptions({
      queryKey: recruitmentKeys.open(),
      queryFn: () => getOpenRecruitments(),
    }),
};
