import type { IconType } from "react-icons";
import { IoChevronForward } from "react-icons/io5";
import { Link } from "react-router";

interface MenuItemProps {
  to?: string;
  label: string;
  icon: IconType;
  onClick?: () => void;
}

export default function MyMenuItem({
  to,
  label,
  icon,
  onClick,
}: MenuItemProps) {
  const content = (
    <>
      <div className="gap-lg flex items-center">
        <div className="bg-gray-1 flex size-9 items-center justify-center rounded-md">
          {icon({ className: "text-black size-5" })}
        </div>
        <span className="text-16-regular text-black">{label}</span>
      </div>
      <IoChevronForward className="text-gray-4" />
    </>
  );

  const className =
    "border-b-gray-2 py-lg flex w-full items-center justify-between border-b";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to ?? "#"} className={className}>
      {content}
    </Link>
  );
}
