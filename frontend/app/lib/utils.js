import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// need clsx, tailwind-merge & lucide-react

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}