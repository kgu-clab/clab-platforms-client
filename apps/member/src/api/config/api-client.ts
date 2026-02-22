import got, { type HandlerFunction } from "got";

import { useAuthStore } from "@/model/common";

import { postReissueToken } from "@/api/auth";
import { ROUTE } from "@/constants";

export const baseApiClient = got.extend({
  prefixUrl: "", // TODO: API_BASE_URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

const beforeRequestHandler: HandlerFunction = (options, next) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  return next(options);
};

const afterResponseHook = async (
  response: { statusCode: number },
  retryWithMergedOptions: (options: {
    headers: { Authorization: string };
  }) => never,
) => {
  if (response.statusCode !== 401) {
    return response;
  }

  const tokenResponse = await postReissueToken();

  if (tokenResponse.ok) {
    const newToken = tokenResponse.data.result.accessToken;
    useAuthStore.getState().setAccessToken(newToken);
    return retryWithMergedOptions({
      headers: { Authorization: `Bearer ${newToken}` },
    });
  } else {
    useAuthStore.getState().setAccessToken(undefined);
    if (typeof window !== "undefined") {
      window.location.href = ROUTE.LOGIN;
    }
  }

  return response;
};

export const authApiClient = baseApiClient.extend({
  handlers: [beforeRequestHandler],
  hooks: {
    afterResponse: [afterResponseHook],
  },
});
