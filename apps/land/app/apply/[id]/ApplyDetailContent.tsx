'use client';

import { ApplyFormSection, ApplyProcessSection, FAQSection } from '@/components/apply';
import { useRecruitmentDetail } from '@/hooks/apply';
import type { Recruitment } from '@/types';

export default function ApplyDetailContent({ id }: { id: string }) {
  const recruitmentId = Number(id);
  const isValidId = !Number.isNaN(recruitmentId) && recruitmentId > 0;
  const { data, isLoading } = useRecruitmentDetail(isValidId ? recruitmentId : 0);
  const recruitment: Recruitment | undefined = data?.data;

  if (!isValidId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">잘못된 접근입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!recruitment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">모집 공고를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-24">
      <ApplyProcessSection applicationType={recruitment.applicationType} />
      <ApplyFormSection
        recruitmentId={recruitmentId}
        applicationType={recruitment.applicationType}
      />
      <FAQSection />
    </div>
  );
}
