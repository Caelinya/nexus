'use client'

import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Shell', value: 'bash' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
]

const LANGUAGE_ALIASES: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'shell': 'bash',
  'yml': 'yaml',
  'c++': 'cpp',
  'cs': 'csharp',
  'rb': 'ruby',
  'md': 'markdown',
}

export function CodeBlockWithSelector({ node, updateAttributes, editor }: NodeViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const rawLanguage = node.attrs.language
  const normalizedLang = (rawLanguage || 'plaintext').toLowerCase()
  const language = LANGUAGE_ALIASES[normalizedLang] || normalizedLang
  const selectedLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0]
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (value: string) => {
    updateAttributes({ language: value })
    setIsOpen(false)
  }

  return (
    <NodeViewWrapper className="relative code-block-wrapper">
      <pre className={cn('code-block', `language-${language}`)} data-language={language}>
        {editor.isEditable ? (
          <div className="absolute top-0 left-0 right-0 z-10" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-tl-lg rounded-tr-lg border-b border-border transition-colors"
              contentEditable={false}
            >
              <span className="uppercase tracking-wide">{selectedLang.label}</span>
              <ChevronDown className={cn(
                'h-3 w-3 transition-transform',
                isOpen && 'rotate-180'
              )} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-20">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => handleLanguageChange(lang.value)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors',
                      language === lang.value && 'bg-accent text-accent-foreground'
                    )}
                    contentEditable={false}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute top-0 left-0 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground bg-muted/50 rounded-tl-lg border-b border-border">
            {selectedLang.label}
          </div>
        )}
        <code
          className={cn(`language-${language}`, 'pt-10')}
          style={{ display: 'block' }}
        >
          <NodeViewContent as="span" />
        </code>
      </pre>
    </NodeViewWrapper>
  )
}
