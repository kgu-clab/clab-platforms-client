import { LandingSection, LandingTitle } from '@/components/common';
import { CardSwap } from '@/components/reactbits';
import { STUDIES } from '@/constants';
import StudySwapCard from './StudySwapCard';

export default function StudySection() {
  return (
    <LandingSection className="overflow-visible bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex max-w-168 flex-col gap-8">
          <LandingTitle
            eyebrow="Study Track"
            title={<>C랩에선 어떤걸 배울 수 있나요?</>}
            description={
              <>
                1학년은 C언어와 자료구조로 기초적인 CS 개념을 필수로 수강하게 됩니다.
                <br />이 외에 웹, 서버, 게임까지 내 진로와 맞는 커리큘럼도 수강할 수 있어요.
                <br />
                스터디 주제는 매 학기 구성원 수요와 운영 상황에 따라 달라질 수 있습니다.
              </>
            }
          />
        </div>

        <div className="relative mx-auto h-88 min-h-88 w-full max-w-136 overflow-visible pt-4 motion-reduce:hidden sm:h-104 lg:h-108 lg:max-w-none lg:pt-0">
          <CardSwap
            width="min(82vw, 27rem)"
            height="18rem"
            cardDistance={38}
            verticalDistance={42}
            dropDistance={330}
            duration={0.78}
            delay={2000}
            skewAmount={4}
            easing="linear"
            className="bottom-8 right-1/2 translate-x-1/2 translate-y-0 scale-[0.78] sm:bottom-6 sm:scale-90 lg:bottom-[5%] lg:right-[10.5rem] lg:translate-x-0 lg:translate-y-[20%] lg:scale-100"
          >
            {STUDIES.map((study, index) => (
              <StudySwapCard key={study.title} study={study} index={index} />
            ))}
          </CardSwap>
        </div>

        <ul className="hidden gap-4 motion-reduce:grid sm:grid-cols-2 lg:grid-cols-3">
          {STUDIES.map((study) => (
            <li
              key={study.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                {study.field}
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950">
                {study.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{study.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
