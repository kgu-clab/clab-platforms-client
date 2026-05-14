import { cn } from "@/utils/cn";

interface AdminTabBadgeProps {
  count?: number;
  className?: string;
}

export default function AdminTabBadge({
  count,
  className,
}: AdminTabBadgeProps) {
  if (typeof count !== "number" || count <= 0) return null;
  return (
    <span
      className={cn(
        "rounded-full bg-gray-100 px-2 text-[11px] font-semibold leading-[1.4] text-gray-400",
        className,
      )}
    >
      {count}
    </span>
  );
}
