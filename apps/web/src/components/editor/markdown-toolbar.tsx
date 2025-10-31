'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MarkdownToolbarProps {
  onToggle: () => void
}

export function MarkdownToolbar({ onToggle }: MarkdownToolbarProps) {
  return (
    <div className="sticky top-3 z-10 mx-3 my-2 flex items-center gap-2 rounded-lg p-2 bg-background/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm border border-border/50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <FileText className="h-4 w-4 mr-2" />
              Switch to Rich Text
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Return to Rich Text Editor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="ml-auto text-xs text-muted-foreground">
        Markdown Source Mode
      </div>
    </div>
  )
}
