import { useMemo } from 'react'
import { Separator } from '@/components/ui/separator'
import { CodeThemeSelector } from './code-theme-selector'
import { getWordCount, getReadingTime } from '@/lib/text-stats'

interface MarkdownStatusBarProps {
  value: string
}

export function MarkdownStatusBar({ value }: MarkdownStatusBarProps) {
  // Calculate text statistics
  const textStats = useMemo(() => {
    const characterCount = value.length
    const wordCount = getWordCount(value)
    const readingTime = getReadingTime(wordCount)
    const lines = value.split('\n').length
    return { characterCount, wordCount, readingTime, lines }
  }, [value])

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-2 border-t px-3 py-1.5 bg-muted/30 backdrop-blur-sm text-xs text-muted-foreground">
      <div className="flex items-center gap-3">
        <span>{textStats.lines} lines</span>
        <span>·</span>
        <span>{textStats.characterCount} chars</span>
        <span>·</span>
        <span>{textStats.wordCount} words</span>
        <span>·</span>
        <span>{textStats.readingTime} min read</span>
      </div>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-4" />
        <CodeThemeSelector />
      </div>
    </div>
  )
}
