'use client';

import { Card } from '@/components/reactbits';
import type { CardProps } from '@/components/reactbits';
import { STUDIES } from '@/constants';
import { forwardRef } from 'react';

const CARD_ACCENTS = ['bg-sky-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-blue-600', 'bg-slate-900'];

type Study = (typeof STUDIES)[number];

interface StudySwapCardProps extends CardProps {
  study: Study;
  index: number;
}

const StudySwapCard = forwardRef<HTMLDivElement, StudySwapCardProps>(
  ({ study, index, ...cardProps }, ref) => {
    return (
      <Card
        ref={ref}
        {...cardProps}
        role={cardProps.role ?? 'article'}
        className={`flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 text-slate-950 shadow-[0_22px_70px_rgba(15,23,42,0.12)] ${cardProps.className ?? ''}`.trim()}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col gap-3">
            <span
              className={`h-2 w-14 rounded-full ${CARD_ACCENTS[index % CARD_ACCENTS.length]}`}
            />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
              {study.field}
            </p>
            <h3 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
              {study.title}
            </h3>
          </div>
          <span className="text-sm font-black text-slate-300">0{index + 1}</span>
        </div>

        <p className="text-base leading-8 text-slate-600">{study.description}</p>

        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    );
  }
);

StudySwapCard.displayName = 'StudySwapCard';

export default StudySwapCard;
