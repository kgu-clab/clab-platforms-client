import { useQuery } from '@tanstack/react-query';

import { APPLICATION_QUERY_KEY, END_POINT } from '@/constants';
import { apiClient } from '@/lib';
import type { ApplicationResultResponse } from '@/types';

interface Props {
  recruitmentId: number;
  studentId: string;
  enabled?: boolean;
}

async function getApplyPassed({ recruitmentId, studentId }: Props) {
  const { data } = await apiClient.get<ApplicationResultResponse>(
    END_POINT.APPLY_PASSED(recruitmentId, studentId)
  );
  return data;
}

/**
 * 합격 여부를 조회합니다.
 */
export function useApplyPassed({ recruitmentId, studentId, enabled = false }: Props) {
  return useQuery({
    queryKey: [...APPLICATION_QUERY_KEY.RESULT(), recruitmentId, studentId],
    queryFn: () => getApplyPassed({ recruitmentId, studentId }),
    enabled: enabled && recruitmentId > 0 && studentId.trim() !== '',
    retry: false,
  });
}
