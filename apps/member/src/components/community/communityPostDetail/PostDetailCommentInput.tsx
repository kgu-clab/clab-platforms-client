import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

import { commentKeys, commentQueries } from "@/api/community";
import { Button } from "@clab/design-system";

interface PostDetailCommentInputProps {
  boardId: number;
}

export default function PostDetailCommentInput({
  boardId,
}: PostDetailCommentInputProps) {
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
      <div className="bg-gray-2 size-8 shrink-0 rounded-full" />
      <div className="border-gray-2 px-lg py-md gap-sm flex flex-1 flex-col items-end rounded-lg border">
        <textarea
          placeholder="댓글을 남겨보세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={1}
          className="text-14-regular scrollbar-hide min-h-18 max-h-24 w-full resize-none overflow-auto outline-none"
          style={{ fieldSizing: "content" }}
        />
        <div className="gap-sm flex items-center">
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
