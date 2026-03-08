import { cn } from "@clab/design-system";
import { IoPersonSharp } from "react-icons/io5";

import { BASE_FILE_URL } from "@/api/config";
import { useState } from "react";

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
  const [imgError, setImgError] = useState(false);
  const fullUrl = imageUrl ? `${BASE_FILE_URL}${imageUrl}` : undefined;

  return imageUrl && !imgError ? (
    <img
      src={fullUrl}
      alt="프로필"
      className={cn(size, "rounded-full object-cover", className)}
      onError={() => setImgError(true)}
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
