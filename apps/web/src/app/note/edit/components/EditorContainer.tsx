import { lazy, Suspense } from 'react'
import { Editor, EditorRef } from '@/components/editor'
import { FileText, FileCode } from 'lucide-react'

const MarkdownEditor = lazy(() => 
  import('@/components/editor/markdown-editor').then(m => ({ default: m.MarkdownEditor }))
)
const MarkdownToolbar = lazy(() => 
  import('@/components/editor/markdown-toolbar').then(m => ({ default: m.MarkdownToolbar }))
)
const MarkdownStatusBar = lazy(() => 
  import('@/components/editor/markdown-status-bar').then(m => ({ default: m.MarkdownStatusBar }))
)

interface EditorContainerProps {
  editorRef: React.RefObject<EditorRef | null>
  content: string
  markdown: string
  layoutMode: 'tabs' | 'split'
  showMarkdown: boolean
  isMobile: boolean
  onContentChange: (content: string) => void
  onMarkdownChange: (markdown: string) => void
  onToggleMarkdown: (show: boolean) => void
}

export function EditorContainer({
  editorRef,
  content,
  markdown,
  layoutMode,
  showMarkdown,
  isMobile,
  onContentChange,
  onMarkdownChange,
  onToggleMarkdown,
}: EditorContainerProps) {
  const LoadingFallback = ({ text = 'Loading...' }: { text?: string }) => (
    <div className="border rounded-lg p-8 text-center text-muted-foreground">
      {text}
    </div>
  )

  // Tab or Mobile mode
  if (layoutMode === 'tabs' || isMobile) {
    return (
      <div className="w-full">
        {!showMarkdown ? (
          <Editor
            ref={editorRef}
            content={content}
            onChange={onContentChange}
            onMarkdownChange={onMarkdownChange}
            markdownValue={markdown}
            onToggleMarkdown={() => onToggleMarkdown(true)}
          />
        ) : (
          <Suspense fallback={<LoadingFallback text="Loading markdown editor..." />}>
            <div className="border rounded-lg overflow-hidden bg-background flex flex-col">
              <MarkdownToolbar onToggle={() => onToggleMarkdown(false)} />
              <MarkdownEditor value={markdown} onChange={onMarkdownChange} />
              <MarkdownStatusBar value={markdown} />
            </div>
          </Suspense>
        )}
      </div>
    )
  }

  // Split view mode
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <FileText className="h-4 w-4" />
          <h3 className="text-sm font-medium">Rich Text Editor</h3>
        </div>
        <Editor
          ref={editorRef}
          content={content}
          onChange={onContentChange}
          onMarkdownChange={onMarkdownChange}
          markdownValue={markdown}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <FileCode className="h-4 w-4" />
          <h3 className="text-sm font-medium">Markdown Source</h3>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <div className="border rounded-lg overflow-hidden bg-background flex flex-col">
            <MarkdownEditor
              value={markdown}
              onChange={onMarkdownChange}
            />
            <MarkdownStatusBar value={markdown} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
