import { Header, Scrollable, Title } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { boardQueries } from "@/api/community";

import { ROUTE } from "@/constants";
import { formatRelativeTime } from "@/utils/date";

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(boardQueries.getMyBoardsQuery());

  const posts = data?.items ?? [];

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>내가 쓴 글</Title>
          </button>
        }
        className="z-fixed absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height pb-bottom-padding">
        {isLoading && (
          <div className="flex justify-center py-10">
            <span className="text-gray-4 text-14-regular">로딩 중...</span>
          </div>
        )}
        {!isLoading && posts.length === 0 && (
          <div className="flex justify-center py-10">
            <span className="text-gray-4 text-14-regular">
              작성한 게시글이 없습니다.
            </span>
          </div>
        )}
        {posts.map(({ id, title, createdAt, writerName }) => (
          <div
            key={id}
            className="border-b-gray-2 gap-sm px-gutter py-xl flex cursor-pointer flex-col border-b"
            role="button"
            onClick={() => navigate(`${ROUTE.COMMUNITY}/${id}`)}
          >
            <span className="text-16-medium truncate text-black">{title}</span>
            <div className="text-12-regular text-gray-4 gap-xs flex items-center">
              <span>{formatRelativeTime(createdAt)}</span>
              <span>|</span>
              <span>{writerName}</span>
            </div>
          </div>
        ))}
      </Scrollable>
    </>
  );
}
