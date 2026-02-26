import { HTTPError } from "ky";
import type { KyInstance, Options } from "ky";

type ResponseStatus = { status: number };

type Ok<T> = ResponseStatus & {
  ok: true;
  data: T;
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

    const data = (await response.json()) as T;

    return {
      ok: true,
      status: response.status,
      data,
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
