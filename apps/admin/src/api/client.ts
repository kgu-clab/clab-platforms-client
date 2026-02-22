import { API_BASE_URL } from '@/constants/api';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestConfig<TBody = unknown> {
  url: string;
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
}

async function request<TResponse, TBody = never>(
  config: RequestConfig<TBody>
): Promise<{ data: TResponse }> {
  const { url, method = 'GET', body, headers = {} } = config;
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body != null && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as TResponse;
  return { data };
}

export const server = {
  get: <T>(config: Omit<RequestConfig<never>, 'method' | 'body'>) =>
    request<T>({ ...config, method: 'GET' }),
  post: <TBody, TResponse>(config: RequestConfig<TBody>) =>
    request<TResponse, TBody>({ ...config, method: 'POST' }),
  patch: <TBody, TResponse>(config: RequestConfig<TBody>) =>
    request<TResponse, TBody>({ ...config, method: 'PATCH' }),
  put: <TBody, TResponse>(config: RequestConfig<TBody>) =>
    request<TResponse, TBody>({ ...config, method: 'PUT' }),
  delete: <T>(config: Omit<RequestConfig<never>, 'method' | 'body'>) =>
    request<T>({ ...config, method: 'DELETE' }),
};
