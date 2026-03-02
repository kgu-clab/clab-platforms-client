import { Button, Chip } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

import type { BoardPost, JobPosting, NewsPost } from "@/api/community";
import { jobPostingQueries } from "@/api/community";

import { ROUTE } from "@/constants";
import { formatRelativeTime } from "@/utils/date";
import {
  getCareerLevelLabel,
  getEmploymentTypeLabel,
  getSourceFromUrl,
} from "@/utils/string";
import CommunityCategoryChip from "./CommunityCategoryChip";

interface BoardPostItemProps {
  post: BoardPost;
}

export function CommunityPostItem({ post }: BoardPostItemProps) {
  const {
    id,
    title,
    createdAt,
    writerName,
    category,
    commentCount,
    boardHashtagInfos,
  } = post;

  const navigate = useNavigate();

  return (
    <div
      className="border-b-gray-2 gap-sm px-gutter py-xl flex cursor-pointer flex-col border-b"
      role="button"
      onClick={() => navigate(`${ROUTE.COMMUNITY}/${id}`)}
    >
      <div className="gap-md flex items-center">
        <CommunityCategoryChip category={category} />
        <span className="text-16-medium truncate text-black">{title}</span>
      </div>
      {boardHashtagInfos.length > 0 && (
        <div className="gap-xs flex flex-wrap">
          {boardHashtagInfos.map((tag) => (
            <Chip key={tag.id} color="primary">
              #{tag.name}
            </Chip>
          ))}
        </div>
      )}
      <div className="text-12-regular text-gray-4 flex items-center justify-between">
        <div className="gap-xs flex items-center">
          <span>{formatRelativeTime(createdAt)}</span>
          <span>|</span>
          <span>{writerName}</span>
        </div>
        <div className="gap-md flex items-center">
          <div className="gap-xs flex items-center">
            <IoChatbubbleOutline className="size-4" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewsPostItemProps {
  news: NewsPost;
}

export function NewsPostItem({ news }: NewsPostItemProps) {
  const { title, articleUrl, createdAt, id, category } = news;

  const navigate = useNavigate();

  return (
    <div
      className="border-b-gray-2 gap-sm px-gutter py-xl flex cursor-pointer flex-col border-b"
      role="button"
      onClick={() => navigate(`${ROUTE.COMMUNITY}/${id}?type=news`)}
    >
      <div className="gap-md flex items-center">
        <CommunityCategoryChip category={category} />
        <span className="text-16-medium truncate text-black">{title}</span>
      </div>
      <div className="text-12-regular text-gray-4 flex items-center">
        <span>{formatRelativeTime(createdAt)}</span>
        <span className="mx-xs">|</span>
        <span>{getSourceFromUrl(articleUrl)}</span>
      </div>
    </div>
  );
}

interface JobPostingItemProps {
  jobPosting: JobPosting;
}

export function JobPostingItem({ jobPosting }: JobPostingItemProps) {
  const { id, title, recruitmentPeriod } = jobPosting;
  const [isOpen, setIsOpen] = useState(false);

  const { data: detail } = useQuery({
    ...jobPostingQueries.getJobPostingQuery(id),
    enabled: isOpen,
  });

  return (
    <div className="border-b-gray-2 gap-md px-gutter py-xl flex flex-col border-b">
      <div
        className="flex cursor-pointer items-center justify-between"
        role="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="gap-sm flex min-w-0 flex-col">
          <div className="gap-md mr-3 flex items-center">
            <CommunityCategoryChip category="job" />
            <span className="text-16-medium truncate text-black">{title}</span>
          </div>
          <div className="text-12-regular text-gray-4 flex items-center">
            <span>{recruitmentPeriod || "채용 기간 없음"}</span>
          </div>
        </div>
        <GoChevronDown
          className={`text-gray-4 size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="gap-md flex flex-col">
          {detail ? (
            <>
              <div className="bg-gray-1 gap-sm flex flex-col rounded-lg p-4">
                {[
                  { label: "회사", value: detail.companyName },
                  {
                    label: "경력",
                    value: getCareerLevelLabel(detail.careerLevel),
                  },
                  {
                    label: "근무 형태",
                    value: getEmploymentTypeLabel(detail.employmentType),
                  },
                  { label: "채용 기간", value: detail.recruitmentPeriod },
                ]
                  .filter((item) => item.value)
                  .map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-13-medium text-gray-4">
                        {label}
                      </span>
                      <span className="text-13-regular text-black">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
              {detail.jobPostingUrl && (
                <div className="flex justify-end">
                  <Button
                    size="small"
                    onClick={() => window.open(detail.jobPostingUrl, "_blank")}
                  >
                    채용 공고 보기
                  </Button>
                </div>
              )}
            </>
          ) : (
            <span className="text-gray-4 text-13-regular">로딩 중...</span>
          )}
        </div>
      )}
    </div>
  );
}
