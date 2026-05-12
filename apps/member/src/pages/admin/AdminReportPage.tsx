import {
  Button,
  Chip,
  Header,
  Scrollable,
  Section,
  Title,
} from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { AdminListState } from "@/components/admin";
import { ConfirmModal } from "@/components/common";

import { accusationQueries } from "@/api/community/accusation";
import type {
  AccuseResponseDto,
  TargetType,
} from "@/api/community/accusation/api.model";
import { boardQueries } from "@/api/community/board/api.query";
import { commentQueries } from "@/api/community/comment";
import { ROUTE } from "@/constants";
import { formatRelativeTime } from "@/utils/date";

type PendingAction =
  | {
      type: "keep";
      targetType: TargetType;
      targetId: number;
    }
  | {
      type: "delete";
      targetType: TargetType;
      targetId: number;
    };

export default function AdminReportPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const {
    data: pendingResp,
    isPending,
    isError,
  } = useQuery(
    accusationQueries.getAccusationsQuery({
      page: 0,
      size: 50,
      accuseStatus: "PENDING",
    }),
  );

  const items: AccuseResponseDto[] =
    pendingResp?.ok && pendingResp.data.data ? pendingResp.data.data.items : [];

  const patchAccusation = useMutation({
    ...accusationQueries.patchAccusationStatusMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "accusations"],
      });
    },
  });

  const deleteBoard = useMutation({
    ...boardQueries.deleteBoardMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "accusations"],
      });
    },
  });

  const deleteComment = useMutation({
    ...commentQueries.deleteCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", "accusations"],
      });
    },
  });

  const handleConfirm = () => {
    if (!pending) return;

    if (pending.type === "keep") {
      patchAccusation.mutate({
        targetType: pending.targetType,
        targetId: pending.targetId,
        accuseStatus: "REJECTED",
      });
      setPending(null);
      return;
    }

    const onTargetDeleted = () =>
      patchAccusation.mutate({
        targetType: pending.targetType,
        targetId: pending.targetId,
        accuseStatus: "APPROVED",
      });

    if (pending.targetType === "BOARD") {
      deleteBoard.mutate(pending.targetId, { onSuccess: onTargetDeleted });
    } else {
      deleteComment.mutate(pending.targetId, { onSuccess: onTargetDeleted });
    }
    setPending(null);
  };

  return (
    <>
      <Header
        left={
          <button
            type="button"
            onClick={() => navigate(ROUTE.ADMIN)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>신고 관리</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <Scrollable className="pt-header-height px-gutter py-xl">
        <Section title={`신고 ${items.length}건`}>
          <AdminListState
            isPending={isPending}
            isError={isError}
            isEmpty={!isPending && items.length === 0}
            emptyMessage="처리 대기 중인 신고가 없습니다."
          />

          <div className="gap-md flex flex-col">
            {items.map((item) => (
              <AccusationCard
                key={`${item.targetType}-${item.targetId}`}
                item={item}
                isMutating={
                  patchAccusation.isPending ||
                  deleteBoard.isPending ||
                  deleteComment.isPending
                }
                onKeep={() =>
                  setPending({
                    type: "keep",
                    targetType: item.targetType,
                    targetId: item.targetId,
                  })
                }
                onDelete={() =>
                  setPending({
                    type: "delete",
                    targetType: item.targetType,
                    targetId: item.targetId,
                  })
                }
                onView={() => {
                  if (item.targetType === "BOARD") {
                    navigate(`${ROUTE.COMMUNITY}/${item.targetId}`);
                  }
                  // COMMENT 신고는 AccuseResponseDto에 parent boardId가 없어
                  // 댓글 위치로 navigate 불가. BE에 parentBoardId 보강되면 연결.
                }}
              />
            ))}
          </div>
        </Section>
      </Scrollable>

      {pending && (
        <ConfirmModal
          message={getConfirmMessage(pending)}
          onClose={() => setPending(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

function getConfirmMessage(action: PendingAction) {
  const target = action.targetType === "BOARD" ? "게시글" : "댓글";
  if (action.type === "keep") {
    return `신고를 기각하시겠습니까? (${target}은(는) 그대로 유지됩니다.)`;
  }
  return `신고를 승인하고 ${target}을(를) 삭제하시겠습니까?`;
}

interface AccusationCardProps {
  item: AccuseResponseDto;
  isMutating: boolean;
  onKeep: () => void;
  onDelete: () => void;
  onView: () => void;
}

function AccusationCard({
  item,
  isMutating,
  onKeep,
  onDelete,
  onView,
}: AccusationCardProps) {
  return (
    <div className="border-gray-2 gap-sm flex flex-col rounded-xl border bg-white p-4">
      <div className="gap-xs flex flex-wrap items-center">
        <Chip color="purple">
          {item.targetType === "BOARD" ? "게시글" : "댓글"}
        </Chip>
        <Chip color="red">신고됨</Chip>
        <span className="text-12-regular text-gray-4 ml-auto">
          {formatRelativeTime(item.createdAt)}
        </span>
      </div>

      <button
        type="button"
        className="text-16-medium text-left text-black"
        onClick={onView}
      >
        {item.reason || "(사유 없음)"}
      </button>

      <div className="text-12-regular text-gray-4">
        신고 {item.accuseCount}회
        {item.members.length > 0 && (
          <>
            {" · "}
            {item.members
              .slice(0, 3)
              .map((m) => m.memberName)
              .join(", ")}
            {item.members.length > 3 ? " 외" : ""}
          </>
        )}
      </div>

      <div className="gap-sm flex justify-end">
        <Button
          size="small"
          color="outlineActive"
          onClick={onKeep}
          disabled={isMutating}
        >
          유지
        </Button>
        <Button size="small" onClick={onDelete} disabled={isMutating}>
          삭제
        </Button>
      </div>
    </div>
  );
}
