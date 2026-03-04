import { useNavigate } from "react-router";

import { ROUTE } from "@/constants";

interface MyStatsCardProps {
  activityCount: number;
  boardCount: number;
  commentCount: number;
}

export default function MyStatsCard({
  activityCount,
  boardCount,
  commentCount,
}: MyStatsCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-1 flex rounded-2xl px-4 py-4">
      <button
        type="button"
        className="flex flex-1 flex-col items-center"
        onClick={() => navigate(ROUTE.MY_ACTIVITY)}
      >
        <p className="text-16-semibold text-black">{activityCount}</p>
        <p className="text-12-regular text-gray-4">활동</p>
      </button>
      <div className="bg-gray-3 w-px" />
      <button
        type="button"
        className="flex flex-1 flex-col items-center"
        onClick={() => navigate(ROUTE.MY_POSTS)}
      >
        <p className="text-16-semibold text-black">{boardCount}</p>
        <p className="text-12-regular text-gray-4">게시물</p>
      </button>
      <div className="bg-gray-3 w-px" />
      <button
        type="button"
        className="flex flex-1 flex-col items-center"
        onClick={() => navigate(ROUTE.MY_COMMENTS)}
      >
        <p className="text-16-semibold text-black">{commentCount}</p>
        <p className="text-12-regular text-gray-4">댓글</p>
      </button>
    </div>
  );
}
