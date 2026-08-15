'use client';

import {
  HeroSection,
  StatsSection,
  StudySection,
  CtaSection,
  LandingFooter,
  ActivitySection,
} from '@/components/home';
import { motion, useReducedMotion } from 'motion/react';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-white">
      <div className="bg-white">
        <div className="sticky top-0">
          <HeroSection />
        </div>
        <motion.div
          data-header-cover-panel
          className="relative z-10 -mt-16 bg-white"
          initial={{ y: prefersReducedMotion ? 0 : 160 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.84, ease: [0.22, 1, 0.36, 1] }}
        >
          <StatsSection />
          <StudySection />
          <ActivitySection />
          <CtaSection />
          <LandingFooter />
        </motion.div>
      </div>
    </div>
  );
}
