import { Button, Modal, Textarea } from "@clab/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router";

import type { Comment } from "@/api/community";
import {
  accusationQueries,
  commentKeys,
  commentQueries,
} from "@/api/community";

import { formatRelativeTime } from "@/utils/date";

interface PostDetailCommentItemProps {
  commentData: Comment;
  boardId?: number;
  to?: string;
  isReply?: boolean;
}

export default function PostDetailCommentItem({
  commentData,
  boardId,
  to,
  isReply = false,
}: PostDetailCommentItemProps) {
  const {
    id,
    writerName,
    writerId,
    writerImageUrl,
    createdAt,
    content,
    likes,
    hasLikeByMe,
    isOwner,
    isDeleted,
  } = commentData;

  const isAnonymous = writerId === null;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content ?? "");
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    ...commentQueries.postCommentLikeMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });

  const deleteMutation = useMutation({
    ...commentQueries.deleteCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });

  const editMutation = useMutation({
    ...commentQueries.patchCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
      setIsEditing(false);
    },
  });

  const replyMutation = useMutation({
    ...commentQueries.postCommentMutation,
    onSuccess: () => {
      if (boardId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.all,
        });
      }
      setIsReplying(false);
      setReplyContent("");
    },
  });

  const accusationMutation = useMutation({
    ...accusationQueries.postAccusationMutation,
    onSuccess: () => {
      setIsReportModalOpen(false);
      setReportReason("");
    },
  });

  const onClickLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate(id);
  };

  const onClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(id);
    setIsDeleteModalOpen(false);
  };

  const onClickReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReportModalOpen(true);
  };

  const handleReport = () => {
    if (!reportReason.trim()) return;
    accusationMutation.mutate({
      targetType: "COMMENT",
      targetId: id,
      reason: reportReason,
    });
  };

  const onClickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const onClickCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditContent(content ?? "");
  };

  const onClickSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editContent.trim()) return;
    editMutation.mutate({
      commentId: id,
      body: { content: editContent, wantAnonymous: isAnonymous },
    });
  };

  const onClickReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReplying(!isReplying);
  };

  const onClickCancelReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReplying(false);
    setReplyContent("");
  };

  const onClickSaveReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!replyContent.trim() || !boardId) return;
    replyMutation.mutate({
      boardId,
      parentId: id,
      body: { content: replyContent, wantAnonymous: isAnonymous },
    });
  };

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  if (isDeleted) {
    return (
      <div
        className={`gap-md py-xl border-b-gray-2 flex border-b ${isReply ? "px-gutter ml-12" : "px-gutter"}`}
      >
        <div className="text-gray-4 text-14-regular">삭제된 댓글입니다.</div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`gap-md py-xl border-b-gray-2 flex border-b${to ? " cursor-pointer" : ""} ${isReply ? "px-gutter ml-12" : "px-gutter"}`}
        onClick={handleClick}
        role={to ? "button" : undefined}
      >
        <div className="bg-gray-2 size-8 shrink-0 overflow-hidden rounded-full">
          {writerImageUrl && (
            <img
              src={writerImageUrl}
              alt={writerName}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="gap-sm flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div className="gap-sm flex items-center">
              <span className="text-14-semibold text-black">
                {writerName ?? "알 수 없음"}
              </span>
              <span className="text-12-regular text-gray-4">
                {formatRelativeTime(createdAt)}
              </span>
            </div>
            {!isEditing && (
              <div className="gap-sm flex items-center">
                {isOwner ? (
                  <>
                    <button
                      className="text-12-regular text-gray-4"
                      onClick={onClickEdit}
                    >
                      수정
                    </button>
                    <button
                      className="text-12-regular text-gray-4"
                      onClick={onClickDelete}
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    className="text-12-regular text-gray-4 gap-xs flex items-center"
                    onClick={onClickReport}
                  >
                    <IoWarningOutline className="size-3" />
                    신고
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="gap-sm flex flex-col">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="min-h-[80px]"
              />
              <div className="gap-sm flex justify-end">
                <button
                  className="text-12-regular text-gray-4"
                  onClick={onClickCancelEdit}
                >
                  취소
                </button>
                <button
                  className="text-12-regular text-gray-4"
                  onClick={onClickSaveEdit}
                  disabled={!editContent.trim() || editMutation.isPending}
                >
                  {editMutation.isPending ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-14-regular whitespace-pre-wrap text-black">
              {content}
            </p>
          )}

          <div className="text-12-regular text-gray-4 gap-md flex items-center">
            <button
              type="button"
              className="gap-xs flex cursor-pointer items-center"
              onClick={onClickLike}
            >
              {hasLikeByMe ? (
                <IoHeart className="text-primary size-4" />
              ) : (
                <IoHeartOutline className="size-4" />
              )}
              <span>{likes}</span>
            </button>
            {!isReply && (
              <button
                type="button"
                className="gap-xs flex cursor-pointer items-center"
                onClick={onClickReply}
              >
                <IoChatbubbleOutline className="size-4" />
                <span>답글</span>
              </button>
            )}
          </div>

          {isReplying && (
            <div className="gap-sm mt-sm flex flex-col">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요"
                className="min-h-header-height"
              />
              <div className="gap-sm flex justify-end">
                <button
                  className="text-12-regular text-gray-4"
                  onClick={onClickCancelReply}
                >
                  취소
                </button>
                <button
                  className="text-12-regular text-gray-4"
                  onClick={onClickSaveReply}
                  disabled={!replyContent.trim() || replyMutation.isPending}
                >
                  {replyMutation.isPending ? "등록 중..." : "등록"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="댓글 삭제"
        subtitle="정말 댓글을 삭제하시겠습니까?"
        size="small"
      >
        <div className="gap-md flex">
          <Button
            color="disabled"
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1"
          >
            취소
          </Button>
          <Button onClick={handleConfirmDelete} className="flex-1">
            삭제
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportReason("");
        }}
        title="댓글 신고"
        subtitle="신고 사유를 작성해주세요"
        size="small"
      >
        <Textarea
          placeholder="신고 사유를 입력해주세요."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          maxLength={300}
          showCounter
        />
        <Button
          onClick={handleReport}
          disabled={!reportReason.trim() || accusationMutation.isPending}
        >
          {accusationMutation.isPending ? "신고 중..." : "신고하기"}
        </Button>
      </Modal>
    </>
  );
}
