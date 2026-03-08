import { useState } from "react";
import { IoPersonSharp } from "react-icons/io5";

import { cn } from "@clab/design-system";

interface ProfileImageProps {
  imageUrl?: string;
  size?: string;
  className?: string;
}

export default function ProfileImage({
  imageUrl,
  size = "size-16",
  className,
}: ProfileImageProps) {
  const [hasError, setHasError] = useState(false);

  return imageUrl && !hasError ? (
    <img
      src={imageUrl}
      alt="프로필"
      className={cn(size, "rounded-full object-cover", className)}
      onError={() => setHasError(true)}
    />
  ) : (
    <div
      className={cn(
        size,
        "flex items-center justify-center rounded-full bg-gray-300",
        className,
      )}
    >
      <IoPersonSharp className="size-1/2 text-white" />
    </div>
  );
}
