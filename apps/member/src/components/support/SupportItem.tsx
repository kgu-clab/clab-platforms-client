import { Chip } from "@clab/design-system";

import type { Support } from "@/api/support";
import { getStatusColor, getStatusLabel } from "@/api/support";
import { formatRelativeTime } from "@/utils/date";

interface SupportItemProps {
  support: Support;
  onSelect: (id: number) => void;
}

export default function SupportItem({ support, onSelect }: SupportItemProps) {
  const { id, title, createdAt, name, status } = support;

  return (
    <div
      className="border-b-gray-2 gap-sm py-xl flex cursor-pointer flex-col border-b"
      role="button"
      onClick={() => onSelect(id)}
    >
      <div className="gap-md mr-3 flex items-center">
        <Chip color={getStatusColor(status)}>{getStatusLabel(status)}</Chip>
        <span className="text-16-medium truncate text-black">{title}</span>
      </div>
      <div className="text-12-regular text-gray-4 flex items-center">
        <span>{formatRelativeTime(createdAt)}</span>
        <span className="mx-xs">|</span>
        <span>{name}</span>
      </div>
    </div>
  );
}
