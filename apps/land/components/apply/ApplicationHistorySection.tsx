'use client';

import { CURRENT_SEMESTER_RECRUITMENT } from '@/constants';
import { useApplyPassed, useRecruitments } from '@/hooks/apply';
import { formatDate, getApplicationHistory } from '@/lib';
import type { ApplicationHistory } from '@/lib';
import type { ApplicationResultResponse, Recruitment } from '@/types';
import { Button } from '@clab/design-system';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

function getResultMessage(result: ApplicationResultResponse | undefined) {
  if (!result) return null;

  if (result.success && result.data) {
    if (result.data.isPass) {
      return {
        eyebrow: '최종 결과',
        title: '합격을 축하드립니다!',
        description: `${result.data.name}님과 함께할 활동을 기대하고 응원합니다. \n자세한 안내는 개별 연락으로 드립니다.`,
        tone: 'success' as const,
      };
    }

    if (result.data.name) {
      return {
        eyebrow: '최종 결과',
        title: '지원과 관심에 감사드립니다.',
        description: '이번 모집에서는 함께하지 못하게 되었습니다. \n지원해 주셔서 감사합니다.',
        tone: 'neutral' as const,
      };
    }

    return {
      eyebrow: '지원 내역',
      title: '지원 내역을 찾을 수 없습니다.',
      description: '모집 공고와 학번 정보를 다시 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  if (result.errorMessage === 'INVALID_RECRUITMENT_CLOSURE_WINDOW') {
    return {
      eyebrow: '최종 결과',
      title: '결과 확인 가능 기간이 아닙니다.',
      description: '모집 종료 후 7일 이내에 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  if (result.errorMessage === 'NOT_FOUND') {
    return {
      eyebrow: '지원 내역',
      title: '지원 내역을 찾을 수 없습니다.',
      description: '모집 공고와 학번 정보를 다시 확인해 주세요.',
      tone: 'neutral' as const,
    };
  }

  return {
    eyebrow: '최종 결과',
    title: '결과를 불러오지 못했습니다.',
    description: '잠시 후 다시 시도해 주세요.',
    tone: 'neutral' as const,
  };
}

const subscribeToApplicationHistory = () => () => undefined;

function isCurrentSemesterApplication(history: ApplicationHistory) {
  const submittedAt = new Date(history.submittedAt);
  const applicationStartAt = new Date(CURRENT_SEMESTER_RECRUITMENT.applicationStartAt);
  const applicationEndAt = new Date(CURRENT_SEMESTER_RECRUITMENT.applicationEndAt);

  return (
    !Number.isNaN(submittedAt.getTime()) &&
    submittedAt >= applicationStartAt &&
    submittedAt <= applicationEndAt
  );
}

function getResultAvailability(history: ApplicationHistory) {
  if (!isCurrentSemesterApplication(history)) {
    return { disabled: false, description: null };
  }

  const finalResultReleaseAt = new Date(CURRENT_SEMESTER_RECRUITMENT.finalResultReleaseAt);
  if (new Date() < finalResultReleaseAt) {
    return {
      disabled: true,
      description: `${CURRENT_SEMESTER_RECRUITMENT.finalResultReleaseLabel} 공개 예정`,
    };
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
  const resultAvailability = getResultAvailability(history);
  const hasResolvedResult = Boolean(result?.success && result.data);
  const message = error
    ? {
        eyebrow: '최종 결과',
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

      {!hasResolvedResult && (
        <div className="mt-6">
          <Button
            className="whitespace-nowrap px-4"
            onClick={() => void refetch()}
            disabled={isFetching || resultAvailability.disabled}
            color={isFetching || resultAvailability.disabled ? 'disabled' : 'active'}
          >
            {isFetching ? '확인 중...' : (resultAvailability.description ?? '최종 결과 확인')}
          </Button>
        </div>
      )}

      {message && (
        <section
          className="mt-8 border-t border-gray-200 px-4 py-10 text-center sm:px-8 sm:py-12"
          aria-live="polite"
        >
          <span className="mt-5 block text-5xl leading-none" aria-hidden="true">
            {message.tone === 'success' ? '🎉' : '✦'}
          </span>
          <h3 className="mt-5 break-keep text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            {message.title}
          </h3>
          <p className="whitespace-pre-line mx-auto mt-4 max-w-128 break-keep text-sm leading-6 text-gray-600 sm:text-base">
            {message.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition-colors hover:bg-sky-600"
            >
              동아리 더 살펴보기
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
