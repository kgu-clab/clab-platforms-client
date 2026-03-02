import { Header, Scrollable } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { boardQueries, commentQueries, newsQueries } from "@/api/community";

import {
  PostDetailContent,
  NewsDetailContent,
  PostDetailCommentInput,
  PostDetailCommentList,
} from "@/components/community";

type DetailType = "board" | "news";

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const detailId = Number(id);
  const rawType = searchParams.get("type") ?? "board";
  const type: DetailType = rawType === "news" ? "news" : "board";

  const { data: board, isLoading: isBoardLoading } = useQuery({
    ...boardQueries.getBoardQuery(detailId),
    enabled: type === "board",
  });

  const { data: news, isLoading: isNewsLoading } = useQuery({
    ...newsQueries.getNewsDetailQuery(detailId),
    enabled: type === "news",
  });

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    ...commentQueries.getCommentsQuery({ boardId: detailId }),
    enabled: type === "board",
  });

  const isLoading =
    (type === "board" && (isBoardLoading || isCommentsLoading)) ||
    (type === "news" && isNewsLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-4 text-14-regular">로딩 중...</span>
      </div>
    );
  }

  const hasData = (type === "board" && board) || (type === "news" && news);

  if (!hasData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-4 text-14-regular">
          게시글을 찾을 수 없습니다.
        </span>
      </div>
    );
  }

  return (
    <>
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <GoChevronLeft size={24} />
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <Scrollable className="gap-xl pt-header-height">
        {type === "board" && board && <PostDetailContent board={board} />}

        {type === "news" && news && <NewsDetailContent news={news} />}

        {type === "board" && (
          <>
            <hr className="border-gray-1 border-t" />

            <PostDetailCommentInput boardId={detailId} />

            <hr className="border-gray-1 border-t" />

            <PostDetailCommentList
              comments={commentsData?.items ?? []}
              boardId={detailId}
            />
          </>
        )}
      </Scrollable>
    </>
  );
}
