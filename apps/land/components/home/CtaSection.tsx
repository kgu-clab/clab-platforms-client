import Image from 'next/image';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 px-5 sm:px-10 md:px-20">
      <div className="relative mx-auto flex flex-col items-center gap-4 overflow-hidden rounded-2xl w-full bg-primary-sub h-[60vh] max-h-[700px] px-5 py-6">
        <Image
          src="/images/clab-logo.png"
          className="pointer-events-none absolute opacity-40 right-0 w-fit"
          alt="Clab Pattern"
          width={500}
          height={500}
        />
        <div className="relative flex flex-col items-start gap-2 text-start w-full p-5">
          <p className="text-2xl font-bold text-tertiary">C-Lab은</p>
          <p className="text-2xl font-bold text-tertiary">열정 넘치는 여러분을</p>
          <p className="text-2xl font-bold text-tertiary">기다리고 있어요.</p>
          <Link
            href="/apply"
            className="mt-2 text-base font-semibold text-blue-900 underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            지금 바로 지원하러 가기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
