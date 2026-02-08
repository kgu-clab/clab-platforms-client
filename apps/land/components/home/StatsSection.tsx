const STATS = [
  { label: '총 활동 인원', value: '100+', dark: true },
  { label: '활성화 스터디', value: '10개', dark: false },
  { label: '활성화 스터디', value: '10개', dark: false },
  { label: '총 활동 인원', value: '100+', dark: true },
] as const;

export default function StatsSection() {
  return (
    <section className="flex w-full flex-col px-20 gap-3 bg-linear-to-b from-primary to-primary-sub items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold text-white mb-20">
        C-Lab은 다음과 같은 역사를 가지고 있어요
      </h2>
      <div className="grid w-full grid-cols-2 gap-3">
        {STATS.map(({ label, value, dark }, i) => (
          <div
            key={i}
            className={`flex flex-col w-full gap-1.5 min-h-40 rounded-2xl p-4 ${
              dark ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
            }`}
          >
            <span className="text-sm opacity-90">{label}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
