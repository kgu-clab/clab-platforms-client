import { Button, Chip, Header, Modal, Scrollable } from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";

import {
  supportKeys,
  supportQueries,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/api/support";
import { userQueries } from "@/api/user/api.query";
import {
  ConfirmModal,
  FileDownloadList,
  ImageInlineList,
} from "@/components/common";
import AnswerContent from "@/components/support/AnswerContent";
import AnswerForm from "@/components/support/AnswerForm";
import { ROUTE, TOAST_MESSAGES } from "@/constants";
import { formatRelativeTime } from "@/utils/date";
import { showSuccessToast } from "@/utils/toast";

export default function SupportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const supportId = Number(id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnswerDeleteConfirm, setShowAnswerDeleteConfirm] = useState(false);
  const [answerMode, setAnswerMode] = useState<null | "create" | "edit">(null);

  const { data: detail, isLoading } = useQuery(
    supportQueries.getSupportDetailQuery(supportId),
  );

  const { data: userInfo } = useQuery(userQueries.getUserInfoQuery());
  const isAdmin = (userInfo?.data.roleLevel ?? 0) >= 2;

  const deleteMutation = useMutation({
    ...supportQueries.deleteSupportMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.lists });
      showSuccessToast(TOAST_MESSAGES.SUPPORT_DELETE);
      navigate(ROUTE.SUPPORT, { replace: true });
    },
  });

  const deleteAnswerMutation = useMutation({
    ...supportQueries.deleteAnswerMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supportKeys.detail(supportId),
      });
      showSuccessToast(TOAST_MESSAGES.ANSWER_DELETE);
      setShowAnswerDeleteConfirm(false);
      setAnswerMode(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-4 text-14-regular">로딩 중...</span>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-4 text-14-regular">
          문의를 찾을 수 없습니다.
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
        <div className="gap-lg px-gutter flex flex-col">
          <div className="gap-sm flex items-center">
            <div className="gap-xs flex min-w-0 flex-1 flex-col">
              <h3 className="text-16-semibold text-black">{detail.title}</h3>
              <div className="text-12-regular text-gray-4 flex items-center">
                <span>{formatRelativeTime(detail.createdAt)}</span>
                <span className="mx-xs">|</span>
                <span>{detail.name}</span>
                <span className="mx-xs">|</span>
                <span>{getCategoryLabel(detail.category)}</span>
              </div>
            </div>
            <Chip color={getStatusColor(detail.status)}>
              {getStatusLabel(detail.status)}
            </Chip>
          </div>

          <hr className="border-gray-1 border-t" />
          <p className="text-14-regular mb-3 whitespace-pre-wrap text-black">
            {detail.content}
          </p>

          <ImageInlineList files={detail.uploadedFiles} />
          <FileDownloadList files={detail.uploadedFiles} />

          <div className="text-12-regular text-gray-4 gap-md flex items-center justify-end">
            {detail.isOwner && !detail.answer && (
              <>
                <Button
                  size="small"
                  color="disabled"
                  onClick={() => {
                    navigate(ROUTE.SUPPORT_WRITE, {
                      state: {
                        editMode: true,
                        supportId,
                        title: detail.title,
                        content: detail.content,
                        category: detail.category,
                        returnState: {
                          showAllSupports: true,
                          openId: supportId,
                        },
                      },
                    });
                  }}
                >
                  수정
                </Button>
                <Button
                  size="small"
                  color="disabled"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  삭제
                </Button>
              </>
            )}
          </div>
        </div>

        <hr className="border-gray-1 border-t" />

        <div className="gap-lg px-gutter flex flex-col items-center">
          {detail.answer && answerMode === null ? (
            <AnswerContent
              answer={detail.answer}
              isAdmin={isAdmin}
              onAnswerEdit={() => setAnswerMode("edit")}
              onAnswerDelete={() => setShowAnswerDeleteConfirm(true)}
            />
          ) : null}

          {isAdmin && !detail.answer && (
            <Button
              size="small"
              color="outlineActive"
              onClick={() => setAnswerMode("create")}
            >
              답변 작성
            </Button>
          )}
        </div>
      </Scrollable>

      {showDeleteConfirm && (
        <ConfirmModal
          message="문의를 삭제하시겠습니까?"
          onConfirm={() => deleteMutation.mutate(supportId)}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}

      {showAnswerDeleteConfirm && (
        <ConfirmModal
          message="답변을 삭제하시겠습니까?"
          onConfirm={() => deleteAnswerMutation.mutate(supportId)}
          onClose={() => setShowAnswerDeleteConfirm(false)}
        />
      )}

      <Modal
        isOpen={answerMode !== null}
        onClose={() => setAnswerMode(null)}
        title={answerMode === "edit" ? "답변 수정" : "답변 작성"}
      >
        <AnswerForm
          supportId={supportId}
          initialContent={
            answerMode === "edit" ? (detail?.answer?.content ?? "") : ""
          }
          mode={answerMode ?? "create"}
          onCancel={() => setAnswerMode(null)}
        />
      </Modal>
    </>
  );
}
