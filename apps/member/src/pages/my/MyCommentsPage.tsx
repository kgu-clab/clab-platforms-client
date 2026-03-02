import { Header, Scrollable, Title } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { commentQueries } from "@/api/community";

import { PostDetailCommentItem } from "@/components/community";

export default function MyCommentsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(commentQueries.getMyCommentsQuery());

  const comments = data?.items ?? [];

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>내가 쓴 댓글</Title>
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
        {!isLoading && comments.length === 0 && (
          <div className="flex justify-center py-10">
            <span className="text-gray-4 text-14-regular">
              작성한 댓글이 없습니다.
            </span>
          </div>
        )}
        {comments.map((comment) => (
          <PostDetailCommentItem key={comment.id} commentData={comment} />
        ))}
      </Scrollable>
    </>
  );
}
