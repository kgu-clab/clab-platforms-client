import {
  Button,
  Chip,
  Field,
  Header,
  Modal,
  Scrollable,
  Section,
  Textarea,
} from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";

import { StudyMemberGrid } from "@/components/activity";

import type { ActivityStatus } from "@/api/activity/api.model";
import { activityQueries } from "@/api/activity/api.query";
import { formatTextToNodes } from "@/utils/formatter";

const STATUS_MAP: Record<
  ActivityStatus,
  { label: string; color: "green" | "yellow" | "red" }
> = {
  WAITING: { label: "모집중", color: "green" },
  PROGRESSING: { label: "진행중", color: "yellow" },
  END: { label: "종료", color: "red" },
};

function formatGeneration(memberId: string): string {
  const gen = memberId.slice(2, 4);
  return gen ? `(${gen})` : "";
}

export default function StudyDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const activityGroupId = id != null ? Number(id) : NaN;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivation, setMotivation] = useState("");

  const {
    data: detail,
    isPending,
    isError,
  } = useQuery({
    ...activityQueries.getActivityDetailQuery({ activityGroupId }),
    enabled: Number.isFinite(activityGroupId),
  });

  const { data: appliedData } = useQuery({
    ...activityQueries.getActivityAppliedQuery(),
    enabled: Number.isFinite(activityGroupId) && !!detail,
  });

  const rawItems = appliedData?.items;
  const appliedItems = Array.isArray(rawItems)
    ? rawItems
    : rawItems
      ? [rawItems]
      : [];
  const hasApplied =
    !!detail && appliedItems.some((item) => item.id === detail.id);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMotivation("");
  };

  const applyMutation = useMutation({
    ...activityQueries.postActivityApplyMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityQueries.detailKey({ activityGroupId }),
      });
      queryClient.invalidateQueries({
        queryKey: activityQueries.appliedKey(),
      });
      handleCloseModal();
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!motivation.trim()) return;
    applyMutation.mutate({
      activityGroupId,
      applyReason: motivation.trim(),
    });
  };

  if (!Number.isFinite(activityGroupId)) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-gray-5">
          잘못된 경로입니다.
        </div>
      </Scrollable>
    );
  }

  if (isPending) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-gray-5">
          로딩 중...
        </div>
      </Scrollable>
    );
  }

  if (isError || !detail) {
    return (
      <Scrollable>
        <Header
          left={
            <button className="focus:outline-none" onClick={handleBack}>
              <GoChevronLeft size={24} />
            </button>
          }
        />
        <div className="px-gutter py-gutter text-14-regular text-red-5">
          활동 정보를 불러오지 못했습니다.
        </div>
      </Scrollable>
    );
  }

  const statusInfo = STATUS_MAP[detail.status];
  const leader = detail.groupMembers[0];
  const leaderDescription = leader
    ? `${leader.memberName}${formatGeneration(leader.memberId)}`
    : "-";

  return (
    <Scrollable>
      <Header
        left={
          <button className="focus:outline-none" onClick={handleBack}>
            <GoChevronLeft size={24} />
          </button>
        }
        className="z-999 absolute left-0 right-0 top-0 bg-transparent"
      />

      <div className="absolute left-0 right-0 top-0 h-[40vh] w-full bg-gray-200">
        <img
          src={detail.imageUrl || "/images/no-image.png"}
          alt={detail.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-gutter rounded-t-bottom-navbar gap-3xl pb-bottom-navbar-height relative z-50 mt-[30vh] flex flex-col bg-white pt-10">
        <Section title={detail.name}>
          <p className="text-gray-5">{formatTextToNodes(detail.content)}</p>
        </Section>

        <div className="space-y-xs">
          <Field title="스터디장" description={leaderDescription} />
          <Field title="기술스택" description={detail.techStack || "-"} />
          <Field title="시작일" description={detail.startDate || "-"} />
          <Field title="종료일" description={detail.endDate || "-"} />
        </div>

        <div className="gap-xs flex items-center">
          <Chip color="purple">
            {detail.category === "PROJECT" ? "프로젝트" : "스터디"}
          </Chip>
          <Chip color={statusInfo.color}>{statusInfo.label}</Chip>
        </div>

        <Section title="커리큘럼">
          <p className="text-gray-5">
            {detail.curriculum ? formatTextToNodes(detail.curriculum) : "-"}
          </p>
        </Section>

        <Section title="참여 인원" className="relative">
          <span className="text-13-regular text-gray-5 absolute right-0 top-0.5">
            총 {detail.groupMembers.length}명
          </span>
          <StudyMemberGrid groupMembers={detail.groupMembers} />
        </Section>

        <footer className="z-999 pb-gutter h-bottom-navbar-height px-gutter border-gray-2 fixed bottom-0 left-0 right-0 box-border flex items-center justify-center border-t bg-white">
          {hasApplied ? (
            <Button disabled color="disabled">
              신청완료
            </Button>
          ) : detail.status === "END" ? (
            <Button disabled color="disabled">
              참여 신청
            </Button>
          ) : (
            <Button onClick={handleOpenModal}>참여 신청</Button>
          )}
        </footer>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="활동 참여하기"
        subtitle={`${detail.name} 활동에 참여 신청을 보내요`}
      >
        <Textarea
          placeholder="지원 동기를 간단하게 작성해주세요."
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          maxLength={400}
          showCounter
        />
        <Button
          onClick={handleSubmit}
          disabled={applyMutation.isPending || !motivation.trim()}
        >
          {applyMutation.isPending ? "신청 중..." : "신청하기"}
        </Button>
      </Modal>
    </Scrollable>
  );
}
