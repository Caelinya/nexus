'use client'

import { useCallback, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

interface MarkdownEditorProps {
  value: string
  onChange?: (value: string) => void
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  className,
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

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const handleChange = useCallback(
    (val: string) => {
      onChange?.(val)
    },
    [onChange]
  )

  return (
    <div className={className}>
      <CodeMirror
        value={value}
        minHeight="400px"
        maxHeight="none"
        extensions={[
          markdown(),
          EditorView.lineWrapping,
        ]}
        theme={theme === 'dark' ? oneDark : undefined}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        style={{
          fontSize: '15px',
          fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
        }}
      />
    </div>
  )
}
