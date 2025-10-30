'use client'

import { useRef, useEffect } from 'react'
import { EditorRef } from '@/components/editor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditorState } from '@/hooks/useEditorState'
import { useMediaQuery } from '@/hooks/useMediaQuery'
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

  const handleSave = () => {
    console.log('Saving article:', { title, content, markdown })
    // TODO: Call API to save article
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey

      // Ctrl/Cmd + S: Save
      if (ctrlOrCmd && e.key === 's') {
        e.preventDefault()
        handleSave()
        return
      }

      // Ctrl/Cmd + /: Toggle markdown view (only in tab mode)
      if (ctrlOrCmd && e.key === '/' && layoutMode === 'tabs') {
        e.preventDefault()
        setShowMarkdown(!showMarkdown)
        return
      }

      // Ctrl/Cmd + \: Toggle layout mode
      if (ctrlOrCmd && e.key === '\\') {
        e.preventDefault()
        toggleLayoutMode()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, layoutMode, showMarkdown, setShowMarkdown, toggleLayoutMode])

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
