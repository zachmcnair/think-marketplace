import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the app, ensuring it has a protocol.
 * Handles Railway env vars that may omit https://
 */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace.thinkagents.ai';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}
