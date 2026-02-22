import { MOCK_POSTS } from "@/mock/community";

import CommunityPostItem from "./CommunityPostItem";

export default function CommunityPostList() {
  return (
    <div className="flex flex-col">
      {MOCK_POSTS.map((post) => (
        <CommunityPostItem
          key={post.postData.id}
          postData={post.postData}
          chipLabel={post.chipLabel}
        />
      ))}
    </div>
  );
}
