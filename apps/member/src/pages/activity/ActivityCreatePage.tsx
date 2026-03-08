import {
  Header,
  Scrollable,
  StepProgressBar,
  Button,
} from "@clab/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import { ActivityCreateProvider, useActivityCreate } from "@/model/activity";

import ActivityCreateStep1 from "@/components/activity/ActivityCreateStep1";
import ActivityCreateStep2 from "@/components/activity/ActivityCreateStep2";

import { activityQueries } from "@/api/activity/api.query";
import { ROUTE, TOAST_MESSAGES } from "@/constants";
import { showSuccessToast } from "@/utils/toast";

function ActivityCreatePageContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    currentStep,
    handlePrev,
    handleNext,
    title,
    category,
    description,
    curriculumList,
    target,
    startDate,
    endDate,
    techStack,
    githubLink,
  } = useActivityCreate();

  const isStep1Valid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    curriculumList.length >= 1 &&
    (curriculumList[0]?.content?.trim() ?? "") !== "";

  const isStep2Valid =
    target.trim() !== "" &&
    startDate.trim() !== "" &&
    endDate.trim() !== "" &&
    techStack.trim() !== "";

  const createMutation = useMutation({
    ...activityQueries.postActivityCreateMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueries.all });
      showSuccessToast(TOAST_MESSAGES.ACTIVITY_CREATE_SUCCESS);
      navigate(ROUTE.ACTIVITY);
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({
      category: category === "study" ? "STUDY" : "PROJECT",
      subject: target,
      name: title,
      content: description,
      imageUrl: "",
      curriculum: curriculumList
        .map(({ label, content }) => `${label}\n${content}`)
        .join("\n\n"),
      startDate,
      endDate,
      techStack,
      githubUrl: githubLink,
    });
  };

  return (
    <>
      <Header
        left={
          <button onClick={() => navigate(-1)}>
            <GoChevronLeft size={24} />
          </button>
        }
        className="fixed left-0 right-0 top-0 bg-white"
      />
      <StepProgressBar
        currentStep={currentStep}
        totalSteps={2}
        className="top-header-height fixed left-0 right-0 bg-white"
      />
      <Scrollable className="gap-3xl pb-bottom-padding pt-[calc(var(--spacing-header-height)+16px)]">
        {currentStep === 1 && <ActivityCreateStep1 />}
        {currentStep === 2 && <ActivityCreateStep2 />}
      </Scrollable>
      <div className="p-xl border-gray-2 fixed bottom-0 left-0 right-0 border-t bg-white">
        <div className="gap-md flex">
          {currentStep > 1 && (
            <Button size="large" color="ghost" onClick={handlePrev}>
              이전
            </Button>
          )}
          {currentStep < 2 ? (
            <Button
              size="large"
              color={currentStep === 1 && !isStep1Valid ? "disabled" : "active"}
              onClick={handleNext}
              disabled={currentStep === 1 && !isStep1Valid}
            >
              다음
            </Button>
          ) : (
            <Button
              size="large"
              color={!isStep2Valid ? "disabled" : "active"}
              onClick={handleSubmit}
              disabled={!isStep2Valid || createMutation.isPending}
            >
              {createMutation.isPending ? "제출 중..." : "제출하기"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function ActivityCreatePage() {
  return (
    <ActivityCreateProvider>
      <ActivityCreatePageContent />
    </ActivityCreateProvider>
  );
}
