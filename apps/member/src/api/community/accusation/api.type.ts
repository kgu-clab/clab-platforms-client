import type { AccuseMyResponseDto, AccuseStatus } from "./api.model";

export function isAccusation(
  item: Record<string, unknown>,
): item is AccuseMyResponseDto & Record<string, unknown> {
  return "accuseStatus" in item;
}

export const ACCUSE_STATUS_MAP: Record<
  AccuseStatus,
  { label: string; chipColor: "disabled" | "primary" | "red" }
> = {
  PENDING: { label: "검토 중", chipColor: "disabled" },
  APPROVED: { label: "승인됨", chipColor: "primary" },
  REJECTED: { label: "반려됨", chipColor: "red" },
};

export const CARD_TYPE_LABEL: Record<"support" | "accusation", string> = {
  support: "문의",
  accusation: "신고",
};
