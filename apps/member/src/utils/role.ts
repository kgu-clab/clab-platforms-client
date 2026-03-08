import { ACTIVITY_ROLE_LABELS } from "@/constants/role";

export function getRoleLabel(role: string): string {
  return (ACTIVITY_ROLE_LABELS[role] ?? role) || "멤버";
}

export function getRoleOptions(): { value: string; label: string }[] {
  return Object.entries(ACTIVITY_ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
}
