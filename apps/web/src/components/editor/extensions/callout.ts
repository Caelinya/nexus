import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import type { Node as ProsemirrorNode } from '@tiptap/pm/model'

// Callout types mapping
export const CALLOUT_TYPES = [
  // Info types
  'note', 'info', 'abstract', 'summary', 'tldr',
  // Hint types
  'tip', 'hint', 'important',
  // Warning types
  'warning', 'caution', 'attention',
  // Danger types
  'danger', 'error', 'bug',
  // Other types
  'example', 'quote', 'cite',
  'question', 'help', 'faq',
  'todo',
  'success', 'check', 'done',
  'failure', 'fail', 'missing'
] as const

export type CalloutType = typeof CALLOUT_TYPES[number]

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout node
       */
      setCallout: (attributes?: { type?: CalloutType; title?: string; collapsed?: boolean }) => ReturnType
      /**
       * Toggle a callout node
       */
      toggleCallout: (attributes?: { type?: CalloutType; title?: string; collapsed?: boolean }) => ReturnType
    }
  }
}

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
  types: string[]
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',

  addOptions() {
    return {
      HTMLAttributes: {},
      types: CALLOUT_TYPES as unknown as string[],
    }
  },

  content: 'block+',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {}
          }
          return {
            'data-title': attributes.title,
          }
        },
      },
      collapsed: {
        default: null,
        parseHTML: element => element.getAttribute('data-collapsed'),
        renderHTML: attributes => {
          if (attributes.collapsed === null) {
            return {}
          }
          return {
            'data-collapsed': attributes.collapsed,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
        contentElement: '[data-callout-content]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-callout': '' }), 
      ['div', { 'data-callout-content': '' }, 0]
    ]
  },

  addCommands() {
    return {
      setCallout: attributes => ({ commands }) => {
        return commands.setNode(this.name, attributes)
      },
      toggleCallout: attributes => ({ commands }) => {
        return commands.toggleNode(this.name, 'paragraph', attributes)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-n': () => this.editor.commands.toggleCallout({ type: 'note' }),
    }
  },

  // Add support for parsing from Markdown
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: ProsemirrorNode) {
          // Prevent escaping by using raw text output
          const type = node.attrs.type || 'note'
          const title = node.attrs.title || ''
          const collapsed = node.attrs.collapsed
          
          let marker = `> [!${type}]`
          if (collapsed === true) {
            marker = `> [!${type}]-`
          } else if (collapsed === false) {
            marker = `> [!${type}]+`
          }
          
          if (title) {
            marker += ` ${title}`
          }
          
          state.write(marker)
          state.ensureNewLine()
          
          // Serialize content with '> ' prefix
          const oldWrite = state.write
          const oldText = state.text
          const oldEnsureNewLine = state.ensureNewLine
          
          // Override methods to add '> ' prefix
          state.write = function(text?: any) {
            // Handle case where text might be undefined or not a string
            if (text === undefined || text === null) {
              return
            }
            
            const textStr = String(text)
            if (textStr === '') {
              return
            }
            
            const lines = textStr.split('\n')
            lines.forEach((line, index) => {
              if (index > 0) oldWrite.call(state, '\n')
              if (line || index < lines.length - 1) {
                oldWrite.call(state, '> ' + line)
              }
            })
          }
          
          state.text = function(text?: any, escape?: boolean) {
            // Handle case where text might be undefined or not a string
            if (text === undefined || text === null) {
              return
            }
            
            const textStr = String(text)
            const lines = textStr.split('\n')
            lines.forEach((line, index) => {
              if (index > 0) oldWrite.call(state, '\n')
              oldWrite.call(state, '> ')
              oldText.call(state, line, escape)
            })
          }
          
          state.ensureNewLine = function() {
            oldWrite.call(state, '\n> ')
          }
          
          // Render content
          state.renderContent(node)
          
          // Restore original methods
          state.write = oldWrite
          state.text = oldText
          state.ensureNewLine = oldEnsureNewLine
          
          state.closeBlock(node)
        },
        parse: {
          setup(markdownit: any) {
            markdownit.use(createCalloutPlugin())
          },
          updateDOM(dom: HTMLElement, node?: ProsemirrorNode) {
            // The node parameter might not be passed by tiptap-markdown
            // Instead, we'll read the attributes directly from the DOM
            const type = dom.getAttribute('data-type') || 'note'
            const title = dom.getAttribute('data-title')
            const collapsed = dom.getAttribute('data-collapsed')
            
            // Ensure attributes are set
            if (!dom.hasAttribute('data-type')) {
              dom.setAttribute('data-type', type)
            }
          },
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer((() => {
      // Lazy import to avoid circular dependencies
      const { CalloutRenderer } = require('../callout-renderer')
      return CalloutRenderer
    })())
  },
})

// Custom markdown-it plugin to handle callouts
function createCalloutPlugin() {
  return function callout_plugin(md: any) {
    // Custom blockquote parser
    md.block.ruler.before('blockquote', 'callout', function(state: any, startLine: number, endLine: number, silent: boolean) {
      const pos = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]

      // Check for '> ' at start of line
      if (state.src.charCodeAt(pos) !== 0x3E /* > */) {
        return false
      }

      // Check if it's a callout pattern
      const lineText = state.src.slice(pos, max)
      const calloutMatch = lineText.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)/)
      
      if (!calloutMatch) {
        return false
      }

      if (silent) {
        return true
      }

      const [, type, collapseMarker, title] = calloutMatch
      
      // Find the end of the callout block
      let nextLine = startLine + 1
      let contentEndLine = startLine + 1

      // Find all consecutive lines that start with '>'
      for (; nextLine < endLine; nextLine++) {
        const nextPos = state.bMarks[nextLine] + state.tShift[nextLine]
        const nextMax = state.eMarks[nextLine]
        
        if (nextPos >= nextMax) {
          // Empty line, check if next line continues with '>'
          continue
        }
        
        const nextChar = state.src.charCodeAt(nextPos)
        if (nextChar !== 0x3E /* > */) {
          break
        }
        
        contentEndLine = nextLine + 1
      }

      // Create tokens
      const token = state.push('callout_open', 'div', 1)
      token.attrs = [
        ['data-callout', ''],
        ['data-type', type],
      ]
      
      if (title) {
        token.attrs.push(['data-title', title.trim()])
      }
      
      if (collapseMarker === '-') {
        token.attrs.push(['data-collapsed', 'true'])
      } else if (collapseMarker === '+') {
        token.attrs.push(['data-collapsed', 'false'])
      }

      const contentToken = state.push('callout_content_open', 'div', 1)
      contentToken.attrs = [['data-callout-content', '']]

      // Parse callout content lines
      if (contentEndLine > startLine + 1) {
        // Save current state
        const oldLineMax = state.lineMax
        const oldBlkIndent = state.blkIndent
        
        // Set state for content parsing
        state.lineMax = contentEndLine
        state.blkIndent = 0
        
        // Process content lines
        let currentLine = startLine + 1
        while (currentLine < contentEndLine) {
          // Get the line content
          const lineStart = state.bMarks[currentLine] + state.tShift[currentLine]
          const lineEnd = state.eMarks[currentLine]
          const lineText = state.src.slice(lineStart, lineEnd)
          
          if (lineText.startsWith('> ')) {
            // Adjust position to skip '> ' prefix
            state.bMarks[currentLine] = lineStart + 2
          } else if (lineText === '>') {
            // Empty quoted line
            state.bMarks[currentLine] = lineEnd
          }
          
          currentLine++
        }
        
        // Parse the content
        state.md.block.tokenize(state, startLine + 1, contentEndLine)
        
        // Restore state
        state.lineMax = oldLineMax
        state.blkIndent = oldBlkIndent
        state.line = contentEndLine
      }

      // Close tokens
      state.push('callout_content_close', 'div', -1)
      state.push('callout_close', 'div', -1)

      return true
    })

    // Add renderer rules
    md.renderer.rules.callout_open = function(tokens: any[], idx: number) {
      const token = tokens[idx]
      const attrs = token.attrs || []
      let result = '<div'
      
      for (const [key, value] of attrs) {
        result += ` ${key}="${md.utils.escapeHtml(value)}"`
      }
      
      return result + '>'
    }

    md.renderer.rules.callout_content_open = () => '<div data-callout-content="">'
    md.renderer.rules.callout_content_close = () => '</div>'
    md.renderer.rules.callout_close = () => '</div>'
  }
}