'use client'

import { useRef, useCallback } from 'react'
import { EditorRef } from '@/components/editor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditorState } from '@/hooks/useEditorState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { ArticleEditorHeader } from './components/ArticleEditorHeader'
import { EditorContainer } from './components/EditorContainer'
import { AdvancedOptions } from './components/AdvancedOptions'

export default function EditArticlePage() {
  const editorRef = useRef<EditorRef>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {
    title,
    content,
    markdown,
    layoutMode,
    showMarkdown,
    setTitle,
    setContent,
    setMarkdown,
    toggleLayoutMode,
    setShowMarkdown,
  } = useEditorState()

  const handleSave = useCallback(() => {
    console.log('Saving article:', { title, content, markdown })
    // TODO: Call API to save article
  }, [title, content, markdown])

  const toggleMarkdownView = useCallback(() => {
    if (layoutMode === 'tabs') {
      setShowMarkdown(!showMarkdown)
    }
  }, [layoutMode, showMarkdown, setShowMarkdown])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlOrCmd: true,
      callback: handleSave,
      description: 'Save article'
    },
    {
      key: '/',
      ctrlOrCmd: true,
      callback: toggleMarkdownView,
      description: 'Toggle markdown view'
    },
    {
      key: '\\',
      ctrlOrCmd: true,
      callback: toggleLayoutMode,
      description: 'Toggle layout mode'
    }
  ])

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <ArticleEditorHeader
        layoutMode={layoutMode}
        isMobile={isMobile}
        onToggleLayout={toggleLayoutMode}
        onSave={handleSave}
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
            spellCheck={false}
          />
        </div>

        <EditorContainer
          editorRef={editorRef}
          content={content}
          markdown={markdown}
          layoutMode={layoutMode}
          showMarkdown={showMarkdown}
          isMobile={isMobile}
          onContentChange={setContent}
          onMarkdownChange={setMarkdown}
          onToggleMarkdown={setShowMarkdown}
        />

        <AdvancedOptions />
      </div>
    </div>
  )
}
