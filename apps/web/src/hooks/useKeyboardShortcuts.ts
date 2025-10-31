import { useEffect, useRef, useCallback } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description?: string
  enabled?: boolean // Allow disabling shortcuts conditionally
}

/**
 * Hook to register keyboard shortcuts with optimized performance
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  // Store shortcuts in a ref to avoid recreating event listener
  const shortcutsRef = useRef(shortcuts)
  
  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  // Memoize the event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

    for (const shortcut of shortcutsRef.current) {
      // Skip disabled shortcuts
      if (shortcut.enabled === false) continue
      
      const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatches = shortcut.ctrlOrCmd ? ctrlOrCmd : !ctrlOrCmd
      const shiftMatches = shortcut.shift ? e.shiftKey : !e.shiftKey
      const altMatches = shortcut.alt ? e.altKey : !e.altKey

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        // Don't prevent default if we're in an input/textarea (unless explicitly handling those)
        const target = e.target as HTMLElement
        const isInputField = target.tagName === 'INPUT' ||
                           target.tagName === 'TEXTAREA' ||
                           target.isContentEditable
        
        // Skip shortcuts when typing in input fields (except for save which should work everywhere)
        if (isInputField && shortcut.key !== 's') {
          continue
        }
        
        e.preventDefault()
        e.stopPropagation()
        shortcut.callback()
        break
      }
    }
  }, []) // Empty deps - handler never changes

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown]) // Only depends on the memoized handler
}
