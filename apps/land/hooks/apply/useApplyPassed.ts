import { useQuery } from '@tanstack/react-query';

import { APPLICATION_QUERY_KEY, END_POINT } from '@/constants';
import { apiClient } from '@/lib';

interface Props {
  recruitmentId: number;
  studentId: string;
}

async function getApplyPassed({ recruitmentId, studentId }: Props) {
  const { data } = await apiClient.get(END_POINT.APPLY_PASSED(recruitmentId, studentId));
  return data;
}

/**
 * 합격 여부를 조회합니다.
 */
export function useApplyPassed({ recruitmentId, studentId }: Props) {
  return useQuery({
    queryKey: [...APPLICATION_QUERY_KEY.RESULT(), recruitmentId, studentId],
    queryFn: () => getApplyPassed({ recruitmentId, studentId }),
  });
}
