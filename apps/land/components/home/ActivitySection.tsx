import { ACTIVITIES } from '@/constants';
import ActivityCard from './ActivityCard';

export default function ActivitySection() {
  return (
    <section className="flex w-full flex-col gap-3 bg-linear-to-b from-primary-sub to-gray-100 items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold text-black mb-20 px-20">
        C-Lab은 이런 활동을 진행해요
      </h2>
      <div className="w-full overflow-x-scroll scrollbar-hide flex">
        {ACTIVITIES.map((activity, index) => (
          <ActivityCard
            key={index}
            title={activity.title}
            description={activity.description}
            imageUrl={activity.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}
