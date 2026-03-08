import { Field, Section } from "@clab/design-system";

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
}

export default function ActivityManageApplicationList({
  applications,
  isError,
  isFetchingNextPage = false,
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
            {applications.map((app) => (
              <li
                key={app.memberId}
                className="border-gray-2 gap-xs py-lg flex flex-col border-b"
              >
                <Field
                  title="이름"
                  description={`${app.memberName}${formatGeneration(app.memberId)}`}
                />
                <Field title="지원 동기" description={app.applyReason || "-"} />
                {app.status ? (
                  <Field
                    title="상태"
                    description={getStatusLabel(app.status)}
                  />
                ) : null}
                {app.role ? (
                  <Field title="직책" description={getRoleLabel(app.role)} />
                ) : null}
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
