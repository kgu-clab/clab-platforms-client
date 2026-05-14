import {
  Chip,
  Header,
  Scrollable,
  Section,
  Tabs,
  Title,
} from "@clab/design-system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";

import { useDebounce } from "@/model/common/useDebounce";

import {
  AdminListState,
  AdminPagination,
  AdminTabBadge,
  ApplicationSection,
  MemberCard,
  RoleSelectModal,
} from "@/components/admin";
import { ConfirmModal } from "@/components/common";

import { applicationKeys, applicationQueries } from "@/api/application";
import { memberKeys, memberQueries } from "@/api/member";
import type {
  MemberResponseDto,
  MemberRole,
  MemberRoleInfoResponseDto,
} from "@/api/member";
import { recruitmentQueries } from "@/api/recruitment";
import { ROUTE } from "@/constants";
import { getConfirmMessage } from "@/utils/admin";
import type { AdminMemberPendingAction } from "@/utils/admin";

type AdminMemberTab = "MEMBERS" | "APPLICATIONS";
type MemberRoleFilter = "ALL" | Extract<MemberRole, "ADMIN" | "SUPER">;
type AdminMemberItem = MemberResponseDto | MemberRoleInfoResponseDto;

type PendingAction = AdminMemberPendingAction;

const PAGE_SIZE = 20;
const MEMBER_FILTERS = [
  { value: "ALL", label: "전체" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "SUPER", label: "SUPER" },
] as const satisfies ReadonlyArray<{ value: MemberRoleFilter; label: string }>;

export default function AdminMemberPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? "MEMBERS") as AdminMemberTab;
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [memberFilter, setMemberFilter] = useState<MemberRoleFilter>("ALL");
  const [memberPage, setMemberPage] = useState(0);
  const [applicationPage, setApplicationPage] = useState(0);
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<
    number | null
  >(null);
  const [roleModalMember, setRoleModalMember] =
    useState<AdminMemberItem | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const memberSearchParams = useMemo(() => {
    const text = debouncedKeyword.trim();
    if (!text) return {};
    return /^\d+$/.test(text) ? { id: text } : { name: text };
  }, [debouncedKeyword]);

  const memberListQuery = useQuery({
    ...memberQueries.getMembersQuery({
      ...memberSearchParams,
      page: memberPage,
      size: PAGE_SIZE,
    }),
    enabled: tab === "MEMBERS" && memberFilter === "ALL",
  });

  const memberByRoleQuery = useQuery({
    ...memberQueries.getMembersByRoleQuery({
      role: memberFilter === "ALL" ? undefined : memberFilter,
      memberId: memberSearchParams.id,
      memberName: memberSearchParams.name,
      page: memberPage,
      size: PAGE_SIZE,
    }),
    enabled: tab === "MEMBERS" && memberFilter !== "ALL",
  });

  const currentMemberQuery =
    memberFilter === "ALL" ? memberListQuery : memberByRoleQuery;
  const memberPageData =
    currentMemberQuery.data?.ok && currentMemberQuery.data.data.data
      ? currentMemberQuery.data.data.data
      : undefined;
  const members: AdminMemberItem[] = memberPageData?.items ?? [];

  const openRecruitmentsQuery = useQuery(
    recruitmentQueries.getOpenRecruitmentsQuery(),
  );
  const openRecruitments = useMemo(
    () =>
      openRecruitmentsQuery.data?.ok && openRecruitmentsQuery.data.data.data
        ? openRecruitmentsQuery.data.data.data
        : [],
    [openRecruitmentsQuery.data],
  );

  const effectiveRecruitmentId =
    selectedRecruitmentId ?? openRecruitments[0]?.id ?? null;
  const badgeRecruitmentId = openRecruitments[0]?.id;
  const applicationBadgeQuery = useQuery({
    ...applicationQueries.getApplicationConditionsQuery({
      recruitmentId: badgeRecruitmentId,
      isPass: false,
      page: 0,
      size: 1,
    }),
    enabled: typeof badgeRecruitmentId === "number",
  });
  const applicationBadgeCount =
    applicationBadgeQuery.data?.ok && applicationBadgeQuery.data.data.data
      ? applicationBadgeQuery.data.data.data.totalItems
      : 0;

  const applicationQuery = useQuery({
    ...applicationQueries.getApplicationConditionsQuery({
      recruitmentId: effectiveRecruitmentId ?? undefined,
      isPass: false,
      page: applicationPage,
      size: PAGE_SIZE,
    }),
    enabled: tab === "APPLICATIONS" && effectiveRecruitmentId !== null,
  });
  const applicationPageData =
    applicationQuery.data?.ok && applicationQuery.data.data.data
      ? applicationQuery.data.data.data
      : undefined;
  const applications = applicationPageData?.items ?? [];

  const roleMutation = useMutation({
    ...memberQueries.patchMemberRoleMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
  const passwordMutation = useMutation(
    memberQueries.postPasswordResendMutation,
  );
  const deleteMutation = useMutation({
    ...memberQueries.deleteMemberMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
  const approveMutation = useMutation({
    ...applicationQueries.patchApplicationApproveMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
  const rejectMutation = useMutation({
    ...applicationQueries.patchApplicationRejectMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });

  const isMemberMutating =
    roleMutation.isPending ||
    passwordMutation.isPending ||
    deleteMutation.isPending;
  const isApplicationMutating =
    approveMutation.isPending || rejectMutation.isPending;

  const handleConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "role") {
      roleMutation.mutate({
        memberId: pendingAction.memberId,
        body: { role: pendingAction.role },
      });
    }
    if (pendingAction.type === "password") {
      passwordMutation.mutate(pendingAction.memberId);
    }
    if (pendingAction.type === "delete") {
      deleteMutation.mutate(pendingAction.memberId);
    }
    if (pendingAction.type === "approve") {
      approveMutation.mutate({
        recruitmentId: pendingAction.recruitmentId,
        studentId: pendingAction.studentId,
      });
    }
    if (pendingAction.type === "reject") {
      rejectMutation.mutate({
        recruitmentId: pendingAction.recruitmentId,
        studentId: pendingAction.studentId,
      });
    }
    setPendingAction(null);
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
            <Title>회원 관리</Title>
          </button>
        }
        className="absolute left-0 right-0 top-0 bg-white"
      />

      <div className="pt-header-height h-full overflow-y-auto">
        <Tabs>
          <Tabs.Item label="회원" href={ROUTE.ADMIN_MEMBER} />
          <Tabs.Item
            label="신청"
            href={`${ROUTE.ADMIN_MEMBER}?tab=APPLICATIONS`}
            endSlot={<AdminTabBadge count={applicationBadgeCount} />}
          />
        </Tabs>

        {tab === "APPLICATIONS" ? (
          <Scrollable className="px-gutter py-xl">
            <ApplicationSection
              recruitments={openRecruitments}
              selectedRecruitmentId={effectiveRecruitmentId}
              applications={applications}
              totalItems={applicationPageData?.totalItems ?? 0}
              currentPage={applicationPage}
              totalPages={applicationPageData?.totalPages ?? 0}
              isPending={
                openRecruitmentsQuery.isPending || applicationQuery.isPending
              }
              isError={
                openRecruitmentsQuery.isError || applicationQuery.isError
              }
              isMutating={isApplicationMutating}
              onSelectRecruitment={(id) => {
                setSelectedRecruitmentId(id);
                setApplicationPage(0);
              }}
              onApprove={(application) =>
                setPendingAction({
                  type: "approve",
                  recruitmentId: application.recruitmentId,
                  studentId: application.studentId,
                  name: application.name,
                })
              }
              onReject={(application) =>
                setPendingAction({
                  type: "reject",
                  recruitmentId: application.recruitmentId,
                  studentId: application.studentId,
                  name: application.name,
                })
              }
              onPageChange={setApplicationPage}
            />
          </Scrollable>
        ) : (
          <Scrollable className="px-gutter gap-lg py-xl">
            <Section>
              <div className="gap-md flex flex-col">
                <input
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setMemberPage(0);
                  }}
                  placeholder="학번 또는 이름 검색"
                  className="border-gray-2 text-14-regular placeholder:text-gray-4 focus:border-primary rounded-xl border bg-white px-4 py-3 text-black outline-none"
                />
              </div>
            </Section>
            <Section title={`회원 ${memberPageData?.totalItems ?? 0}명`}>
              <div className="gap-sm flex flex-wrap items-center">
                {MEMBER_FILTERS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setMemberFilter(item.value);
                      setMemberPage(0);
                    }}
                  >
                    <Chip
                      color={
                        memberFilter === item.value ? "primary" : "disabled"
                      }
                    >
                      {item.label}
                    </Chip>
                  </button>
                ))}
              </div>
              <AdminListState
                isPending={currentMemberQuery.isPending}
                isError={currentMemberQuery.isError}
                isEmpty={!currentMemberQuery.isPending && members.length === 0}
                emptyMessage="조건에 맞는 회원이 없습니다."
              />
              <div className="gap-md flex flex-col">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isMutating={isMemberMutating}
                    onChangeRole={() => setRoleModalMember(member)}
                    onPasswordResend={() =>
                      setPendingAction({
                        type: "password",
                        memberId: member.id,
                        name: member.name,
                      })
                    }
                    onDelete={() =>
                      setPendingAction({
                        type: "delete",
                        memberId: member.id,
                        name: member.name,
                      })
                    }
                  />
                ))}
              </div>
              <AdminPagination
                currentPage={memberPage}
                totalPages={memberPageData?.totalPages ?? 0}
                onPageChange={setMemberPage}
              />
            </Section>
          </Scrollable>
        )}
      </div>

      {roleModalMember && (
        <RoleSelectModal
          member={roleModalMember}
          onClose={() => setRoleModalMember(null)}
          onSelect={(role) => {
            setRoleModalMember(null);
            setPendingAction({
              type: "role",
              memberId: roleModalMember.id,
              name: roleModalMember.name,
              role,
            });
          }}
        />
      )}

      {pendingAction && (
        <ConfirmModal
          message={getConfirmMessage(pendingAction)}
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirm}
          confirmLabel={pendingAction.type === "delete" ? "삭제" : "확인"}
        />
      )}
    </>
  );
}
