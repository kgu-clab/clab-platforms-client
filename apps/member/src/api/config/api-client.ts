import ky, {
  type AfterResponseState,
  type BeforeRequestState,
  type KyInstance,
  type KyRequest,
  type KyResponse,
  type NormalizedOptions,
} from "ky";

import { useAuthStore } from "@/model/common";

import { postReissueToken } from "@/api/auth";
import { ROUTE } from "@/constants";

export const baseApiClient = ky.extend({
  prefixUrl: import.meta.env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const beforeRequestHandler = (
  request: KyRequest,
  _options: NormalizedOptions,
  _state: BeforeRequestState,
) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
};

let authApiClientInstance: KyInstance;

const afterResponseHook = async (
  request: KyRequest,
  _options: NormalizedOptions,
  response: KyResponse,
  state: AfterResponseState,
) => {
  if (response.status !== 401 || state.retryCount > 0) {
    return;
  }

  const tokenResponse = await postReissueToken();

  if (tokenResponse.ok) {
    const newToken = tokenResponse.data.result.accessToken;
    useAuthStore.getState().setAccessToken(newToken);
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${newToken}`);
    return authApiClientInstance.retry({
      request: new Request(request.url, {
        method: request.method,
        headers,
        body: request.body,
      }),
      code: "TOKEN_REFRESHED",
    });
  }

  useAuthStore.getState().setAccessToken(undefined);
  if (typeof window !== "undefined") {
    window.location.href = ROUTE.LOGIN;
  }
  return response;
};

authApiClientInstance = baseApiClient.extend({
  hooks: {
    beforeRequest: [beforeRequestHandler],
    afterResponse: [afterResponseHook],
  },
});

export const authApiClient = authApiClientInstance;
