'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Sigma,
  CodeSquare,
  ListTodo,
  Table as TableIcon,
  Minus,
  ChevronDown,
  FileCode,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  editor: Editor
  onToggleMarkdown?: () => void
}

const COMMON_LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Shell', value: 'bash' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
]

export function ToolbarResponsive({ editor, onToggleMarkdown }: ToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [mathDialogOpen, setMathDialogOpen] = useState(false)
  const [mathFormula, setMathFormula] = useState('')
  const [codeLanguageOpen, setCodeLanguageOpen] = useState(false)

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
    }
    setLinkUrl('')
    setLinkDialogOpen(false)
  }

  const addMath = () => {
    if (mathFormula) {
      editor.chain().focus().insertContent(`$${mathFormula}$`).run()
    }
    setMathFormula('')
    setMathDialogOpen(false)
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b p-2 bg-muted/30 backdrop-blur-sm">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting Group - Desktop: Individual buttons, Mobile: Dropdown */}
        <div className="hidden md:flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('underline')}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('strike')}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('code')}
            onPressedChange={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Mobile: Text Formatting Dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Bold className="h-4 w-4 mr-1" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Text Format</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(editor.isActive('bold') && 'bg-accent')}
              >
                <Bold className="h-4 w-4 mr-2" />
                Bold
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(editor.isActive('italic') && 'bg-accent')}
              >
                <Italic className="h-4 w-4 mr-2" />
                Italic
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(editor.isActive('underline') && 'bg-accent')}
              >
                <UnderlineIcon className="h-4 w-4 mr-2" />
                Underline
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(editor.isActive('strike') && 'bg-accent')}
              >
                <Strikethrough className="h-4 w-4 mr-2" />
                Strikethrough
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn(editor.isActive('code') && 'bg-accent')}
              >
                <Code className="h-4 w-4 mr-2" />
                Inline Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings - Individual buttons on large screens, dropdown on smaller screens */}
        <div className="hidden lg:flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 1 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Mobile/Tablet: Headings Dropdown */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {editor.isActive('heading', { level: 1 }) ? (
                  <Heading1 className="h-4 w-4 mr-1" />
                ) : editor.isActive('heading', { level: 2 }) ? (
                  <Heading2 className="h-4 w-4 mr-1" />
                ) : editor.isActive('heading', { level: 3 }) ? (
                  <Heading3 className="h-4 w-4 mr-1" />
                ) : (
                  <>
                    <Heading2 className="h-4 w-4 mr-1" />
                  </>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Headings</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editor.isActive('heading', { level: 1 }) && 'bg-accent'
                )}
              >
                <Heading1 className="h-4 w-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editor.isActive('heading', { level: 2 }) && 'bg-accent'
                )}
              >
                <Heading2 className="h-4 w-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editor.isActive('heading', { level: 3 }) && 'bg-accent'
                )}
              >
                <Heading3 className="h-4 w-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists & Blocks - Individual buttons on large screens */}
        <div className="hidden xl:flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('taskList')}
            onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Toggle>
          <DropdownMenu open={codeLanguageOpen} onOpenChange={setCodeLanguageOpen}>
            <DropdownMenuTrigger asChild>
              <div>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('codeBlock')}
                  onPressedChange={(pressed) => {
                    if (!pressed) {
                      editor.chain().focus().toggleCodeBlock().run()
                    } else {
                      setCodeLanguageOpen(true)
                    }
                  }}
                >
                  <CodeSquare className="h-4 w-4" />
                </Toggle>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              {COMMON_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() => {
                    if (editor.isActive('codeBlock')) {
                      // If already in code block, just update the language
                      editor.chain().focus().updateAttributes('codeBlock', {
                        language: lang.value
                      }).run()
                    } else {
                      // If not in code block, create one with the language
                      editor.chain().focus().setCodeBlock({
                        language: lang.value
                      }).run()
                    }
                    setCodeLanguageOpen(false)
                  }}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile/Tablet: Lists & Blocks Dropdown */}
        <div className="xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <List className="h-4 w-4 mr-1" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Lists & Blocks</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(editor.isActive('bulletList') && 'bg-accent')}
              >
                <List className="h-4 w-4 mr-2" />
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(editor.isActive('orderedList') && 'bg-accent')}
              >
                <ListOrdered className="h-4 w-4 mr-2" />
                Numbered List
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={cn(editor.isActive('taskList') && 'bg-accent')}
              >
                <ListTodo className="h-4 w-4 mr-2" />
                Task List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(editor.isActive('blockquote') && 'bg-accent')}
              >
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </DropdownMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={cn(
                      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                      editor.isActive('codeBlock') && 'bg-accent'
                    )}
                  >
                    <CodeSquare className="h-4 w-4 mr-2" />
                    Code Block
                    <ChevronDown className="h-3 w-3 ml-auto" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                  {COMMON_LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => {
                        if (editor.isActive('codeBlock')) {
                          // If already in code block, just update the language
                          editor.chain().focus().updateAttributes('codeBlock', {
                            language: lang.value
                          }).run()
                        } else {
                          // If not in code block, create one with the language
                          editor.chain().focus().setCodeBlock({
                            language: lang.value
                          }).run()
                        }
                      }}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Insert Menu - Individual buttons on large screens */}
        <div className="hidden xl:flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Table</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Horizontal Rule</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkDialogOpen(true)}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMathDialogOpen(true)}
                >
                  <Sigma className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Math Formula</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mobile/Tablet: Insert Dropdown */}
        <div className="xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <TableIcon className="h-4 w-4 mr-1" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Insert</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                <TableIcon className="h-4 w-4 mr-2" />
                Table
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4 mr-2" />
                Horizontal Rule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLinkDialogOpen(true)}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMathDialogOpen(true)}>
                <Sigma className="h-4 w-4 mr-2" />
                Math Formula
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Markdown Toggle (if available) */}
        {onToggleMarkdown && (
          <>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleMarkdown}
                  >
                    <FileCode className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    <p>Switch to Markdown Source</p>
                    <kbd className="px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded border border-border">
                      Ctrl+/
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Math Dialog */}
      <Dialog open={mathDialogOpen} onOpenChange={setMathDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Math Formula</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="formula">LaTeX Formula</Label>
              <Input
                id="formula"
                placeholder="e.g.: E = mc^2"
                value={mathFormula}
                onChange={(e) => setMathFormula(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addMath()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Use LaTeX syntax, e.g.: x^2 + y^2 = z^2
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMathDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMath}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
