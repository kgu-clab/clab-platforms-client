import {
  Button,
  Header,
  Scrollable,
  Section,
  Title,
} from "@clab/design-system";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BiCommentDetail, BiCommentError } from "react-icons/bi";
import { IoCubeOutline } from "react-icons/io5";
import { RiBook2Line, RiFilePaper2Line, RiLogoutBoxLine } from "react-icons/ri";
// import { TbXboxX } from "react-icons/tb";
import { useNavigate } from "react-router";

import { useIsLoggedIn } from "@/model/auth";

import { BottomNavbar } from "@/components/menu";
import {
  MyInfoCard,
  MyMenuItem,
  MyProfileHeader,
  MyStatsCard,
  PasswordChangeModal,
} from "@/components/my";

import { activityQueries } from "@/api/activity/api.query";
import { boardQueries } from "@/api/community/board/api.query";
import { commentQueries } from "@/api/community/comment/api.query";
import { userQueries } from "@/api/user/api.query";
import { ROUTE } from "@/constants";
import { removeTokens } from "@/utils/auth";
import { getDaysSince } from "@/utils/date";

export default function MyPage() {
  const { updateLogged } = useIsLoggedIn();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: userInfo } = useQuery(userQueries.getUserInfoQuery());
  const { name, id, email, contact, githubUrl, imageUrl, createdAt } =
    userInfo?.data ?? {};

  const { data: myBoards } = useQuery(boardQueries.getMyBoardsCountQuery());

  const { data: myComments } = useQuery(
    commentQueries.getMyCommentsQuery({ page: 0, size: 1 }),
  );

  const joinedResults = useQueries({
    queries: ["WAITING", "PROGRESSING", "END"].map((status) =>
      activityQueries.getActivityJoinedQuery({
        status: status as "WAITING" | "PROGRESSING" | "END",
        page: 1,
        size: 1,
      }),
    ),
  });
  const activityCount = joinedResults.reduce(
    (sum, r) => sum + (r.data?.totalItems ?? 0),
    0,
  );
  const boardCount = myBoards ?? 0;
  const commentCount = myComments?.totalItems ?? 0;

  const daysSinceJoin = createdAt ? getDaysSince(createdAt) : null;

  const handleLogout = () => {
    removeTokens();
    updateLogged(false);
    navigate(ROUTE.LOGIN);
  };

  return (
    <>
      <Header
        left={<Title>마이페이지</Title>}
        className="z-100 absolute left-0 right-0 top-0 bg-white"
      />

      <Scrollable className="pt-header-height px-gutter gap-3xl mt-sm">
        <Section className="pb-9 pt-4">
          <MyProfileHeader
            name={name}
            id={id}
            imageUrl={imageUrl}
            daysSinceJoin={daysSinceJoin}
          />

          <MyStatsCard
            activityCount={activityCount}
            boardCount={boardCount}
            commentCount={commentCount}
          />

          <MyInfoCard contact={contact} email={email} githubUrl={githubUrl} />

          <div className="flex justify-end">
            <Button
              size="small"
              color="outlineActive"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              비밀번호 변경
            </Button>
          </div>
        </Section>

        <Section title="활동">
          <MyMenuItem
            to={ROUTE.MY_ACTIVITY}
            label="내 활동"
            icon={IoCubeOutline}
          />
          <MyMenuItem
            to={ROUTE.MY_POSTS}
            label="내가 쓴 글"
            icon={RiFilePaper2Line}
          />
          <MyMenuItem
            to={ROUTE.MY_COMMENTS}
            label="내가 쓴 댓글"
            icon={BiCommentDetail}
          />
          <MyMenuItem
            to={ROUTE.MY_LIBRARY}
            label="도서 대여 내역"
            icon={RiBook2Line}
          />
          <MyMenuItem
            to={ROUTE.SUPPORT}
            label="문의하기"
            icon={BiCommentError}
          />
        </Section>

        <Section title="설정">
          {/* <MyMenuItem to="#" label="알림 설정" icon={IoNotificationsOutline} /> */}
          <MyMenuItem
            label="로그아웃"
            icon={RiLogoutBoxLine}
            onClick={handleLogout}
          />
          {/* <MyMenuItem to="#" label="탈퇴하기" icon={TbXboxX} /> */}
        </Section>
      </Scrollable>

      <BottomNavbar />

      {isPasswordModalOpen && (
        <PasswordChangeModal onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
}
