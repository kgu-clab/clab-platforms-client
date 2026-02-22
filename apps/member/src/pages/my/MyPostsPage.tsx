import { Header, Scrollable, Title } from "@clab/design-system";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";

import CommunityPostItem from "@/components/community/CommunityPostItem";

import { MOCK_MY_POSTS } from "@/mock/my";

export default function MyPostsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header
        left={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <GoChevronLeft size={24} />
            <Title>내가 쓴 글</Title>
          </button>
        }
        className="z-100 absolute left-0 right-0 top-0 bg-white"
      />
      <Scrollable className="pt-header-height pb-bottom-padding">
        {MOCK_MY_POSTS.map((post) => (
          <CommunityPostItem key={post.id} postData={post} />
        ))}
      </Scrollable>
    </>
  );
}
