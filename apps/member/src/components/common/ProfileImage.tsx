import { cn } from "@clab/design-system";

const ROLE_RING_STYLE: Record<string, string> = {
  1: "ring-2 ring-gray-500",
  2: "ring-2 ring-red-500",
  3: "ring-2 ring-blue-500",
};

interface ProfileImageProps {
  imageUrl?: string;
  role?: number;
  size?: string;
  className?: string;
  showRing?: boolean;
}

export default function ProfileImage({
  imageUrl,
  role,
  size = "size-16",
  className,
  showRing = true,
}: ProfileImageProps) {
  const roleStyle = showRing
    ? role
      ? ROLE_RING_STYLE[role]
      : "ring-2 ring-gray-500"
    : undefined;

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="프로필"
      className={cn(size, "rounded-full object-cover", roleStyle, className)}
    />
  ) : (
    <div
      className={cn(
        size,
        "flex items-center justify-center rounded-full bg-gray-300",
        roleStyle,
        className,
      )}
    >
      <span className="text-lg font-bold text-white">U</span>
    </div>
  );
}
