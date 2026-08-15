'use client';

import { ApplyHeroSection, FAQSection, RecruitmentTable } from '@/components/apply';
import { motion, useReducedMotion } from 'motion/react';

export default function ApplyPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="bg-primary">
        <div className="sticky top-0">
          <ApplyHeroSection />
        </div>
        <motion.div
          data-header-cover-panel
          className="relative z-10 bg-gray-50"
          initial={{ y: prefersReducedMotion ? 0 : 240 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.84, ease: [0.22, 1, 0.36, 1] }}
        >
          <RecruitmentTable />
          <FAQSection />
        </motion.div>
      </div>
    </div>
  );
}
