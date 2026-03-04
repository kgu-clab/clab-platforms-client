import { toast as sonnerToast } from "sonner";
import type { ToastMessages } from "@/constants";

/**
 * 성공 토스트 표시
 * @param message - ToastMessages 타입의 메시지 객체 또는 문자열
 */
export function showSuccessToast(message: ToastMessages): void;
export function showSuccessToast(message: string): void;
export function showSuccessToast(message: ToastMessages | string): void {
  const text = typeof message === "string" ? message : message.success;
  if (text) {
    sonnerToast.success(text);
  }
}

/**
 * 에러 토스트 표시
 * @param message - ToastMessages 타입의 메시지 객체 또는 문자열
 */
export function showErrorToast(message: ToastMessages): void;
export function showErrorToast(message: string): void;
export function showErrorToast(message: ToastMessages | string): void {
  const text = typeof message === "string" ? message : message.error;
  sonnerToast.error(text);
}
