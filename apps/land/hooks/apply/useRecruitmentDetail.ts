import { useQuery } from '@tanstack/react-query';

import { END_POINT, RECRUITMENT_QUERY_KEY } from '@/constants';
import { apiClient } from '@/lib';

async function getRecruitmentDetail(id: number) {
  const { data } = await apiClient.get(END_POINT.RECRUITMENT_DETAIL(id));
  return data;
}

/**
 * 모집 공고 상세를 조회합니다.
 */
export function useRecruitmentDetail(id: number) {
  return useQuery({
    queryKey: RECRUITMENT_QUERY_KEY.DETAIL(id),
    queryFn: () => getRecruitmentDetail(id),
    enabled: id > 0,
  });
}
