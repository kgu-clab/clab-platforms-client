import { ACTIVITIES } from '@/constants';
import ActivityCard from './ActivityCard';
import { Title } from '../common';

export default function ActivitySection() {
  return (
    <section className="flex w-full flex-col gap-3 bg-linear-to-b from-primary-sub to-gray-100 items-center justify-center h-screen">
      <Title title="C-Lab은 이런 활동을 진행해요" className="text-black" />
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
