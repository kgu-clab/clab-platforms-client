import { toast as sonnerToast } from "sonner";
import type { ToastMessages } from "@/constants";

export function showSuccessToast(message: ToastMessages): void {
  sonnerToast.success(message.success);
}

export function showErrorToast(message: ToastMessages): void {
  sonnerToast.error(message.error);
}
