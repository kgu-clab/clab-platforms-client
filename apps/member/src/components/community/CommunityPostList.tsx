import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import type { BoardCategory } from "@/api/community";
import { boardQueries, newsQueries, jobPostingQueries } from "@/api/community";

import {
  CommunityPostItem,
  NewsPostItem,
  JobPostingItem,
} from "@/components/community";

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

  const { data, isLoading } = useQuery(
    boardQueries.getBoardsByCategoryQuery({
      category,
      sortBy: sort === "popular" ? ["commentCount"] : ["createdAt"],
      sortDirection: ["desc"],
    }),
  );

  const boards = data?.items ?? [];

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

  const categoryQuery = useQuery({
    ...boardQueries.getBoardsByCategoryQuery({
      category: "DEVELOPMENT_QNA",
      ...sortParams,
    }),
    enabled: !hasHashtags,
  });

  const hashtagQuery = useQuery({
    ...boardQueries.getBoardsByHashtagQuery({
      hashtags,
      ...sortParams,
    }),
    enabled: hasHashtags,
  });

  const { data, isLoading } = hasHashtags ? hashtagQuery : categoryQuery;
  const boards = data?.items ?? [];

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
    </div>
  );
}

export function InformationPostList() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") ?? "전체";

  const showNews = filter === "전체" || filter === "IT 소식";
  const showJobPostings = filter === "전체" || filter === "채용 정보";

  const { data: newsData, isLoading: isNewsLoading } = useQuery({
    ...newsQueries.getNewsQuery(),
    enabled: showNews,
  });

  const { data: jobPostingsData, isLoading: isJobPostingsLoading } = useQuery({
    ...jobPostingQueries.getJobPostingsQuery(),
    enabled: showJobPostings,
  });

  const isLoading =
    (showNews && isNewsLoading) || (showJobPostings && isJobPostingsLoading);

  if (isLoading) {
    return <ListMessage message="로딩 중..." />;
  }

  const news = showNews ? (newsData?.items ?? []) : [];
  const jobPostings = showJobPostings ? (jobPostingsData?.items ?? []) : [];

  const hasNoData = news.length === 0 && jobPostings.length === 0;

  if (hasNoData) {
    return <ListMessage message="게시글이 없습니다." />;
  }

  return (
    <div className="flex flex-col">
      {news.map((item) => (
        <NewsPostItem key={`news-${item.id}`} news={item} />
      ))}
      {jobPostings.map((item) => (
        <JobPostingItem key={`job-${item.id}`} jobPosting={item} />
      ))}
    </div>
  );
}
