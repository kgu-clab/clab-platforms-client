import type { ApiResponse } from "@/api/config";
import { authApi, END_POINT } from "@/api/config";
import type { ApiResult } from "@/api/config/api-client-handler";

import type { OpenRecruitmentResponseDto } from "./api.model";

export async function getOpenRecruitments(): Promise<
  ApiResult<ApiResponse<OpenRecruitmentResponseDto[]>>
> {
  const res = await authApi.get<ApiResponse<unknown>>(
    END_POINT.RECRUITMENT.OPEN,
  );
  if (!res.ok) return res;

  const raw = res.data.data;
  const list = Array.isArray(raw)
    ? raw
    : isObject(raw) && Array.isArray(raw.items)
      ? raw.items
      : [];

  return {
    ...res,
    data: {
      ...res.data,
      data: list.filter(isOpenRecruitment),
    },
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOpenRecruitment(
  value: unknown,
): value is OpenRecruitmentResponseDto {
  return (
    isObject(value) &&
    typeof value.id === "number" &&
    typeof value.applicationType === "string"
  );
}
