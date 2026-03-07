import { Chip } from "@clab/design-system";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  accusationQueries,
  isAccusation,
  ACCUSE_STATUS_MAP,
  CARD_TYPE_LABEL,
} from "@/api/community/accusation";
import type { Support } from "@/api/support";
import { supportQueries, getStatusLabel, getStatusColor } from "@/api/support";
import useMergedInfiniteScroll from "@/hooks/useMergedInfiniteScroll";
import { formatRelativeTime } from "@/utils/date";

type MergedCardItem = {
  cardType: "support" | "accusation";
  id: string;
  supportId?: number;
  title: string;
  statusLabel: string;
  statusChipColor: "disabled" | "primary" | "red";
  createdAt: string;
};

export default function MySupportsCard() {
  const navigate = useNavigate();

  const supportsQuery = useInfiniteQuery(
    supportQueries.getMySupportsInfiniteQuery(),
  );

  const accusationsQuery = useInfiniteQuery(
    accusationQueries.getMyAccusationsInfiniteQuery(),
  );

  const { items } = useMergedInfiniteScroll({
    queries: [supportsQuery, accusationsQuery],
  });

  const mergedCards: MergedCardItem[] = items.slice(0, 10).map((item) => {
    if (isAccusation(item)) {
      const { label, chipColor } = ACCUSE_STATUS_MAP[item.accuseStatus];
      return {
        cardType: "accusation" as const,
        id: `accusation-${item.targetType}-${item.targetId}`,
        title: item.reason,
        statusLabel: label,
        statusChipColor: chipColor,
        createdAt: item.createdAt,
      };
    }
    const support = item as Support;
    return {
      cardType: "support" as const,
      id: `support-${support.id}`,
      supportId: support.id,
      title: support.title,
      statusLabel: getStatusLabel(support.status),
      statusChipColor: getStatusColor(support.status),
      createdAt: support.createdAt,
    };
  });

  if (mergedCards.length === 0) {
    return (
      <p className="text-13-regular text-gray-4 py-4">
        작성한 문의 및 신고 내역이 없습니다.
      </p>
    );
  }

  const handleCardClick = (card: MergedCardItem) => {
    if (card.cardType === "support" && card.supportId) {
      navigate(`/support/${card.supportId}`);
    }
  };

  return (
    <>
      <div className="scrollbar-hide gap-md flex overflow-x-scroll pb-2">
        {mergedCards.map((card) => (
          <div
            key={card.id}
            className={`bg-gray-1 min-w-bottom-padding flex items-center justify-between rounded-lg p-4 transition-colors ${
              card.cardType === "support" ? "cursor-pointer" : ""
            }`}
            role={card.cardType === "support" ? "button" : undefined}
            onClick={() => handleCardClick({ ...card })}
          >
            <div className="min-w-0">
              <p className="text-14-medium line-clamp-1 text-black">
                {card.title}
              </p>
              <p className="text-12-regular text-gray-4 mt-xs">
                {formatRelativeTime(card.createdAt)}
                {` | `}
                {CARD_TYPE_LABEL[card.cardType]}
              </p>
            </div>
            <Chip color={card.statusChipColor} className="ml-md shrink-0">
              {card.statusLabel}
            </Chip>
          </div>
        ))}
      </div>
    </>
  );
}
