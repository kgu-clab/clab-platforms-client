import { API_BASE_URL } from '@/constants/api';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestConfig<TBody = unknown> {
  url: string;
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
}

let extraHeaders: Record<string, string> = {};

export function setHeaders(headers: Record<string, string>): void {
  extraHeaders = { ...headers };
}

export function getHeaders(): Record<string, string> {
  return { ...extraHeaders };
}

type TokenRefreshRef = { tryReissue: () => Promise<boolean> } | null;
let tokenRefreshRef: TokenRefreshRef = null;

export function setTokenRefresh(ref: TokenRefreshRef): void {
  tokenRefreshRef = ref;
}

async function request<TResponse, TBody = never>(
  config: RequestConfig<TBody>,
  isRetry = false
): Promise<{ data: TResponse }> {
  const { url, method = 'GET', body, headers = {} } = config;
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
      ...headers,
    },
    ...(body != null && { body: JSON.stringify(body) }),
  });

  if (res.status === 401 && tokenRefreshRef && !isRetry) {
    const ok = await tokenRefreshRef.tryReissue();
    if (ok) return request(config, true);
  }

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.trimStart().startsWith('<!')) {
      throw new Error(
        'API가 HTML을 반환했습니다. 백엔드 주소가 맞는지 확인하세요. (개발 시 .env에 VITE_API_BASE_URL 또는 VITE_API_PROXY_TARGET 설정)'
      );
    }
    throw new Error(`API가 JSON이 아닌 응답을 반환했습니다: ${contentType}`);
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
