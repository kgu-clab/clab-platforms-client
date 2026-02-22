import { HTTPError } from "got";
import type { Got, OptionsInit, Response } from "got";

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
  client: Got,
  endpoint: string,
  options?: OptionsInit,
): Promise<ApiResult<T>> {
  try {
    const response = (await client(endpoint, {
      ...options,
      responseType: "json",
    })) as Response<T>;

    // 정상 처리 되었을 경우 Ok 타입 반환
    return {
      ok: true,
      status: response.statusCode,
      data: response.body,
    };
  } catch (error) {
    // 에러 감지했을 경우

    // HTTP 에러인 경우
    if (error instanceof HTTPError) {
      const res = error.response;
      let body: ErrMessage;

      // 에러 바디 파싱 시도, 바디 파싱 실패 시 기본 메시지 반환
      try {
        body = (res.body ?? (await res.json())) as ErrMessage;
      } catch {
        return {
          ok: false,
          status: res.statusCode,
          error: { message: "요청에 실패했습니다" } as ErrMessage,
        };
      }

      // 에러 바디 파싱 성공 시 에러 바디 메시지 반환
      return {
        ok: false,
        status: res.statusCode,
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
