import { Chip, Section } from "@clab/design-system";

import type { ApplicationResponseDto } from "@/api/application";
import type { RecruitmentDetailsResponseDto } from "@/api/recruitment";

import AdminListState from "./AdminListState";
import AdminPagination from "./AdminPagination";
import ApplicationCard from "./ApplicationCard";

export type ApplicationPassFilter = "ALL" | "PASS" | "FAIL";

interface ApplicationSectionProps {
  recruitments: RecruitmentDetailsResponseDto[];
  selectedRecruitmentId: number | null;
  passFilter: ApplicationPassFilter;
  applications: ApplicationResponseDto[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isPending: boolean;
  isError: boolean;
  isMutating: boolean;
  onSelectRecruitment: (id: number) => void;
  onSelectPassFilter: (filter: ApplicationPassFilter) => void;
  onApprove: (application: ApplicationResponseDto) => void;
  onReject: (application: ApplicationResponseDto) => void;
  onPageChange: (page: number) => void;
}

export default function ApplicationSection({
  recruitments,
  selectedRecruitmentId,
  passFilter,
  applications,
  totalItems,
  currentPage,
  totalPages,
  isPending,
  isError,
  isMutating,
  onSelectRecruitment,
  onSelectPassFilter,
  onApprove,
  onReject,
  onPageChange,
}: ApplicationSectionProps) {
  return (
    <Section title={`가입 신청 ${totalItems}건`}>
      {recruitments.length > 0 && (
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
      <div className="gap-sm mb-lg flex flex-wrap">
        {(
          [
            ["ALL", "전체"],
            ["PASS", "합격"],
            ["FAIL", "불합격"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelectPassFilter(value)}
          >
            <Chip color={passFilter === value ? "primary" : "disabled"}>
              {label}
            </Chip>
          </button>
        ))}
      </div>
      <AdminListState
        isPending={isPending}
        isError={isError}
        isEmpty={
          selectedRecruitmentId !== null &&
          !isPending &&
          applications.length === 0
        }
        emptyMessage="조건에 맞는 가입 신청이 없습니다."
      />
      {selectedRecruitmentId === null && !isPending && !isError && (
        <div className="text-14-regular text-gray-4 py-2xl text-center">
          조회할 모집 공고를 선택해 주세요.
        </div>
      )}
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
