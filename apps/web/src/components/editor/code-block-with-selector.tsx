'use client'

import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Lazy load MermaidRenderer to avoid SSR issues
const MermaidRenderer = lazy(() =>
  import('./mermaid-renderer-interactive').then(mod => ({ default: mod.MermaidRendererInteractive }))
)

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
  { label: 'Mermaid', value: 'mermaid' },
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

// Threshold for auto-collapse (number of lines)
const AUTO_COLLAPSE_THRESHOLD = 20

export function CodeBlockWithSelector({ node, updateAttributes, editor }: NodeViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  
  const rawLanguage = node.attrs.language
  const normalizedLang = (rawLanguage || 'plaintext').toLowerCase()
  const language = LANGUAGE_ALIASES[normalizedLang] || normalizedLang
  const selectedLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0]
  
  // Calculate initial collapsed state based on line count
  const codeContent = node.textContent || ''
  const lineCount = codeContent.split('\n').length
  const shouldAutoCollapse = lineCount > AUTO_COLLAPSE_THRESHOLD
  
  const [collapsed, setCollapsed] = useState(shouldAutoCollapse)

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return
    
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const dropdownHeight = 256 // max-h-64 = 16rem = 256px
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const dropdownWidth = 192 // w-48 = 12rem = 192px
    
    let top = buttonRect.bottom + 2 // 2px gap
    let left = buttonRect.left
    
    // Check if dropdown would go below viewport
    if (top + dropdownHeight > viewportHeight && buttonRect.top > dropdownHeight) {
      // Position above the button
      top = buttonRect.top - dropdownHeight - 2 // 2px gap
    }
    
    // Check if dropdown would go outside right edge
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 8 // 8px margin
    }
    
    // Ensure minimum left position
    if (left < 8) {
      left = 8
    }
    
    setDropdownPosition({ top, left })
  }

  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure button is rendered before calculating position
      requestAnimationFrame(() => {
        calculateDropdownPosition()
      })
      
      // Update position on scroll or resize
      const handlePositionUpdate = () => {
        if (isOpen) {
          calculateDropdownPosition()
        }
      }
      
      window.addEventListener('scroll', handlePositionUpdate, true) // capture phase to catch all scroll events
      window.addEventListener('resize', handlePositionUpdate)
      
      return () => {
        window.removeEventListener('scroll', handlePositionUpdate, true)
        window.removeEventListener('resize', handlePositionUpdate)
      }
    } else {
      // Reset position when closing
      setDropdownPosition(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        handleClose()
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
    setDropdownPosition(null)
  }
  
  const handleClose = () => {
    setIsOpen(false)
    setDropdownPosition(null)
  }

  return (
    <>
      <NodeViewWrapper className="relative code-block-wrapper" style={{ overflow: 'visible' }}>
        <pre className={cn('code-block', `language-${language}`, 'relative')} data-language={language}>
          {/* Language selector */}
          {editor.isEditable ? (
            <div className="absolute top-0 left-0 z-10">
              <button
                ref={buttonRef}
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
            </div>
          ) : (
            <div className="absolute top-0 left-0 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground bg-muted/50 rounded-tl-lg rounded-tr-lg border-b border-border">
              {selectedLang.label}
            </div>
          )}
          
          {/* Collapse button - show always if content is long enough */}
          {(editor.isEditable || shouldAutoCollapse) && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-0 right-0 z-10 flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-tr-lg rounded-tl-lg border-b border-border transition-colors"
              contentEditable={false}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
          )}
          
          {/* Code content */}
          <div className={cn('relative', collapsed && 'max-h-[288px] overflow-hidden')}>
            <code
              className={cn(`language-${language}`, 'pt-10 block')}
            >
              <NodeViewContent />
            </code>
            {/* Gradient fade effect when collapsed - more subtle */}
            {collapsed && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent dark:from-zinc-900/90 dark:via-zinc-900/50 pointer-events-none" />
                <div className="absolute bottom-2 left-4 right-4 text-xs text-muted-foreground flex items-center gap-2">
                  <span>···</span>
                  <span className="italic">Click ▼ to expand</span>
                </div>
              </>
            )}
          </div>
        </pre>
        
        {/* Render Mermaid diagram if language is mermaid */}
        {language === 'mermaid' && codeContent && (
          <div className="mt-4">
            <div className="mb-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Interactive Mermaid Preview
            </div>
            <Suspense fallback={
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading interactive diagram...</span>
              </div>
            }>
              <MermaidRenderer code={codeContent} />
            </Suspense>
          </div>
        )}
      </NodeViewWrapper>

      {/* Dropdown menu rendered outside of the code block */}
      {isOpen && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed w-48 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto z-[100]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
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
    </>
  )
}
