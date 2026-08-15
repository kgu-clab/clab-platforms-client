'use client';

import { useApplyPassed, useRecruitments } from '@/hooks/apply';
import { formatDate, getApplicationHistory } from '@/lib';
import type { ApplicationHistory } from '@/lib';
import type { ApplicationResultResponse, Recruitment } from '@/types';
import { Button } from '@clab/design-system';
import { useSyncExternalStore } from 'react';

function getResultMessage(result: ApplicationResultResponse | undefined) {
  if (!result) return null;

  if (result.success && result.data) {
    if (result.data.isPass) {
      return {
        title: '최종 합격입니다.',
        description: '안내 문자를 확인해 주세요.',
        tone: 'success' as const,
      };
    }

    if (result.data.name) {
      return {
        title: '최종 불합격입니다.',
        description: '지원해 주셔서 감사합니다.',
        tone: 'neutral' as const,
      };
    }

    return {
      title: '지원 내역을 찾을 수 없습니다.',
      description: '모집 공고와 학번 정보를 다시 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  if (result.errorMessage === 'INVALID_RECRUITMENT_CLOSURE_WINDOW') {
    return {
      title: '결과 확인 가능 기간이 아닙니다.',
      description: '모집 종료 후 7일 이내에 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  if (result.errorMessage === 'NOT_FOUND') {
    return {
      title: '지원 내역을 찾을 수 없습니다.',
      description: '모집 공고와 학번 정보를 다시 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  return {
    title: '결과를 불러오지 못했습니다.',
    description: '잠시 후 다시 시도해 주세요.',
    tone: 'neutral' as const,
  };
}

const subscribeToApplicationHistory = () => () => undefined;

function getResultAvailability(recruitment: Recruitment | undefined) {
  if (!recruitment) {
    return { disabled: true, description: '지원 내역을 확인하고 있습니다.' };
  }

  const now = new Date();
  const endDate = new Date(recruitment.endDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDateDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const lastAvailableDay = new Date(endDateDay);
  lastAvailableDay.setDate(lastAvailableDay.getDate() + 7);
  const isRecruitmentClosed = recruitment.status === '종료' || now > endDate;

  if (!isRecruitmentClosed) {
    return { disabled: true, description: '최종 결과는 모집 종료 후 확인할 수 있습니다.' };
  }

  if (today > lastAvailableDay) {
    return { disabled: true, description: '최종 결과 확인 기간이 종료되었습니다.' };
  }

  return { disabled: false, description: null };
}

export default function ApplicationHistorySection() {
  const history = useSyncExternalStore<ApplicationHistory | null>(
    subscribeToApplicationHistory,
    getApplicationHistory,
    () => null
  );
  const { data: recruitmentsResponse } = useRecruitments();
  const {
    data: result,
    error,
    isFetching,
    refetch,
  } = useApplyPassed({
    recruitmentId: history?.recruitmentId ?? 0,
    studentId: history?.studentId ?? '',
  });

  if (!history) return null;

  const recruitments: Recruitment[] = recruitmentsResponse?.data ?? [];
  const recruitment = recruitments.find((item) => item.id === history.recruitmentId);
  const resultAvailability = getResultAvailability(recruitment);
  const message = error
    ? {
        title: '결과를 불러오지 못했습니다.',
        description: '잠시 후 다시 시도해 주세요.',
        tone: 'neutral' as const,
      }
    : getResultMessage(result);

  return (
    <div className="mb-10 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <p className="mb-2 text-sm font-bold text-sky-600">지원 내역</p>
      <h2 className="text-2xl font-bold text-gray-900">
        {recruitment?.title ?? '지원한 모집 공고'}
      </h2>
      <p className="mt-2 text-sm text-gray-600">지원이 완료되었습니다.</p>
      {recruitment && (
        <p className="mt-1 text-sm text-gray-500">
          모집 종료일 · {formatDate(recruitment.endDate)}
        </p>
      )}

      <div className="mt-6">
        <Button
          onClick={() => void refetch()}
          disabled={isFetching || resultAvailability.disabled}
          color={isFetching || resultAvailability.disabled ? 'disabled' : 'active'}
        >
          {isFetching ? '확인 중...' : (resultAvailability.description ?? '최종 결과 확인')}
        </Button>
      </div>

      {message && (
        <div
          className={`mt-5 rounded-lg border p-4 ${
            message.tone === 'success'
              ? 'border-green-200 bg-green-50 text-green-950'
              : 'border-gray-200 bg-gray-50 text-gray-900'
          }`}
          aria-live="polite"
        >
          <p className="font-semibold">{message.title}</p>
          <p className="mt-1 text-sm opacity-80">{message.description}</p>
        </div>
      )}
    </div>
  );
}
