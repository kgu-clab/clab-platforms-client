import { Header, Scrollable, Section } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import {
  IoCalendarOutline,
  IoPeopleOutline,
  IoBookOutline,
} from "react-icons/io5";

import { boardQueries } from "@/api/community";

import { HomeCarousel, HomePostItem, HomeLink } from "@/components/home";
import { BottomNavbar } from "@/components/menu";

import { ROUTE } from "@/constants";

export default function HomePage() {
  const { data: hotBoards = [] } = useQuery(boardQueries.getHotBoardsQuery());

  return (
    <>
      <Header
        left={
          <img src="/logo/logo.svg" alt="clab" className="w-header-height" />
        }
        className="z-fixed absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height gap-3xl pb-bottom-padding">
        <Section className="mt-xl">
          <HomeCarousel />
        </Section>

        <Section title="바로가기" className="px-gutter">
          <div className="gap-lg grid grid-cols-3">
            <HomeLink
              to={ROUTE.ACTIVITY_STUDY}
              icon={<IoCalendarOutline size={32} className="text-primary" />}
              label="내 활동"
            />
            <HomeLink
              to={ROUTE.COMMUNITY}
              icon={<IoPeopleOutline size={32} className="text-primary" />}
              label="커뮤니티"
            />
            <HomeLink
              to={ROUTE.LIBRARY}
              icon={<IoBookOutline size={32} className="text-primary" />}
              label="도서관"
            />
          </div>
        </Section>

        <Section title="커뮤니티 인기 게시글" className="px-gutter">
          <Section.List>
            {hotBoards.map((post) => (
              <HomePostItem
                key={post.id}
                id={String(post.id)}
                category={post.category}
                title={post.title}
                content={post.content}
                author={post.writerName}
                comments={post.commentCount}
              />
            ))}
          </Section.List>
        </Section>
      </Scrollable>
      <BottomNavbar />
    </>
  );
}
