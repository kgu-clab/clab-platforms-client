import { useMutation } from '@tanstack/react-query';

import { END_POINT, FORM_FIELD_MAX_LENGTH } from '@/constants';
import { apiClient } from '@/lib';
import type { ApplicationForm } from '@/types';

async function postApplication(body: ApplicationForm) {
  if (body.interests.length > FORM_FIELD_MAX_LENGTH.INTERESTS) {
    throw new Error(`관심 분야는 최대 ${FORM_FIELD_MAX_LENGTH.INTERESTS}자까지 입력 가능합니다.`);
  }
  if (body.otherActivities.length > FORM_FIELD_MAX_LENGTH.OTHER_ACTIVITIES) {
    throw new Error(
      `다른 동아리/활동은 최대 ${FORM_FIELD_MAX_LENGTH.OTHER_ACTIVITIES}자까지 입력 가능합니다.`
    );
  }

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
