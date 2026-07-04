import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Hàm này giúp merge các class Tailwind mà không bị xung đột
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hàm format tiền tệ VNĐ
export function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
