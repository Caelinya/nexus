import { useState, useCallback } from 'react'

export type LayoutMode = 'tabs' | 'split'

interface EditorState {
  title: string
  content: string
  markdown: string
  layoutMode: LayoutMode
  showMarkdown: boolean
}

export function useEditorState(initialState?: Partial<EditorState>) {
  const [state, setState] = useState<EditorState>({
    title: initialState?.title || '',
    content: initialState?.content || '',
    markdown: initialState?.markdown || '',
    layoutMode: initialState?.layoutMode || 'tabs',
    showMarkdown: initialState?.showMarkdown || false,
  })

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }))
  }, [])

  const setContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, content }))
  }, [])

  const setMarkdown = useCallback((markdown: string) => {
    setState((prev) => ({ ...prev, markdown }))
  }, [])

  const setLayoutMode = useCallback((layoutMode: LayoutMode) => {
    setState((prev) => ({ ...prev, layoutMode }))
  }, [])

  const toggleLayoutMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      layoutMode: prev.layoutMode === 'tabs' ? 'split' : 'tabs',
    }))
  }, [])

  const setShowMarkdown = useCallback((showMarkdown: boolean) => {
    setState((prev) => ({ ...prev, showMarkdown }))
  }, [])

  const toggleMarkdownView = useCallback(() => {
    setState((prev) => ({ ...prev, showMarkdown: !prev.showMarkdown }))
  }, [])

  return {
    ...state,
    setTitle,
    setContent,
    setMarkdown,
    setLayoutMode,
    toggleLayoutMode,
    setShowMarkdown,
    toggleMarkdownView,
  }
}
