import type { KyInstance, Options } from "ky";

import { authApiClient, baseApiClient } from "./api-client";
import { apiClientHandler, type ApiResult } from "./api-client-handler";

function createHttpMethod(apiClient: KyInstance) {
  const get = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, options);
  };
  const post = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, { method: "POST", ...options });
  };
  const put = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, { method: "PUT", ...options });
  };
  const del = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, { method: "DELETE", ...options });
  };
  const patch = <T>(url: string, options?: Options): Promise<ApiResult<T>> => {
    return apiClientHandler(apiClient, url, { method: "PATCH", ...options });
  };

  return { get, post, put, del, patch };
}

export const baseApi = createHttpMethod(baseApiClient);
export const authApi = createHttpMethod(authApiClient);
