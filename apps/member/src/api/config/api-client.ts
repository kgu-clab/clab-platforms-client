import ky, {
  type AfterResponseState,
  type KyRequest,
  type KyResponse,
  type NormalizedOptions,
} from "ky";

import { ROUTE } from "@/constants";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from "@/utils/auth";

import { postReissueToken } from "../auth/postReissueToken";

const baseURL = import.meta.env.VITE_BASE_API_URL;

export const BASE_FILE_URL = new URL(baseURL).origin;

let reissueLock = false;

export const baseApiClient = ky.extend({
  prefixUrl: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const beforeRequestHandler = (request: KyRequest) => {
  const token = getAccessToken();
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
};

const afterResponseHook = async (
  request: KyRequest,
  _options: NormalizedOptions,
  response: KyResponse,
  state: AfterResponseState,
): Promise<Response | void> => {
  if (response.status !== 401 || state.retryCount > 0) {
    return;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    removeTokens();
    if (typeof window !== "undefined") {
      window.location.href = ROUTE.LOGIN;
    }
    return response;
  }

  if (reissueLock) {
    return authApiClientInstance.retry({
      request: request.clone(),
      code: "TOKEN_REFRESHED",
    }) as unknown as Response;
  }

  reissueLock = true;
  try {
    const { accessToken: newAccess, refreshToken: newRefresh } =
      await postReissueToken(refreshToken);

    setTokens(newAccess, newRefresh);

    const newRequest = new Request(request.url, {
      method: request.method,
      headers: (() => {
        const h = new Headers(request.headers);
        h.set("Authorization", `Bearer ${newAccess}`);
        return h;
      })(),
      body: request.body,
    });

    return authApiClientInstance.retry({
      request: newRequest,
      code: "TOKEN_REFRESHED",
    }) as unknown as Response;
  } catch {
    removeTokens();
    if (typeof window !== "undefined") {
      window.location.href = ROUTE.LOGIN;
    }
    return response;
  } finally {
    reissueLock = false;
  }
};

const authApiClientInstance = baseApiClient.extend({
  hooks: {
    beforeRequest: [beforeRequestHandler],
    afterResponse: [afterResponseHook],
  },
});

export const authApiClient = authApiClientInstance;
