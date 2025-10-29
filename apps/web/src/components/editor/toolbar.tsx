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
  type LucideIcon,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
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
import { CodeThemeSelector } from './code-theme-selector'

interface ToolbarProps {
  editor: Editor
  onToggleMarkdown?: () => void
}

interface ToolButtonProps {
  icon: LucideIcon
  onClick: () => void
  isActive?: boolean
  tooltip: string
}

function ToolButton({
  icon: Icon,
  onClick,
  isActive = false,
  tooltip,
}: ToolButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={onClick}
            aria-label={tooltip}
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function Toolbar({ editor, onToggleMarkdown }: ToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [mathDialogOpen, setMathDialogOpen] = useState(false)
  const [mathFormula, setMathFormula] = useState('')

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

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolButton
          icon={Bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip="Bold (Ctrl+B)"
        />
        <ToolButton
          icon={Italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip="Italic (Ctrl+I)"
        />
        <ToolButton
          icon={UnderlineIcon}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          tooltip="Underline (Ctrl+U)"
        />
        <ToolButton
          icon={Strikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          tooltip="Strikethrough"
        />
        <ToolButton
          icon={Code}
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          tooltip="Inline Code"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolButton
          icon={Heading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
          tooltip="Heading 1"
        />
        <ToolButton
          icon={Heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
          tooltip="Heading 2"
        />
        <ToolButton
          icon={Heading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive('heading', { level: 3 })}
          tooltip="Heading 3"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <ToolButton
          icon={List}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          tooltip="Bullet List"
        />
        <ToolButton
          icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          tooltip="Ordered List"
        />
        <ToolButton
          icon={Quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          tooltip="Blockquote"
        />
        <ToolButton
          icon={CodeSquare}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip="Code Block"
        />
        <ToolButton
          icon={ListTodo}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          tooltip="Task List"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

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
            <TooltipContent>
              <p>Insert Table</p>
            </TooltipContent>
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
            <TooltipContent>
              <p>Insert Horizontal Rule</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 mx-1" />

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
            <TooltipContent>
              <p>Insert Link</p>
            </TooltipContent>
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
            <TooltipContent>
              <p>Insert Math Formula (LaTeX)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-auto flex items-center gap-2">
          {onToggleMarkdown && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleMarkdown}
                    >
                      <CodeSquare className="h-4 w-4 mr-2" />
                      Source
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Switch to Markdown Source</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          <CodeThemeSelector />
          <Separator orientation="vertical" className="h-6" />
          <div className="text-xs text-muted-foreground">
            {editor.storage.characterCount.characters()} characters
          </div>
        </div>
      </div>

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
