import { cn } from '@clab/design-system/utils';

interface LandingSectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

export default function LandingSection({
  children,
  className,
  innerClassName,
  id,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full overflow-hidden px-5 py-20 text-slate-950 sm:px-10 sm:py-24 lg:px-20 lg:py-48',
        className
      )}
    >
      <div className={cn('mx-auto w-full max-w-352', innerClassName)}>{children}</div>
    </section>
  );
}
