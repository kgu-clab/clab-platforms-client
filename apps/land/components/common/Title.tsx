import { cn } from '@clab/design-system/utils';

interface TitleProps {
  title: string;
  className?: string;
}
export default function Title({ title, className }: TitleProps) {
  return (
    <h2 className={cn('text-2xl md:text-3xl font-semibold mb-20 text-center', className)}>
      {title}
    </h2>
  );
}
