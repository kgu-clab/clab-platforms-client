export default function ApplyHeroSection() {
  return (
    <section className="bg-linear-to-b from-black to-primary py-48 px-10 text-white">
      <div className="lg:px-[30%]">
        <h1 className="text-3xl font-bold mb-6">C-Lab 지원하기</h1>
        <p className="text-lg mb-10 opacity-90">C-Lab과 함께 성장할 열정 있는 분들을 기다립니다.</p>
        <div className="flex flex-col gap-4">
          <Step number={1} title="지원서 작성" />
          <Step number={2} title="파트별 선정" />
          <Step number={3} title="합격 여부 확인" />
        </div>
      </div>
    </section>
  );
}

function Step({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        {number}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}
