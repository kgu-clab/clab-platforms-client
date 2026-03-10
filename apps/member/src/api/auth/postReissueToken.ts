import type { TokenFromHeader } from "@/types/auth";

import { authorization } from "@/utils/auth";

import { baseApiClient } from "../config/api-client";
import { END_POINT } from "../config/api-endpoint";

export const postReissueToken = async (
  refreshToken: string,
): Promise<TokenFromHeader> => {
  const response = await baseApiClient.post(END_POINT.AUTH.REISSUE_TOKEN, {
    headers: {
      ...authorization(refreshToken),
    },
  });

  const rawHeader = response.headers.get("X-Clab-Auth");
  if (!rawHeader) {
    throw new Error("Invalid reissue response");
  }

  const token = JSON.parse(rawHeader) as TokenFromHeader;
  if (!token.accessToken || !token.refreshToken) {
    throw new Error("Invalid token response");
  }

  return token;
};
