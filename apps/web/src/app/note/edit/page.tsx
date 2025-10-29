'use client'

import { useState, useRef } from 'react'
import { Editor, EditorRef } from '@/components/editor'
import { MarkdownEditor } from '@/components/editor/markdown-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, FileText, FileCode, Columns, Layers } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { MarkdownToolbar } from '@/components/editor/markdown-toolbar'

export default function EditArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [layoutMode, setLayoutMode] = useState<'tabs' | 'split'>('tabs')
  const [showMarkdown, setShowMarkdown] = useState(false)
  const editorRef = useRef<EditorRef>(null)

  const handleSave = () => {
    console.log('Saving article:', { title, content, markdown })
    // TODO: Call API to save article
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Article Editor</h1>
          <Badge variant="outline">Beta</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            onClick={() => setLayoutMode(layoutMode === 'tabs' ? 'split' : 'tabs')}
          >
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
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Article
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
          />
        </div>

        {layoutMode === 'tabs' ? (
          <div className="w-full">
            {!showMarkdown ? (
              <Editor 
                ref={editorRef} 
                content={content} 
                onChange={setContent}
                onMarkdownChange={setMarkdown}
                markdownValue={markdown}
                onToggleMarkdown={() => setShowMarkdown(true)}
              />
            ) : (
              <div className="border rounded-lg overflow-visible bg-background">
                <MarkdownToolbar onToggle={() => setShowMarkdown(false)} />
                <MarkdownEditor 
                  value={markdown}
                  onChange={setMarkdown}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <FileText className="h-4 w-4" />
                <h3 className="text-sm font-medium">Rich Text Editor</h3>
              </div>
              <Editor 
                ref={editorRef} 
                content={content} 
                onChange={setContent}
                onMarkdownChange={setMarkdown}
                markdownValue={markdown}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <FileCode className="h-4 w-4" />
                <h3 className="text-sm font-medium">Markdown Source</h3>
              </div>
              <MarkdownEditor 
                value={markdown}
                onChange={setMarkdown}
                className="border rounded-lg overflow-hidden"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
            Advanced Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-1">Access Control</h4>
              <p className="text-sm text-muted-foreground">
                Set password protection, IP restrictions, etc.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-1">Self-Destruct</h4>
              <p className="text-sm text-muted-foreground">
                Automatically destroy after reading
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-1">Attachments</h4>
              <p className="text-sm text-muted-foreground">
                Upload and manage article attachments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
