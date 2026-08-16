'use client';

import { ACTIVITIES } from '@/constants';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';

type Activity = (typeof ACTIVITIES)[number];

interface ActivityDetailCardProps {
  activity: Activity;
}

export default function ActivityDetailCard({ activity }: ActivityDetailCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={activity.title}
        initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
        transition={transition}
      >
        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.06)]">
          <div className="relative aspect-[1.85/1] w-full overflow-hidden bg-sky-100">
            <Image
              src={activity.imageUrl}
              alt={activity.title}
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/42 via-transparent to-transparent" />
            <p className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-700 backdrop-blur">
              {activity.eyebrow}
            </p>
          </div>
          <div className="flex flex-col gap-4 p-6 sm:p-7 lg:h-80">
            <h3 className="text-3xl font-black tracking-[-0.045em] text-slate-950">
              {activity.title}
            </h3>
            <p className="text-base leading-8 text-slate-600">{activity.description}</p>
            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm font-semibold leading-7 text-slate-500">
              {activity.detail}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
