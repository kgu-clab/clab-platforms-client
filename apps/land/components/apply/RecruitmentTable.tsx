'use client';

import Link from 'next/link';

import { APPLICATION_TYPE } from '@/constants';
import { useRecruitments } from '@/hooks/apply';
import { formatDate } from '@/lib';
import type { Recruitment } from '@/types';
import { Button, Chip } from '@clab/design-system';

export default function RecruitmentTable() {
  const { data } = useRecruitments();
  const recruitments: Recruitment[] = data?.data ?? [];

  return (
    <section className="px-10 py-16 lg:px-[30%]">
      <h2 className="text-2xl font-bold mb-6">모집 공고</h2>
      {recruitments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">현재 등록된 모집 공고가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {recruitments.map((recruitment) => (
            <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
          ))}
        </div>
      )}
    </section>
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
        <Link href={`/apply/${recruitment.id}`}>
          <Button size="small">지원하기</Button>
        </Link>
      )}
    </div>
  );
}
