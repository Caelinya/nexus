import { useEffect } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description?: string
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrlOrCmd ? ctrlOrCmd : !ctrlOrCmd
        const shiftMatches = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatches = shortcut.alt ? e.altKey : !e.altKey

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          e.preventDefault()
          shortcut.callback()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
