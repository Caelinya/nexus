import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Article Management</h1>
          <Badge variant="outline">Beta</Badge>
        </div>
        <p className="text-muted-foreground">
          Elegant online article publishing platform with Markdown and LaTeX math formula support
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <Link href="/note/edit">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Article
          </Button>
        </Link>
        <Button variant="outline" size="lg">
          <Search className="h-5 w-5 mr-2" />
          Search Articles
        </Button>
      </div>

      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">No articles yet</p>
        <p className="text-sm">Click &ldquo;New Article&rdquo; to start writing your first article</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">✨ WYSIWYG</h3>
          <p className="text-sm text-muted-foreground">
            Tiptap-based rich text editor with real-time preview
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">📐 LaTeX Support</h3>
          <p className="text-sm text-muted-foreground">
            Complete math formula support powered by KaTeX
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">🔒 Access Control</h3>
          <p className="text-sm text-muted-foreground">
            Advanced features like password protection, IP restriction, and self-destruct
          </p>
        </div>
      </div>
    </div>
  )
}
