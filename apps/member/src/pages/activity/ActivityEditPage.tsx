import { Header, Scrollable } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";

import {
  ActivityCreateProvider,
  type ActivityCreateInitialValues,
} from "@/model/activity";
import type { CurriculumItem } from "@/model/activity/ActivityCreateContext";

import type { GetActivitiyDetailResponse } from "@/api/activity/api.model";
import { activityQueries } from "@/api/activity/api.query";
import { ROUTE } from "@/constants";

import { ActivityCreatePageContent } from "./ActivityCreatePage";

function parseCurriculum(curriculum: string): CurriculumItem[] {
  if (!curriculum?.trim()) {
    return [{ label: "1주차", content: "" }];
  }
  const blocks = curriculum.split("\n\n").filter((b) => b.trim());
  return blocks.map((block) => {
    const idx = block.indexOf("\n");
    if (idx < 0) return { label: block.trim() || "1주차", content: "" };
    return {
      label: block.slice(0, idx).trim() || "1주차",
      content: block.slice(idx + 1).trim(),
    };
  });
}

function detailToInitialValues(
  data: GetActivitiyDetailResponse["data"],
): ActivityCreateInitialValues {
  return {
    title: data.name ?? "",
    category: data.category === "PROJECT" ? "project" : "study",
    description: data.content ?? "",
    curriculumList: parseCurriculum(data.curriculum ?? ""),
    target: data.subject ?? "",
    startDate: data.startDate ?? "",
    endDate: data.endDate ?? "",
    techStack: data.techStack ?? "",
    githubLink: data.githubUrl ?? "",
  };
}

export default function ActivityEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const activityGroupId = id != null ? Number(id) : NaN;

  const {
    data: detail,
    isPending,
    isError,
  } = useQuery({
    ...activityQueries.getActivityDetailQuery({ activityGroupId }),
    enabled: Number.isFinite(activityGroupId),
  });

  if (!Number.isFinite(activityGroupId)) {
    return (
      <Scrollable>
        <Header
          left={
            <button onClick={() => navigate(-1)}>
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
            <button onClick={() => navigate(-1)}>
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
            <button onClick={() => navigate(-1)}>
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

  if (!detail.isOwner) {
    navigate(ROUTE.ACTIVITY, { replace: true });
    return null;
  }

  const initialValues = detailToInitialValues(detail);

  return (
    <ActivityCreateProvider initialValues={initialValues}>
      <ActivityCreatePageContent editPayload={{ activityGroupId }} />
    </ActivityCreateProvider>
  );
}
