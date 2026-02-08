interface ActivityCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export default function ActivityCard({ title, description, imageUrl }: ActivityCardProps) {
  return (
    <div className="flex flex-col px-3 gap-4 w-1/3 shrink-0">
      <div className="h-52 w-full bg-primary rounded-2xl overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <p className="text-lg font-bold text-black">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
