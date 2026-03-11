import { decode } from "html-entities";
import { HTTPError } from "ky";
import type { KyInstance, Options } from "ky";

function decodeStrings<T>(value: T): T {
  if (typeof value === "string") return decode(value) as T;
  if (Array.isArray(value)) return value.map(decodeStrings) as T;
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = decodeStrings(v);
    }
    return result as T;
  }
  return value;
}

type ResponseStatus = { status: number };

type Ok<T> = ResponseStatus & {
  ok: true;
  data: T;
  headers: Headers;
};

type Err = ResponseStatus & {
  ok: false;
  error: ErrMessage;
};

type ErrMessage = { message: string };

export type ApiResult<T> = Ok<T> | Err;

export async function apiClientHandler<T>(
  client: KyInstance,
  endpoint: string,
  options?: Options,
): Promise<ApiResult<T>> {
  try {
    const response = await client(endpoint, {
      ...options,
    });

    const data = decodeStrings((await response.json()) as T);

    return {
      ok: true,
      status: response.status,
      data,
      headers: response.headers,
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      const res = error.response;
      let body: ErrMessage;

      try {
        body = (await res.json()) as ErrMessage;
      } catch {
        return {
          ok: false,
          status: res.status,
          error: { message: "요청에 실패했습니다" } as ErrMessage,
        };
      }

      return {
        ok: false,
        status: res.status,
        error: body,
      };
    }

    const message =
      error instanceof Error ? error.message : "요청에 실패했습니다";
    return {
      ok: false,
      status: 0,
      error: { message },
    };
  }
}
