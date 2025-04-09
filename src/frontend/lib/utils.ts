import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useTranslate() {
  const { t } = useTranslation();
  return t;
}

export function getDirection(lang: string): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}
