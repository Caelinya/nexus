import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, FileText, Columns, Layers } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface ArticleEditorHeaderProps {
  layoutMode: 'tabs' | 'split'
  isMobile: boolean
  onToggleLayout: () => void
  onSave: () => void
}

export function ArticleEditorHeader({
  layoutMode,
  isMobile,
  onToggleLayout,
  onSave,
}: ArticleEditorHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Article Editor</h1>
        <Badge variant="outline">Beta</Badge>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {!isMobile && (
          <Button variant="outline" onClick={onToggleLayout}>
            {layoutMode === 'tabs' ? (
              <>
                <Columns className="h-4 w-4 mr-2" />
                Split View
              </>
            ) : (
              <>
                <Layers className="h-4 w-4 mr-2" />
                Tab View
              </>
            )}
          </Button>
        )}
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Article
        </Button>
      </div>
    </div>
  )
}
