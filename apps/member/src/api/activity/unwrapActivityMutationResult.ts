import type { ApiResult } from "../config/api-client-handler";

export function unwrapActivityMutationResult(
  result: ApiResult<unknown>,
  fallbackMessage: string,
): number {
  if (!result.ok) {
    throw new Error(result.error.message ?? fallbackMessage);
  }

  const response = result.data;
  if (
    !response ||
    typeof response !== "object" ||
    !("success" in response) ||
    response.success !== true ||
    !("data" in response) ||
    typeof response.data !== "number" ||
    !Number.isSafeInteger(response.data) ||
    response.data <= 0
  ) {
    // Backend errorMessage contains internal codes; never display raw payloads.
    throw new Error(fallbackMessage);
  }

  return response.data;
}
