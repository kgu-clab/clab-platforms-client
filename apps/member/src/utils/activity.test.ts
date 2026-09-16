import { describe, expect, it } from "vitest";

import { getActivityApplicationState } from "./activity";

describe("activity application eligibility", () => {
  it("allows applications while the activity is progressing", () => {
    expect(getActivityApplicationState("PROGRESSING")).toEqual({
      canApply: true,
      label: "참여 신청",
    });
  });

  it("disables applications while admin approval is pending", () => {
    expect(getActivityApplicationState("WAITING")).toEqual({
      canApply: false,
      label: "관리자 승인 대기 중",
    });
  });

  it("disables applications after the activity ends", () => {
    expect(getActivityApplicationState("END")).toEqual({
      canApply: false,
      label: "종료된 활동",
    });
  });

  it("disables applications before the detail status is available", () => {
    expect(getActivityApplicationState(undefined).canApply).toBe(false);
  });
});
