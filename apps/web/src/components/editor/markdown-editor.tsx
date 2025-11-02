'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { materialDark, materialLight } from '@uiw/codemirror-theme-material'
import { solarizedLight, solarizedDark } from '@uiw/codemirror-theme-solarized'
import { monokai } from '@uiw/codemirror-theme-monokai'
import { debounce } from '@/lib/debounce'

interface MarkdownEditorProps {
  value: string
  onChange?: (value: string) => void
  className?: string
  editorTheme?: string
  onThemeChange?: (theme: string) => void
}

export function MarkdownEditor({
  value,
  onChange,
  className = '',
  editorTheme = 'auto',
  onThemeChange,
}: MarkdownEditorProps) {
  const [currentTheme, setCurrentTheme] = useState(editorTheme)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  // Get the CodeMirror theme based on the theme name
  const getTheme = () => {
    let themeName = currentTheme
    
    // If auto, use system theme
    if (currentTheme === 'auto') {
      themeName = systemTheme === 'dark' ? 'onedark' : 'github-light'
    }
    
    switch (themeName) {
      case 'onedark':
        return oneDark
      case 'dracula':
        return dracula
      case 'github-dark':
        return githubDark
      case 'github-light':
        return githubLight
      case 'material-dark':
        return materialDark
      case 'material-light':
        return materialLight
      case 'solarized-light':
        return solarizedLight
      case 'solarized-dark':
        return solarizedDark
      case 'monokai':
        return monokai
      default:
        return systemTheme === 'dark' ? oneDark : githubLight
    }
  }

  useEffect(() => {
    setCurrentTheme(editorTheme)
  }, [editorTheme])

  useEffect(() => {
    // Detect system theme
    const isDark = document.documentElement.classList.contains('dark')
    setSystemTheme(isDark ? 'dark' : 'light')

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          setSystemTheme(isDark ? 'dark' : 'light')
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
        theme={getTheme()}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: true,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
        }}
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        }}
      />
    </div>
  )
}
