import type { KyInstance, Options } from "ky";

import { authApiClient, baseApiClient } from "./api-client";
import { apiClientHandler, type ApiResult } from "./api-client-handler";

function createHttpMethod(apiClient: KyInstance) {
  const get = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, options);
  };

  const post = <T, B>(
    url: string,
    body: B,
    options?: Options,
  ): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, {
      method: "POST",
      json: body,
      ...options,
    });
  };

  const put = <T, B>(
    url: string,
    body: B,
    options?: Options,
  ): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, {
      method: "PUT",
      json: body,
      ...options,
    });
  };

  const postForm = <T>(
    url: string,
    body: FormData,
    options?: Options,
  ): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, {
      method: "POST",
      body,
      ...options,
      headers: {
        "Content-Type": undefined as unknown as string,
        ...options?.headers,
      },
    });
  };

  const del = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, { method: "DELETE", ...options });
  };

  const patch = <T, B>(
    url: string,
    body: B,
    options?: Options,
  ): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, {
      method: "PATCH",
      json: body,
      ...options,
    });
  };

  return { get, post, postForm, put, del, patch };
}

export const baseApi = createHttpMethod(baseApiClient);
export const authApi = createHttpMethod(authApiClient);
