import { ACTIVITIES } from '@/constants';

type Activity = (typeof ACTIVITIES)[number];

interface ActivityTabButtonProps {
  activity: Activity;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function ActivityTabButton({
  activity,
  index,
  isSelected,
  onClick,
}: ActivityTabButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`group flex w-full items-center justify-between border-b border-slate-200 py-3 text-left transition-colors last:border-b-0 sm:py-5 ${
        isSelected ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'
      }`}
    >
      <span className="flex items-baseline gap-3 sm:gap-4">
        <span className="w-7 text-xs font-bold text-sky-600/80 sm:w-8 sm:text-sm">
          0{index + 1}
        </span>
        <span className="text-xl font-black tracking-[-0.04em] sm:text-2xl">{activity.title}</span>
      </span>
      <span
        className={`text-xl transition-transform group-hover:translate-x-1 sm:text-2xl ${
          isSelected ? 'text-sky-600' : 'text-slate-300'
        }`}
      >
        →
      </span>
    </button>
  );
}
