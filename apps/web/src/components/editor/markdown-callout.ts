import { syntaxTree } from '@codemirror/language'
import { Range } from '@codemirror/state'
import { Decoration, DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { EditorView } from '@codemirror/view'

// Callout syntax highlighting for CodeMirror
const calloutRegex = /^>\s*\[!(\w+)\]([+-]?)\s*(.*)$/gm

const calloutDecorations = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view)
    }
  }

  buildDecorations(view: EditorView): DecorationSet {
    const decorations: Range<Decoration>[] = []
    
    for (const { from, to } of view.visibleRanges) {
      const text = view.state.doc.sliceString(from, to)
      const lines = text.split('\n')
      let offset = from
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineStart = offset
        const lineEnd = offset + line.length
        
        // Check if line starts with blockquote
        if (line.startsWith('>')) {
          // Check if it's a callout
          const match = line.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)$/)
          if (match) {
            const [fullMatch, type, collapseMarker, title] = match
            const blockquotePos = lineStart
            const exclamationPos = line.indexOf('!')
            const typeStart = line.indexOf(type)
            const typeEnd = typeStart + type.length
            const titleStart = line.indexOf(title, typeEnd)
            
            // Highlight '> [!'
            decorations.push(
              Decoration.mark({
                class: 'cm-callout-marker'
              }).range(blockquotePos, lineStart + exclamationPos + 1)
            )
            
            // Highlight the type
            decorations.push(
              Decoration.mark({
                class: 'cm-callout-type'
              }).range(lineStart + typeStart, lineStart + typeEnd)
            )
            
            // Highlight the collapse marker if present
            if (collapseMarker) {
              const markerPos = line.indexOf(collapseMarker, typeEnd)
              decorations.push(
                Decoration.mark({
                  class: 'cm-callout-marker'
                }).range(lineStart + markerPos, lineStart + markerPos + 1)
              )
            }
            
            // Highlight the title if present
            if (title.trim()) {
              decorations.push(
                Decoration.mark({
                  class: 'cm-callout-title'
                }).range(lineStart + titleStart, lineEnd)
              )
            }
          } else if (i > 0) {
            // Check if this is a continuation of a callout block
            // Look back to see if we're in a callout context
            let isCalloutContent = false
            for (let j = i - 1; j >= 0; j--) {
              const prevLine = lines[j]
              if (!prevLine.startsWith('>')) {
                break
              }
              if (prevLine.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)?$/)) {
                isCalloutContent = true
                break
              }
            }
            
            if (isCalloutContent) {
              // This is callout content
              decorations.push(
                Decoration.mark({
                  class: 'cm-callout-content'
                }).range(lineStart, lineEnd)
              )
            }
          }
        }
        
        offset = lineEnd + 1 // +1 for newline
      }
    }
    
    return Decoration.set(decorations)
  }
}, {
  decorations: v => v.decorations
})

// Export the extension
export function markdownCallout() {
  return calloutDecorations
}

// Helper to check if a position is inside a callout
export function isInCallout(view: EditorView, pos: number): boolean {
  const line = view.state.doc.lineAt(pos)
  const lineText = line.text
  
  // Check if current line is a callout header
  if (lineText.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)?$/)) {
    return true
  }
  
  // Check if current line is part of a callout block
  if (lineText.startsWith('>')) {
    // Look backwards to find callout header
    let currentLine = line.number - 1
    while (currentLine > 0) {
      const prevLine = view.state.doc.line(currentLine)
      if (!prevLine.text.startsWith('>')) {
        return false
      }
      if (prevLine.text.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)?$/)) {
        return true
      }
      currentLine--
    }
  }
  
  return false
}

// Prevent backslash escaping in callouts
export function preventCalloutEscape(view: EditorView): boolean {
  const selection = view.state.selection.main
  const pos = selection.from
  
  // Check if we're typing inside a callout
  if (isInCallout(view, pos)) {
    const line = view.state.doc.lineAt(pos)
    const beforeCursor = line.text.slice(0, pos - line.from)
    
    // Check if we're typing the callout syntax
    if (beforeCursor.match(/^>\s*\[!?\w*$/)) {
      // We're in the middle of typing a callout, don't escape
      return true
    }
  }
  
  return false
}