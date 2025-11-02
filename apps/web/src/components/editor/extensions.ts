import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Mathematics from '@tiptap/extension-mathematics'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Markdown } from 'tiptap-markdown'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { common, createLowlight } from 'lowlight'
import { editorConfig } from '@/config/editor.config'
import { CodeBlockWithSelector } from './code-block-with-selector'
import type { Node as ProsemirrorNode } from '@tiptap/pm/model'

const lowlight = createLowlight(common)

export const extensions = [
  StarterKit.configure({
    codeBlock: false, // We'll use CodeBlockLowlight instead
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    // Disable these so we can add them separately with custom config
    // (StarterKit doesn't include Link and Underline by default, but just to be safe)
  }),
  Typography,
  Underline,
  Link.configure({
    openOnClick: editorConfig.extensions.link.openOnClick,
    autolink: editorConfig.extensions.link.autolink,
    HTMLAttributes: {
      class: 'text-blue-600 underline cursor-pointer',
    },
  }),
  Placeholder.configure({
    placeholder: editorConfig.extensions.placeholder.text,
  }),
  CharacterCount,
  Mathematics.configure({
    katexOptions: {
      throwOnError: editorConfig.extensions.mathKatex.throwOnError,
    },
  }),
  CodeBlockLowlight.extend({
    name: 'codeBlock', // Ensure consistent name with Markdown plugin
    
    addAttributes() {
      return {
        language: {
          default: editorConfig.extensions.codeBlock.defaultLanguage,
          parseHTML: (element: HTMLElement) => {
            // element is the <pre> tag, but language info is on the <code> child
            const code = element.querySelector('code')
            if (code) {
              const classAttribute = code.getAttribute('class') || ''
              const languageMatch = classAttribute.match(/language-(\S+)/)
              if (languageMatch) {
                return languageMatch[1].toLowerCase()
              }
            }

            // Fallback to data-language on <pre> itself
            const dataLanguage = element.getAttribute('data-language')
            if (dataLanguage) {
              return String(dataLanguage).toLowerCase()
            }

            // Fallback to class on <pre> itself
            const preClass = element.getAttribute('class') || ''
            const preLanguageMatch = preClass.match(/language-(\S+)/)
            if (preLanguageMatch) {
              return preLanguageMatch[1].toLowerCase()
            }

            return editorConfig.extensions.codeBlock.defaultLanguage
          },
          rendered: false, // Don't render to HTML directly
        },
      }
    },
    
    // Override parseHTML to capture language from code fence
    parseHTML() {
      return [
        {
          tag: 'pre',
          preserveWhitespace: 'full',
          getAttrs: (node: Node | string) => {
            if (typeof node === 'string') return null
            
            const element = node as HTMLElement
            const code = element.querySelector('code')
            if (!code) return null
            
            // Try to extract language from class
            const classAttribute = code.getAttribute('class') || ''
            const languageMatch = classAttribute.match(/language-(\S+)/)
            const language = (languageMatch ? languageMatch[1] : editorConfig.extensions.codeBlock.defaultLanguage).toLowerCase()
            
            return { language }
          },
        },
      ]
    },
    
    // Override renderHTML to add data-language attribute
    renderHTML({ node, HTMLAttributes }: { node: ProsemirrorNode; HTMLAttributes: Record<string, any> }) {
      const language = (node.attrs.language || editorConfig.extensions.codeBlock.defaultLanguage).toLowerCase()
      
      return [
        'pre',
        {
          ...HTMLAttributes,
          // Keep attribute lowercase; CSS will uppercase the label visually
          'data-language': language,
          class: `${HTMLAttributes.class || ''} language-${language}`.trim(),
        },
        [
          'code',
          {
            class: `language-${language}`,
          },
          0,
        ],
      ]
    },
    
    // Add Markdown support for tiptap-markdown
    addStorage() {
      return {
        markdown: {
          serialize(state: any, node: ProsemirrorNode) {
            const language = node.attrs.language || 'plaintext'
            state.write('```' + language + '\n')
            state.text(node.textContent, false)
            state.ensureNewLine()
            state.write('```')
            state.closeBlock(node)
          },
          parse: {
            // This is called when markdown-it parses a fence token
            updateDOM(dom: HTMLElement) {
              // When markdown-it creates a <pre> element for a fence, update its attributes
              const code = dom.querySelector('code')
              if (!code) return
              
              // markdown-it adds language class like "language-python"
              const classAttribute = code.getAttribute('class') || ''
              const languageMatch = classAttribute.match(/language-(\S+)/)
              
              if (languageMatch) {
                const language = languageMatch[1].toLowerCase()
                // Ensure the class is on the code element
                code.setAttribute('class', `language-${language}`)
              }
            },
          },
        },
      }
    },
    
    // Add custom NodeView for interactive language selector
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockWithSelector)
    },
  }).configure({
    lowlight,
    defaultLanguage: editorConfig.extensions.codeBlock.defaultLanguage,
    HTMLAttributes: {
      class: 'code-block',
    },
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: editorConfig.extensions.table.resizable,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg shadow-md',
    },
    allowBase64: true,
    inline: false,
  }),
  // Markdown must come last to properly serialize all other extensions
  Markdown.configure({
    html: true,
    transformPastedText: true,
    transformCopiedText: true,
    tightLists: true,
  }),
]
