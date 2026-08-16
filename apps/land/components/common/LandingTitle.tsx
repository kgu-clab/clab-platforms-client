import { cn } from '@clab/design-system/utils';

interface LandingTitleProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  as?: 'h1' | 'h2';
}

export default function LandingTitle({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  as = 'h2',
}: LandingTitleProps) {
  const Heading = as;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">{eyebrow}</p>
      )}
      <Heading
        className={cn(
          'text-4xl font-black tracking-[-0.055em] text-slate-950 sm:text-5xl md:text-6xl',
          titleClassName
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn('max-w-136 text-base leading-8 text-slate-500', descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
