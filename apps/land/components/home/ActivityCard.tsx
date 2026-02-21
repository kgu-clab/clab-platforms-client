import Image from 'next/image';

interface ActivityCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export default function ActivityCard({ title, description, imageUrl }: ActivityCardProps) {
  return (
    <div className="flex flex-col first:pl-6 last:pr-6 pl-3 pr-3 gap-1 w-1/3 min-w-[300px] max-w-[400px] shrink-0">
      <div className="h-52 w-full bg-primary rounded-2xl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            className="object-cover h-full w-full"
            width={400}
            height={400}
          />
        ) : null}
      </div>
      <p className="text-lg font-bold text-black mt-2">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
