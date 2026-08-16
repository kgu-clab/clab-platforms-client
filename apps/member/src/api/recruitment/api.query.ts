import { queryOptions } from "@tanstack/react-query";

import { getOpenRecruitments } from "./getOpenRecruitments";
import { getRecruitmentDetails } from "./getRecruitmentDetails";

export const recruitmentKeys = {
  all: ["recruitment"] as const,
  open: () => [...recruitmentKeys.all, "open"] as const,
  detail: (recruitmentId: number) =>
    [...recruitmentKeys.all, "detail", recruitmentId] as const,
};

export const recruitmentQueries = {
  getOpenRecruitmentsQuery: () =>
    queryOptions({
      queryKey: recruitmentKeys.open(),
      queryFn: () => getOpenRecruitments(),
    }),
  getRecruitmentDetailsQuery: (recruitmentId: number) =>
    queryOptions({
      queryKey: recruitmentKeys.detail(recruitmentId),
      queryFn: () => getRecruitmentDetails(recruitmentId),
    }),
};
