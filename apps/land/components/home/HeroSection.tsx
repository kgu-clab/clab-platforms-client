import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/constants';

export default function HeroSection() {
  return (
    <section className="clab-hero-section relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.98),transparent_22%),linear-gradient(135deg,#ffffff_0%,#eef9ff_42%,#c9eaff_100%)] px-5 py-24 text-slate-950 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(53,128,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(53,128,255,0.32)_1px,transparent_1px)] bg-size-[72px_72px]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-white/85 to-transparent" />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <Image
          src="/images/clab-hero-logo.png"
          alt="C-Lab"
          width={512}
          height={226}
          priority
          className="h-auto w-60 drop-shadow-[0_24px_60px_rgba(53,128,255,0.22)] sm:w-85 lg:w-105"
        />

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:gap-5">
          <p className="text-[12px] font-black uppercase tracking-[0.34em] text-sky-600/80 sm:text-[13px]">
            KGU Developer Community
          </p>
          <h1 className="max-w-4xl text-[36px] font-black uppercase leading-[0.95] tracking-[-0.065em] text-sky-950 sm:text-[64px] lg:text-[84px]">
            Make it real
          </h1>
          <p className="max-w-152 text-[16px] font-bold leading-[1.75] text-sky-950/58 sm:text-[18px]">
            C-Lab의 다음 활동을 함께 만들어갈 사람을 기다립니다
          </p>
          <Link
            href={ROUTES.APPLY}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-sky-600 sm:mt-4 sm:px-7 sm:text-base"
          >
            지원하기
            <span aria-hidden="true" className="text-base sm:text-lg">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
