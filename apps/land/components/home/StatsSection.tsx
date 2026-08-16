import { LandingSection, LandingTitle } from '@/components/common';
import { CountUp } from '@/components/reactbits';
import { STATS } from '@/constants';

export default function StatsSection() {
  return (
    <LandingSection className="bg-white pt-16 sm:pt-20 lg:pt-24">
      <div className="flex flex-col gap-8">
        <LandingTitle
          eyebrow="About C-Lab"
          title={<>C-Lab은 무슨 동아리인가요?</>}
          description={
            <>
              C-Lab은 개발을 처음 시작하는 학생도 편하게 들어와 함께 성장할 수 있는 경기대학교 개발
              동아리에요. <br />
              기초 스터디부터 프로젝트, 발표, 선후배 네트워킹까지 개발자로 성장하는 과정을
              함께해봐요.
            </>
          }
          descriptionClassName="max-w-none"
        />

        <div className="grid border-y border-slate-200 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`grid min-h-44 grid-rows-[auto_1fr_auto_auto] gap-4 py-6 sm:px-6 lg:px-5 xl:px-8 ${
                index === 0 ? '' : 'border-t border-slate-200'
              } ${index % 2 === 1 ? 'sm:border-l' : 'sm:border-l-0'} ${
                index < 2 ? 'sm:border-t-0' : ''
              } ${index === 0 ? 'lg:border-l-0' : 'lg:border-l'} lg:border-t-0`}
            >
              <p className="text-sm font-bold leading-5 text-slate-500">{stat.label}</p>
              <div aria-hidden className="min-h-4" />
              <div className="flex items-baseline gap-1 text-5xl font-black leading-none tracking-[-0.06em] text-slate-950 lg:text-5xl xl:text-6xl">
                <span className="sr-only">{`${stat.value}${stat.suffix}`}</span>
                <span aria-hidden="true" className="contents">
                  <CountUp to={stat.value} duration={1.4} className="tabular-nums" />
                  <span className="text-3xl leading-none tracking-[-0.04em] text-sky-600 sm:text-4xl">
                    {stat.suffix}
                  </span>
                </span>
              </div>
              <p className="min-h-18 text-sm leading-6 text-slate-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
