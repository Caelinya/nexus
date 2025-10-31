'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { debounce } from '@/lib/debounce'

interface MarkdownEditorProps {
  value: string
  onChange?: (value: string) => void
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  className = '',
}: MarkdownEditorProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Detect system/app theme
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          setTheme(isDark ? 'dark' : 'light')
        }
      })
    })

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Cleanup function to disconnect observer
    return () => {
      observer.disconnect()
    }
  }, [])

  // Debounce onChange to reduce re-renders
  const debouncedOnChange = useMemo(
    () => (onChange ? debounce(onChange, 300) : undefined),
    [onChange]
  )

  const handleChange = useCallback(
    (val: string) => {
      debouncedOnChange?.(val)
    },
    [debouncedOnChange]
  )

  return (
    <div className={`flex-1 overflow-auto ${className}`} spellCheck="false">
      <CodeMirror
        value={value}
        minHeight="400px"
        maxHeight="none"
        extensions={[markdown()]}
        theme={theme === 'dark' ? oneDark : undefined}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: false,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
        }}
        style={{
          fontSize: '15px',
          fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        }}
      />
    </div>
  )
}
