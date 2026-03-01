import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../../utils/cn';
import Title from '../title/Title';

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  children: ReactNode;
  title?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export default function Section({ className, children, title, ref, ...props }: SectionProps) {
  return (
    <section ref={ref} className={cn('gap-lg flex w-full flex-col', className)} {...props}>
      {title && <Title>{title}</Title>}
      {children}
    </section>
  );
}

function ListSection({ className, children }: SectionProps) {
  return <div className={cn('flex w-full flex-col gap-[10px]', className)}>{children}</div>;
}

Section.List = ListSection;
