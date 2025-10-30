import { Node } from '@tiptap/core'
import { defaultMarkdownSerializer } from 'prosemirror-markdown'

/**
 * Custom markdown serializer for code blocks to preserve language info
 */
export const codeBlockMarkdownSerializer = {
  ...defaultMarkdownSerializer.nodes,
  code_block(state: any, node: any) {
    const language = node.attrs.language || 'plaintext'
    state.write('```' + language + '\n')
    state.text(node.textContent, false)
    state.ensureNewLine()
    state.write('```')
    state.closeBlock(node)
  },
}

/**
 * Markdown extension override for code blocks
 */
export const MarkdownCodeBlockExtension = Node.create({
  name: 'codeBlockMarkdown',
  
  addStorage() {
    return {
      markdown: {
        serialize: codeBlockMarkdownSerializer,
      },
    }
  },
})
