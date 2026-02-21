import { STATS } from '@/constants';
import { Title } from '../common';

export default function StatsSection() {
  return (
    <section className="flex w-full flex-col px-5 sm:px-10 md:px-20 gap-3 bg-linear-to-b from-primary to-primary-sub items-center justify-center h-screen">
      <Title title="C-Lab은 다음과 같은 역사를 가지고 있어요" className="text-white" />
      <div className="grid w-full grid-cols-2 gap-3">
        {STATS.map(({ label, value, dark }, i) => (
          <div
            key={i}
            className={`grid place-items-center w-full min-h-40 rounded-2xl p-4 ${
              dark ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
            }`}
          >
            <div className="flex flex-col gap-1 justify-center items-center">
              <span className="text-sm opacity-90">{label}</span>
              <span className="text-2xl font-bold">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
