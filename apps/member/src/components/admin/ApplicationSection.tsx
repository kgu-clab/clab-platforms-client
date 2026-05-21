import { Chip, Section } from "@clab/design-system";

import type { ApplicationResponseDto } from "@/api/application";
import type { OpenRecruitmentResponseDto } from "@/api/recruitment";

import AdminListState from "./AdminListState";
import AdminPagination from "./AdminPagination";
import ApplicationCard from "./ApplicationCard";

interface ApplicationSectionProps {
  recruitments: OpenRecruitmentResponseDto[];
  selectedRecruitmentId: number | null;
  applications: ApplicationResponseDto[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isPending: boolean;
  isError: boolean;
  isMutating: boolean;
  onSelectRecruitment: (id: number) => void;
  onApprove: (application: ApplicationResponseDto) => void;
  onReject: (application: ApplicationResponseDto) => void;
  onPageChange: (page: number) => void;
}

export default function ApplicationSection({
  recruitments,
  selectedRecruitmentId,
  applications,
  totalItems,
  currentPage,
  totalPages,
  isPending,
  isError,
  isMutating,
  onSelectRecruitment,
  onApprove,
  onReject,
  onPageChange,
}: ApplicationSectionProps) {
  return (
    <Section title={`가입 신청 ${totalItems}건`}>
      {recruitments.length > 1 && (
        <div className="gap-sm mb-lg flex flex-wrap">
          {recruitments.map((recruitment) => (
            <button
              key={recruitment.id}
              type="button"
              onClick={() => onSelectRecruitment(recruitment.id)}
            >
              <Chip
                color={
                  selectedRecruitmentId === recruitment.id
                    ? "primary"
                    : "disabled"
                }
              >
                {recruitment.title}
              </Chip>
            </button>
          ))}
        </div>
      )}
      <AdminListState
        isPending={isPending}
        isError={isError}
        isEmpty={!isPending && applications.length === 0}
        emptyMessage="처리 대기 중인 가입 신청이 없습니다."
      />
      <div className="gap-md flex flex-col">
        {applications.map((application) => (
          <ApplicationCard
            key={`${application.recruitmentId}-${application.studentId}`}
            application={application}
            isMutating={isMutating}
            onApprove={() => onApprove(application)}
            onReject={() => onReject(application)}
          />
        ))}
      </div>
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Section>
  );
}
