import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { HashtagRequestDto, HashtagResponseDto } from "./api.model";
import { getHashtags } from "./getHashtags";
import { postHashtag } from "./postHashtag";

export const hashtagQueries = {
  getHashtagsQuery: () =>
    queryOptions({
      queryKey: ["community", "hashtags"],
      queryFn: () => getHashtags(),
      select: (data): HashtagResponseDto[] => (data.ok ? data.data.data : []),
    }),

  postHashtagMutation: mutationOptions<unknown, Error, HashtagRequestDto>({
    mutationFn: (body: HashtagRequestDto) => postHashtag(body),
  }),
};
