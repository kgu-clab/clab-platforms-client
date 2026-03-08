import { Button, Field, Section } from "@clab/design-system";

type ApplicationItem = {
  memberId: string;
  memberName: string;
  role?: string;
  status?: string;
  applyReason: string;
};

const STATUS_LABELS: Record<string, string> = {
  WAITING: "지원",
  ACCEPTED: "승인",
  REJECTED: "거절",
};

const ROLE_LABELS: Record<string, string> = {
  LEADER: "리더",
  MEMBER: "멤버",
};

function formatGeneration(memberId: string): string {
  const gen = memberId.slice(2, 4);
  return gen ? `(${gen})` : "";
}

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

interface ActivityManageApplicationListProps {
  applications: ApplicationItem[];
  isError: boolean;
  isFetchingNextPage?: boolean;
  onApprove?: (memberId: string) => void;
  onReject?: (memberId: string) => void;
  isMemberStatusPending?: boolean;
}

export default function ActivityManageApplicationList({
  applications,
  isError,
  isFetchingNextPage = false,
  onApprove,
  onReject,
  isMemberStatusPending = false,
}: ActivityManageApplicationListProps) {
  return (
    <Section
      title={
        <>
          지원서 조회
          <span className="text-13-regular ml-sm text-gray-5 font-normal">
            총 {isError ? 0 : applications.length}건
          </span>
        </>
      }
      className="px-gutter mt-lg"
    >
      {isError ? (
        <p className="text-13-regular text-gray-4">
          지원서 목록을 불러올 수 없습니다.
        </p>
      ) : applications.length === 0 && !isFetchingNextPage ? (
        <p className="text-13-regular text-gray-4">지원한 멤버가 없습니다.</p>
      ) : (
        <>
          <ul className="border-gray-2 divide-gray-2 flex flex-col divide-y border-t">
            {applications
              .filter((app) => app.status === "WAITING")
              .map((app) => (
                <li
                  key={app.memberId}
                  className="border-gray-2  gap-xs py-lg relative flex flex-col border-b"
                >
                  <Field
                    title="이름"
                    description={`${app.memberName}${formatGeneration(app.memberId)}`}
                  />
                  <Field
                    title="지원 동기"
                    description={app.applyReason || "-"}
                  />
                  {app.status ? (
                    <Field
                      title="상태"
                      description={getStatusLabel(app.status)}
                    />
                  ) : null}
                  {app.role ? (
                    <Field title="직책" description={getRoleLabel(app.role)} />
                  ) : null}
                  <div className="gap-xs absolute right-0 top-2 flex items-center">
                    <Button
                      size="small"
                      color="outlineActive"
                      onClick={() => onApprove?.(app.memberId)}
                      disabled={isMemberStatusPending}
                    >
                      승인
                    </Button>
                    <Button
                      size="small"
                      color="outlineActive"
                      onClick={() => onReject?.(app.memberId)}
                      disabled={isMemberStatusPending}
                    >
                      거절
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
          {isFetchingNextPage && (
            <p className="py-md text-13-regular text-gray-5 text-center">
              불러오는 중...
            </p>
          )}
        </>
      )}
    </Section>
  );
}
