import { Chip } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router";

import { boardQueries } from "@/api/community";
import { formatRelativeTime } from "@/utils/date";

const CAROUSEL_SIZE = 4;
const CAROUSEL_BOARD_CATEGORY = "NOTICE" as const;
const CAROUSEL_IMAGE = "/images/clab.png";

type CarouselItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
};

function mapBoardsToCarouselItems(
  boards: { id: number; title: string; createdAt: string }[],
): CarouselItem[] {
  return boards.slice(0, CAROUSEL_SIZE).map((board) => ({
    id: String(board.id),
    category: "공지",
    title: board.title,
    description: "",
    image: CAROUSEL_IMAGE,
    createdAt: board.createdAt,
  }));
}

export default function HomeCarousel() {
  const { data: boardsData } = useQuery(
    boardQueries.getBoardsByCategoryQuery({
      category: CAROUSEL_BOARD_CATEGORY,
      page: 0,
      size: CAROUSEL_SIZE,
    }),
  );

  const items: CarouselItem[] =
    boardsData?.items && boardsData.items.length > 0
      ? mapBoardsToCarouselItems(boardsData.items)
      : [];

  const [emblaRef] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })],
  );

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="gap-xl px-xl flex">
        {items.map((item) => (
          <HomeCarouselItem
            key={item.id}
            {...item}
            description={item.description || item.title}
          />
        ))}
      </div>
    </div>
  );
}

function HomeCarouselItem({
  id,
  category,
  title,
  description,
  image,
  createdAt,
}: CarouselItem) {
  return (
    <Link
      to={`/community/${id}`}
      className="relative block h-[300px] w-[330px] flex-none"
    >
      <div className="bg-gray-2 px-2xl py-3xl relative flex h-full w-[330px] flex-col justify-end overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="bg-linear-to-b absolute inset-0 from-transparent to-[rgba(0,0,0,0.95)]" />
        </div>

        <div className="gap-md relative z-10 flex flex-col">
          <Chip className="border-secondary text-gray-2 w-fit border bg-[rgba(1,32,108,0.6)]">
            {category}
          </Chip>
          <p className="text-12-regular text-gray-2 line-clamp-2 text-white">
            {formatRelativeTime(createdAt)}
          </p>
          <p className="text-22-bold line-clamp-1 text-white">{title}</p>
          <p className="text-16-medium line-clamp-2 text-white">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
