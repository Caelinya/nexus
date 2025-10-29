import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
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
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

export const extensions = [
  StarterKit.configure({
    codeBlock: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
  }),
  Markdown.configure({
    html: true,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  Typography,
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      class: 'text-blue-600 underline cursor-pointer',
    },
  }),
  Placeholder.configure({
    placeholder: '开始写作... 支持 Markdown 语法，如 # 标题、- 列表、> 引用、$公式$',
  }),
  CharacterCount,
  Mathematics.configure({
    katexOptions: {
      throwOnError: false,
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'plaintext',
    HTMLAttributes: {
      class: 'code-block',
    },
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
]
