import { useMutation } from '@tanstack/react-query';

import { END_POINT } from '@/constants';
import { apiClient } from '@/lib';
import type { ApplicationForm } from '@/types';

async function postApplication(body: ApplicationForm) {
  const { data } = await apiClient.post(END_POINT.APPLICATIONS, body);
  return data;
}

interface Props {
  setIsApplySuccess: (applySuccess: boolean) => void;
}

/**
 * 동아리를 지원합니다.
 */
export const useApplicationMutation = ({ setIsApplySuccess }: Props) => {
  const ApplicationPost = useMutation({
    mutationFn: postApplication,
    onSuccess: (data) => {
      if (data.success) {
        setIsApplySuccess(true);
      } else {
        setIsApplySuccess(false);
      }
    },
    onError: () => {
      setIsApplySuccess(false);
    },
  });

  return { applicationMutate: ApplicationPost.mutate, isPending: ApplicationPost.isPending };
};
