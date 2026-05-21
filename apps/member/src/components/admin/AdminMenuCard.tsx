import type { IconType } from "react-icons";
import { IoChevronForward } from "react-icons/io5";
import { Link } from "react-router";

interface AdminMenuCardProps {
  to: string;
  label: string;
  description?: string;
  icon: IconType;
}

export default function AdminMenuCard({
  to,
  label,
  description,
  icon,
}: AdminMenuCardProps) {
  return (
    <Link
      to={to}
      className="border-gray-2 px-gutter py-lg flex w-full items-center justify-between rounded-xl border bg-white"
    >
      <div className="gap-lg flex items-center">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
          {icon({ className: "text-primary size-5" })}
        </div>
        <div className="flex flex-col">
          <span className="text-16-medium text-black">{label}</span>
          {description && (
            <span className="text-12-regular text-gray-4">{description}</span>
          )}
        </div>
      </div>
      <IoChevronForward className="text-gray-4" />
    </Link>
  );
}
