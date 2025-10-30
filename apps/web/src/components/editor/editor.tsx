'use client'

import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react'
import { extensions } from './extensions'
import { ToolbarResponsive } from './toolbar-responsive'
import { StatusBar } from './status-bar'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import { useImperativeHandle, forwardRef, useEffect, useRef } from 'react'

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  onMarkdownChange?: (markdown: string) => void
  markdownValue?: string
  editable?: boolean
  className?: string
  onToggleMarkdown?: () => void
}

export interface EditorRef {
  getMarkdown: () => string
  getEditor: () => TipTapEditor | null
}

export const Editor = forwardRef<EditorRef, EditorProps>(function Editor(
  {
    content = '',
    onChange,
    onMarkdownChange,
    markdownValue,
    editable = true,
    className,
    onToggleMarkdown,
  },
  ref
) {
  const isUpdatingFromMarkdown = useRef(false)
  const onChangeRef = useRef(onChange)
  const onMarkdownChangeRef = useRef(onMarkdownChange)
  
  // Keep refs updated
  useEffect(() => {
    onChangeRef.current = onChange
    onMarkdownChangeRef.current = onMarkdownChange
  })
  
  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Don't trigger updates if we're currently updating from markdown
      if (isUpdatingFromMarkdown.current) {
        return
      }
      
      const html = editor.getHTML()
      onChangeRef.current?.(html)
      
      // Also emit markdown
      if (onMarkdownChangeRef.current) {
        const md = editor.storage.markdown.getMarkdown()
        onMarkdownChangeRef.current(md)
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'focus:outline-none min-h-[400px] px-4 py-3',
          className
        ),
        spellcheck: 'false',
      },
    },
  })

  // Update editor when markdown changes externally
  useEffect(() => {
    if (!editor || !markdownValue || markdownValue === '') return
    
    const currentMarkdown = editor.storage.markdown.getMarkdown()
    if (currentMarkdown === markdownValue) return
    
    isUpdatingFromMarkdown.current = true
    
    queueMicrotask(() => {
      editor.commands.setContent(markdownValue, false, {
        preserveWhitespace: 'full'
      })
      
      isUpdatingFromMarkdown.current = false
      
      const html = editor.getHTML()
      onChangeRef.current?.(html)
      
      if (onMarkdownChangeRef.current) {
        const md = editor.storage.markdown.getMarkdown()
        onMarkdownChangeRef.current(md)
      }
    })
  }, [markdownValue, editor])

  useImperativeHandle(ref, () => ({
    getMarkdown: () => {
      if (!editor) return ''
      return editor.storage.markdown.getMarkdown()
    },
    getEditor: () => editor,
  }))

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background flex flex-col">
      {editable && <ToolbarResponsive editor={editor} onToggleMarkdown={onToggleMarkdown} />}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
      {editable && <StatusBar editor={editor} />}
    </div>
  )
})
