import { APPLY_PROCESS } from '@/constants';
import type { ApplicationType } from '@/types';

interface Props {
  applicationType: ApplicationType;
}

export default function ApplyProcessSection({ applicationType }: Props) {
  const process = APPLY_PROCESS[applicationType];

  return (
    <section className="px-10 py-12 lg:px-[30%]">
      <h2 className="text-2xl font-bold mb-8">{process.title}</h2>
      <div className="flex flex-col gap-6">
        {process.steps.map(({ step, title, description }) => (
          <div key={step} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {step}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
