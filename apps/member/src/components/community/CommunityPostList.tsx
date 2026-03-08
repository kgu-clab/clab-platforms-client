import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { useInfiniteScroll } from "@/model/common/useInfiniteScroll";

import {
  CommunityPostItem,
  NewsPostItem,
  JobPostingItem,
} from "@/components/community";

import type { BoardCategory } from "@/api/community";
import { boardQueries, newsQueries, jobPostingQueries } from "@/api/community";
import type { JobPostingResponseDto } from "@/api/community/job-posting/api.model";

function ListMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center py-10">
      <span className="text-gray-4 text-14-regular">{message}</span>
    </div>
  );
}

interface BoardPostListProps {
  category: BoardCategory;
}

export function BoardPostList({ category }: BoardPostListProps) {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "latest";

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      boardQueries.getBoardsByCategoryInfiniteQuery({
        category,
        sortBy: sort === "popular" ? ["commentCount"] : ["createdAt"],
        sortDirection: ["desc"],
      }),
    );

  const { bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    useViewport: true,
  });

  const boards = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return <ListMessage message="로딩 중..." />;
  }

  if (boards.length === 0) {
    return <ListMessage message="게시글이 없습니다." />;
  }

  return (
    <div className="flex flex-col">
      {boards.map((post) => (
        <CommunityPostItem key={post.id} post={post} />
      ))}
      <div ref={bottomSentinelRef} />
      {isFetchingNextPage && <ListMessage message="로딩 중..." />}
    </div>
  );
}

export function QuestionPostList() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "latest";
  const language = searchParams.get("language");
  const field = searchParams.get("field");
  const tech = searchParams.get("tech");

  const hashtags = [language, field, tech].filter(
    (v): v is string => v !== null && v !== "all",
  );

  const hasHashtags = hashtags.length > 0;

  const sortParams = {
    sortBy: sort === "popular" ? ["commentCount"] : ["createdAt"],
    sortDirection: ["desc"] as string[],
  };

  const categoryQuery = useInfiniteQuery({
    ...boardQueries.getBoardsByCategoryInfiniteQuery({
      category: "DEVELOPMENT_QNA",
      ...sortParams,
    }),
    enabled: !hasHashtags,
  });

  const hashtagQuery = useInfiniteQuery({
    ...boardQueries.getBoardsByHashtagInfiniteQuery({
      hashtags,
      ...sortParams,
    }),
    enabled: hasHashtags,
  });

  const query = hasHashtags ? hashtagQuery : categoryQuery;
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    query;

  const { bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    useViewport: true,
  });

  const boards = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return <ListMessage message="로딩 중..." />;
  }

  if (boards.length === 0) {
    return <ListMessage message="게시글이 없습니다." />;
  }

  return (
    <div className="flex flex-col">
      {boards.map((post) => (
        <CommunityPostItem key={post.id} post={post} />
      ))}
      <div ref={bottomSentinelRef} />
      {isFetchingNextPage && <ListMessage message="로딩 중..." />}
    </div>
  );
}

export function InformationPostList() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") ?? "IT 소식";

  const showNews = filter === "IT 소식";

  if (showNews) {
    return <NewsPostList />;
  }

  return <JobPostingsPostList />;
}

function NewsPostList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(newsQueries.getNewsInfiniteQuery());

  const { bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    useViewport: true,
  });

  const news = data?.pages.flatMap((page) => page.data.items) ?? [];

  if (isLoading) {
    return <ListMessage message="로딩 중..." />;
  }

  if (news.length === 0) {
    return <ListMessage message="게시글이 없습니다." />;
  }

  return (
    <div className="flex flex-col">
      {news.map((item) => (
        <NewsPostItem key={`news-${item.id}`} news={item} />
      ))}
      <div ref={bottomSentinelRef} />
      {isFetchingNextPage && <ListMessage message="로딩 중..." />}
    </div>
  );
}

function JobPostingsPostList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(jobPostingQueries.getJobPostingsInfiniteQuery());

  const { bottomSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    useViewport: true,
  });

  const jobPostings = data?.pages.flatMap((page) => page.data.items) ?? [];

  if (isLoading) {
    return <ListMessage message="로딩 중..." />;
  }

  if (jobPostings.length === 0) {
    return <ListMessage message="게시글이 없습니다." />;
  }

  return (
    <div className="flex flex-col">
      {jobPostings.map((item) => (
        <JobPostingItem
          key={`job-${item.id}`}
          jobPosting={item as unknown as JobPostingResponseDto}
        />
      ))}
      <div ref={bottomSentinelRef} />
      {isFetchingNextPage && <ListMessage message="로딩 중..." />}
    </div>
  );
}
