import { useQuery } from '@tanstack/react-query';

import { END_POINT, RECRUITMENT_QUERY_KEY } from '@/constants';
import { apiClient } from '@/lib';

async function getRecruitments() {
  const { data } = await apiClient.get(END_POINT.RECRUITMENT);
  return data;
}

/**
 * 모집 공고 목록을 조회합니다.
 */
export function useRecruitments() {
  return useQuery({
    queryKey: RECRUITMENT_QUERY_KEY.LIST(),
    queryFn: getRecruitments,
  });
}
