import { LandingSection, LandingTitle } from '@/components/common';
import { ROUTES } from '@/constants';
import Link from 'next/link';

const CHECK_ITEMS = [
  '개발을 처음 배우는 분이어도 괜찮아요.',
  '함께 공부하고 이야기할 사람을 찾습니다.',
  '프로젝트 경험보다 꾸준히 해보려는 태도를 봅니다.',
];

export default function CtaSection() {
  return (
    <LandingSection className="bg-white">
      <div className="flex flex-col gap-8">
        <LandingTitle
          eyebrow="Apply"
          title={
            <>
              C-Lab은
              <br /> 열정 넘치는 여러분을
              <br /> 기다리고 있어요.
            </>
          }
          description="C-Lab은 누구나 지원할 수 있는 동아리입니다."
          className="max-w-168"
          descriptionClassName="max-w-[35rem]"
        />

        <div>
          <Link
            href={ROUTES.APPLY}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-sky-600 sm:gap-3 sm:px-6 sm:py-4 sm:text-base"
          >
            지금 바로 지원하러 가기 <span className="text-base sm:text-lg">→</span>
          </Link>
        </div>

        <div className="border-y border-slate-200">
          <p className="py-4 text-sm font-bold text-slate-400">지원 전에 확인해보세요</p>
          <ul className="grid gap-0 sm:grid-cols-3 sm:border-t sm:border-slate-200">
            {CHECK_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border-t border-slate-200 py-4 text-sm font-bold leading-6 text-slate-700 sm:border-t-0 sm:border-l sm:px-4 sm:first:border-l-0"
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-sky-100 text-xs text-sky-700"
                >
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LandingSection>
  );
}
