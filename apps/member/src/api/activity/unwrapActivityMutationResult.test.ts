import { describe, expect, it } from "vitest";

import { unwrapActivityMutationResult } from "./unwrapActivityMutationResult";
import type { ApiResult } from "../config/api-client-handler";

const http200 = (data: unknown): ApiResult<unknown> => ({
  ok: true,
  status: 200,
  headers: new Headers(),
  data,
});

describe("activity mutation response contract", () => {
  it("unwraps the created activity ID from a successful HTTP 200 response", () => {
    expect(
      unwrapActivityMutationResult(
        http200({ success: true, data: 54 }),
        "활동 생성에 실패했습니다.",
      ),
    ).toBe(54);
  });

  it.each(["활동 생성에 실패했습니다.", "활동 참여 신청에 실패했습니다."])(
    "rejects HTTP 200 business failures with safe feedback: %s",
    (message) => {
      expect(() =>
        unwrapActivityMutationResult(
          http200({
            success: false,
            data: { detail: "private response detail" },
            errorMessage: "INTERNAL_ERROR",
          }),
          message,
        ),
      ).toThrow(new Error(message));
    },
  );

  it("rejects a business failure even when an ID is present", () => {
    expect(() =>
      unwrapActivityMutationResult(
        http200({ success: false, data: 54 }),
        "활동 생성에 실패했습니다.",
      ),
    ).toThrow("활동 생성에 실패했습니다.");
  });

  it.each([
    undefined,
    null,
    {},
    { data: 54 },
    { success: true },
    { success: true, data: null },
    { success: true, data: "54" },
    { success: true, data: {} },
    { success: true, data: 0 },
    { success: true, data: -1 },
    { success: true, data: 1.5 },
    { success: true, data: Number.MAX_SAFE_INTEGER + 1 },
  ])("rejects missing or invalid success data: %j", (payload) => {
    expect(() =>
      unwrapActivityMutationResult(
        http200(payload),
        "활동 생성에 실패했습니다.",
      ),
    ).toThrow("활동 생성에 실패했습니다.");
  });

  it("preserves the existing transport error message", () => {
    expect(() =>
      unwrapActivityMutationResult(
        { ok: false, status: 403, error: { message: "transport error" } },
        "활동 생성에 실패했습니다.",
      ),
    ).toThrow("transport error");
  });
});
