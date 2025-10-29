'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from './extensions'
import { Toolbar } from './toolbar'
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
  getEditor: () => any
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
      onChange?.(html)
      
      // Also emit markdown
      if (onMarkdownChange) {
        const md = editor.storage.markdown.getMarkdown()
        onMarkdownChange(md)
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'focus:outline-none min-h-[400px] px-4 py-3',
          className
        ),
      },
    },
  })

  // Update editor when markdown changes externally
  useEffect(() => {
    if (!editor || !markdownValue || markdownValue === '') return
    
    const currentMarkdown = editor.storage.markdown.getMarkdown()
    if (currentMarkdown === markdownValue) return
    
    isUpdatingFromMarkdown.current = true
    editor.commands.setContent(markdownValue)
    isUpdatingFromMarkdown.current = false
    
    // Immediately trigger onChange to update character count and other states
    const html = editor.getHTML()
    onChange?.(html)
    
    if (onMarkdownChange) {
      const md = editor.storage.markdown.getMarkdown()
      onMarkdownChange(md)
    }
  }, [markdownValue, editor, onChange, onMarkdownChange])

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
    <div className="border rounded-lg overflow-visible bg-background">
      {editable && <Toolbar editor={editor} onToggleMarkdown={onToggleMarkdown} />}
      <EditorContent editor={editor} />
    </div>
  )
})
