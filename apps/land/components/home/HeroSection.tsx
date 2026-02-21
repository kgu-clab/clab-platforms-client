import Button from '@clab/design-system/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="self-stretch h-screen relative bg-linear-to-b from-black to-primary inline-flex flex-col justify-center items-center overflow-hidden">
      <div className="self-stretch p-2.5 flex flex-col justify-center items-center gap-10 overflow-hidden">
        <div className="flex flex-col justify-center items-center">
          <div className="justify-start text-white text-2xl ">개발보안동아리 C-Lab</div>
        </div>
        <Image src="/images/clab-logo-long.png" alt="Clab Logo" width={270} height={119} />
        <Link href="/apply">
          <Button size="small">지원하기</Button>
        </Link>
      </div>
    </div>
  );
}
