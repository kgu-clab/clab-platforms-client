'use client';

import { LandingSection, LandingTitle } from '@/components/common';
import { ACTIVITIES } from '@/constants';
import { useEffect, useState } from 'react';
import ActivityDetailCard from './ActivityDetailCard';
import ActivityTabButton from './ActivityTabButton';

export default function ActivitySection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = ACTIVITIES[selectedIndex];

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) return;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((currentIndex) => (currentIndex + 1) % ACTIVITIES.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <LandingSection id="activity" className="bg-[#f7faff]">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-8">
        <div className="flex flex-col gap-7">
          <LandingTitle
            eyebrow="What we do"
            title={
              <>
                만들고 배우고,
                <br /> 같이 놀기도 합니다.
              </>
            }
            description={
              <>
                C-Lab은 스터디와 프로젝트가 끝이 아니에요. <br />
                총회와 MT에서 편하게 섞이며 오래 갈 수 있는 분위기를 만들어요.
              </>
            }
            descriptionClassName="max-w-[32rem]"
          />

          <div className="flex flex-col border-y border-slate-200">
            {ACTIVITIES.map((activity, index) => (
              <ActivityTabButton
                key={activity.title}
                activity={activity}
                index={index}
                isSelected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-154 lg:justify-self-end">
          <ActivityDetailCard activity={selected} />
        </div>
      </div>
    </LandingSection>
  );
}
