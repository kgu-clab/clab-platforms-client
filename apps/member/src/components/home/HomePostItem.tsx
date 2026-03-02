import { IoChatbubbleOutline } from "react-icons/io5";
import { Link } from "react-router";

import { CommunityCategoryChip } from "../community";

export interface CommunityPostItemProps {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  comments: number;
}

export default function CommunityPostItem({
  id,
  category,
  title,
  content,
  author,
  comments,
}: CommunityPostItemProps) {
  return (
    <Link
      to={`/community/${id}`}
      className="bg-gray-0 border-gray-2 gap-md p-xl flex w-full flex-col rounded-xl border"
    >
      <div className="gap-xs flex items-center justify-between">
        <CommunityCategoryChip category={category} />
        <span className="font-regular text-gray-4 text-[12px] leading-normal">
          {author}
        </span>
      </div>

      <div className="gap-xs flex flex-col">
        <h3 className="line-clamp-1 text-[16px] font-semibold leading-normal text-black">
          {title}
        </h3>
        <p className="font-regular text-gray-4 line-clamp-2 text-[14px] leading-normal">
          {content}
        </p>
      </div>

      <div className="gap-md text-gray-4 flex items-center">
        <div className="gap-xs flex items-center">
          <IoChatbubbleOutline size={16} />
          <span className="font-regular text-[12px] leading-normal">
            {comments}
          </span>
        </div>
      </div>
    </Link>
  );
}
