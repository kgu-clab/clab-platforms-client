import { useQuery } from '@tanstack/react-query';

import { END_POINT, RECRUITMENT_QUERY_KEY } from '@/constants';
import { apiClient } from '@/lib';

async function getApplicationNow() {
  const { data } = await apiClient.get(END_POINT.OPEN);
  return data;
}

/**
 * 현재 모집 중인 공고를 조회합니다.
 */
export function useApplicationNow() {
  return useQuery({
    queryKey: RECRUITMENT_QUERY_KEY.NOW(),
    queryFn: getApplicationNow,
  });
}
