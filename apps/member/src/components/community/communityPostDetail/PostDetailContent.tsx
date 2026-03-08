import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import type { BoardDetail, BoardFileInfo, NewsDetail } from "@/api/community";
import { accusationQueries, boardKeys, boardQueries } from "@/api/community";
import { formatRelativeTime } from "@/utils/date";
import { IoHeart, IoHeartOutline, IoWarningOutline } from "react-icons/io5";

import { Button, Chip, Modal, Textarea } from "@clab/design-system";

import { FileDownloadList, ImageInlineList } from "@/components/common";
import { ROUTE, TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

interface PostDetailLayoutProps {
  title: string;
  content: string;
  files?: BoardFileInfo[];
  meta: React.ReactNode;
  footer?: React.ReactNode;
}

function PostDetailLayout({
  title,
  content,
  files,
  meta,
  footer,
}: PostDetailLayoutProps) {
  return (
    <div className="gap-lg px-gutter flex flex-col">
      {meta}

      <h2 className="text-16-semibold text-black">{title}</h2>

      <p className="text-14-regular mb-3 whitespace-pre-wrap text-black">
        {content}
      </p>

      {files && <ImageInlineList files={files} />}
      {files && <FileDownloadList files={files} />}

      {footer}
    </div>
  );
}

interface BoardDetailContentProps {
  board: BoardDetail;
}

export default function BoardDetailContent({ board }: BoardDetailContentProps) {
  const {
    id,
    writerName,
    writerImageUrl,
    createdAt,
    title,
    content,
    emojiInfos,
    files,
    boardHashtagInfos,
    isOwner,
  } = board;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation({
    ...boardQueries.deleteBoardMutation,
    onSuccess: () => {
      showSuccessToast(TOAST_MESSAGES.BOARD_DELETE);
      navigate(ROUTE.COMMUNITY, { replace: true });
    },
  });

  const handleConfirmDelete = () => {
    deleteMutation.mutate(id);
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    navigate(ROUTE.COMMUNITY_WRITE, {
      state: {
        editMode: true,
        boardId: id,
        title,
        content,
        category: board.category.toUpperCase(),
        hashtagNames: boardHashtagInfos.map((tag) => tag.name),
        files,
        wantAnonymous: board.writerId === null,
      },
    });
  };

  const emojiMutation = useMutation({
    ...boardQueries.postBoardEmojiMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(id),
      });
    },
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const accusationMutation = useMutation({
    ...accusationQueries.postAccusationMutation,
    onSuccess: () => {
      showSuccessToast(TOAST_MESSAGES.ACCUSATION);
      setIsReportModalOpen(false);
      setReportReason("");
    },
  });

  const likeEmoji = emojiInfos.find((e) => e.emoji === "👍");
  const likeCount = likeEmoji?.count ?? 0;
  const isLiked = likeEmoji?.isOwner ?? false;

  const onClickLike = () => {
    emojiMutation.mutate({ boardId: id, emoji: "👍" });
  };

  const handleReport = () => {
    if (!reportReason.trim() || isOwner) return;
    accusationMutation.mutate({
      targetType: "BOARD",
      targetId: id,
      reason: reportReason,
    });
  };

  return (
    <>
      <PostDetailLayout
        title={title}
        content={content}
        files={files}
        meta={
          <div className="gap-md flex flex-col">
            <div className="gap-lg flex items-center">
              <div className="bg-gray-2 size-10 shrink-0 overflow-hidden rounded-full">
                {writerImageUrl && (
                  <img
                    src={writerImageUrl}
                    alt={writerName}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-14-semibold text-black">
                  {writerName}
                </span>
                <span className="text-12-regular text-gray-4">
                  {formatRelativeTime(createdAt)}
                </span>
              </div>
            </div>
            {boardHashtagInfos.length > 0 && (
              <div className="gap-xs mt-3 flex flex-wrap">
                {boardHashtagInfos.map((tag) => (
                  <Chip key={tag.id} color="primary">
                    #{tag.name}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        }
        footer={
          <div className="text-12-regular text-gray-4 gap-md flex items-center">
            <Button
              size="small"
              color={isLiked ? "active" : "disabled"}
              onClick={onClickLike}
              className="gap-1"
            >
              {isLiked ? <IoHeart /> : <IoHeartOutline />} {likeCount}
            </Button>
            {isOwner ? (
              <>
                <Button
                  size="small"
                  color="disabled"
                  onClick={handleEdit}
                  className="gap-1"
                >
                  수정
                </Button>
                <Button
                  size="small"
                  color="disabled"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="gap-1"
                >
                  삭제
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color="disabled"
                onClick={() => setIsReportModalOpen(true)}
                className="gap-1"
              >
                <IoWarningOutline /> 신고
              </Button>
            )}
          </div>
        }
      />
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportReason("");
        }}
        title="게시글 신고"
        subtitle="신고 사유를 작성해주세요"
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
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시글 삭제"
        subtitle="정말 게시글을 삭제하시겠습니까?"
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
    </>
  );
}

interface NewsDetailContentProps {
  news: NewsDetail;
}

export function NewsDetailContent({ news }: NewsDetailContentProps) {
  const { title, content, source, articleUrl, createdAt } = news;

  return (
    <PostDetailLayout
      title={title}
      content={content}
      meta={
        <div className="flex flex-col">
          <span className="text-14-semibold text-black">{source}</span>
          <span className="text-12-regular text-gray-4">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      }
      footer={
        articleUrl ? (
          <div className="flex justify-end">
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-13-medium text-primary underline"
            >
              더 보고 싶다면? 링크 이동하기
            </a>
          </div>
        ) : undefined
      }
    />
  );
}
