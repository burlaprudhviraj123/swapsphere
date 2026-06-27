import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class names with clsx, then resolve Tailwind conflicts via tailwind-merge. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
