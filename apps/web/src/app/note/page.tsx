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
          <h1 className="text-4xl font-bold">文章管理</h1>
          <Badge variant="outline">Beta</Badge>
        </div>
        <p className="text-muted-foreground">
          优雅的在线文章发布平台，支持 Markdown 和 LaTeX 数学公式
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <Link href="/note/edit">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            新建文章
          </Button>
        </Link>
        <Button variant="outline" size="lg">
          <Search className="h-5 w-5 mr-2" />
          搜索文章
        </Button>
      </div>

      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">还没有文章</p>
        <p className="text-sm">点击&ldquo;新建文章&rdquo;开始创作第一篇文章</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">✨ 所见即所得</h3>
          <p className="text-sm text-muted-foreground">
            基于 Tiptap 的富文本编辑器，支持实时预览
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">📐 LaTeX 支持</h3>
          <p className="text-sm text-muted-foreground">
            完整的数学公式支持，使用 KaTeX 渲染
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">🔒 访问控制</h3>
          <p className="text-sm text-muted-foreground">
            密码保护、IP限制、阅后即焚等高级功能
          </p>
        </div>
      </div>
    </div>
  )
}
