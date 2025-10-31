import { useMemo } from 'react'
import { type Editor } from '@tiptap/react'
import { Separator } from '@/components/ui/separator'
import { CodeThemeSelector } from './code-theme-selector'
import { getWordCount, getReadingTime } from '@/lib/text-stats'

interface StatusBarProps {
  editor: Editor
}

export function StatusBar({ editor }: StatusBarProps) {
  // Calculate text statistics
  const textStats = useMemo(() => {
    const text = editor.getText()
    const characterCount = editor.storage.characterCount?.characters() || 0
    const wordCount = getWordCount(text)
    const readingTime = getReadingTime(wordCount)
    return { characterCount, wordCount, readingTime }
  }, [editor])

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-2 border-t px-3 py-1.5 bg-muted/30 backdrop-blur-sm text-xs text-muted-foreground">
      <div className="flex items-center gap-3">
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
