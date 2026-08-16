'use client';

import { LandingSection } from '@/components/common';
import Link from 'next/link';

import ApplicationHistorySection from './ApplicationHistorySection';
import { APPLICATION_TYPE, ROUTES } from '@/constants';
import { useRecruitments } from '@/hooks/apply';
import { formatDate } from '@/lib';
import type { Recruitment } from '@/types';
import { Chip } from '@clab/design-system';

export default function RecruitmentTable() {
  const { data } = useRecruitments();
  const recruitments: Recruitment[] = data?.data ?? [];

  return (
    <LandingSection
      className="h-auto items-stretch bg-gray-50 px-10 py-16 lg:px-[30%]"
      innerClassName="max-w-none"
    >
      <ApplicationHistorySection />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold text-sky-600">지원 접수</p>
          <h2 className="text-2xl font-bold">모집 공고</h2>
        </div>
      </div>
      {recruitments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">현재 등록된 모집 공고가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recruitments.map((recruitment) => (
            <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
          ))}
        </div>
      )}
    </LandingSection>
  );
}

function RecruitmentCard({ recruitment }: { recruitment: Recruitment }) {
  const isOpen = recruitment.status === '진행중';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <Chip color={isOpen ? 'green' : 'disabled'}>{recruitment.status}</Chip>
        <span className="text-xs text-gray-400">
          {APPLICATION_TYPE[recruitment.applicationType]}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{recruitment.title}</h3>
      <p className="text-sm text-gray-500 mb-1">
        {formatDate(recruitment.startDate)} ~ {formatDate(recruitment.endDate)}
      </p>
      <p className="text-sm text-gray-400 mb-4">대상: {recruitment.target}</p>
      {isOpen && (
        <Link
          className="flex h-8.25 w-fit cursor-pointer items-center justify-center rounded-full bg-primary px-lg py-md text-[14px] font-medium text-white active:brightness-90"
          href={`${ROUTES.APPLY}/${recruitment.id}`}
        >
          지원하기
        </Link>
      )}
    </div>
  );
}
