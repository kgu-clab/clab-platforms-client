import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

import { commentKeys, commentQueries } from "@/api/community";
import { userQueries } from "@/api/user/api.query";
import { Button, Textarea } from "@clab/design-system";

import { ProfileImage } from "@/components/common";

interface PostDetailCommentInputProps {
  boardId: number;
}

export default function PostDetailCommentInput({
  boardId,
}: PostDetailCommentInputProps) {
  const { data: userInfo } = useQuery(userQueries.getUserInfoQuery());
  const { imageUrl } = userInfo?.data ?? {};
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const queryClient = useQueryClient();

  const postCommentMutation = useMutation({
    ...commentQueries.postCommentMutation,
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) return;
    postCommentMutation.mutate({
      boardId,
      body: { content: comment, wantAnonymous: isAnonymous },
    });
  };

  return (
    <div className="gap-md px-gutter py-sm flex items-start">
      <ProfileImage size="size-8" imageUrl={imageUrl} />
      <div className="border-gray-2 relative flex flex-1 flex-col rounded-lg border">
        <Textarea
          placeholder="댓글을 남겨보세요..."
          size="small"
          value={comment}
          maxLength={1000}
          showCounter
          rows={1}
          style={{ fieldSizing: "content" }}
          onChange={(e) => setComment(e.target.value)}
          className="scrollbar-hide "
          wrapperClassName="w-full bg-transparent border-0 pb-12"
        />
        <div className="gap-sm absolute bottom-3 right-3 z-10 flex items-center">
          <Button
            size="small"
            onClick={() => setIsAnonymous(!isAnonymous)}
            color={isAnonymous ? "outlineActive" : "outlineDisabled"}
          >
            {isAnonymous ? "익명 해제" : "익명"}
          </Button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={postCommentMutation.isPending}
            className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full"
          >
            <IoSend className="size-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
