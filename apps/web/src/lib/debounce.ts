import { EDITOR_CONFIG } from '@/constants/editor'

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = EDITOR_CONFIG.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
