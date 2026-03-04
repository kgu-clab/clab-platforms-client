import { Chip } from "@clab/design-system";

import type { Comment } from "@/api/community";

import PostDetailCommentItem from "./PostDetailCommentItem";

interface PostDetailCommentListProps {
  comments: Comment[];
  boardId: number;
}

export default function PostDetailCommentList({
  comments,
  boardId,
}: PostDetailCommentListProps) {
  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.children?.length || 0);
  }, 0);

  return (
    <div className="gap-lg flex flex-col">
      <div className="gap-sm px-gutter mb-2xl flex items-center">
        <span className="text-18-semibold text-black">댓글</span>
        <Chip color="primary">{totalComments}</Chip>
      </div>

      <div className="flex flex-col">
        {comments.map((comment) => (
          <div key={comment.id}>
            {/* 부모 댓글 */}
            <PostDetailCommentItem
              commentData={comment}
              boardId={boardId}
              isReply={false}
            />
            {/* 자식 댓글 (답글) */}
            {comment.children?.map((child) => (
              <PostDetailCommentItem
                key={child.id}
                commentData={child}
                boardId={boardId}
                isReply={true}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
