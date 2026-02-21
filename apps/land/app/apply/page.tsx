'use client';

import { ApplyHeroSection, FAQSection, RecruitmentTable } from '@/components/apply';

export default function ApplyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black pt-header-height">
      <div className="sticky top-16">
        <ApplyHeroSection />
      </div>
      <div className="relative z-10 bg-gray-50">
        <RecruitmentTable />
        <FAQSection />
      </div>
    </div>
  );
}
