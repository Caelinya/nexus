# 快速启动指南

## 启动开发服务器

在项目根目录运行：

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 访问编辑器

浏览器访问以下页面：

- **文章管理主页**: http://localhost:3000/note
- **文章编辑器**: http://localhost:3000/note/edit

## 编辑器功能演示

### 1. 基础文本格式
- 使用工具栏按钮进行**粗体**、*斜体*、下划线等格式化
- 支持标题（H1, H2, H3）
- 无序列表和有序列表
- 引用块和代码块

### 2. LaTeX 数学公式
点击工具栏的 **Σ** 按钮，输入公式例如：

```latex
E = mc^2
```

```latex
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
```

### 3. 代码块
点击代码块按钮，可以插入代码，支持语法高亮

### 4. 链接
点击链接按钮，输入URL即可插入超链接

## 项目结构

```
apps/web/
├── src/
│   ├── app/
│   │   ├── note/
│   │   │   ├── page.tsx          # 文章管理主页
│   │   │   └── edit/
│   │   │       └── page.tsx      # 编辑器页面
│   │   ├── globals.css           # 全局样式（含编辑器样式）
│   │   └── layout.tsx
│   ├── components/
│   │   ├── editor/
│   │   │   ├── editor.tsx        # 主编辑器组件
│   │   │   ├── toolbar.tsx       # 工具栏组件
│   │   │   ├── extensions.ts    # Tiptap扩展配置
│   │   │   └── index.tsx
│   │   └── ui/                   # Shadcn UI 组件
│   └── lib/
│       └── utils.ts
└── package.json
```

## 使用编辑器组件

在你的页面中导入并使用：

```tsx
'use client'

import { useState } from 'react'
import { Editor } from '@/components/editor'

export default function MyPage() {
  const [content, setContent] = useState('')

  return (
    <div>
      <Editor 
        content={content} 
        onChange={setContent}
        editable={true}
      />
    </div>
  )
}
```

## 已安装的依赖

核心编辑器：
- `@tiptap/react` - Tiptap核心
- `@tiptap/starter-kit` - 基础扩展包
- `@tiptap/extension-mathematics` - 数学公式
- `@tiptap/extension-underline` - 下划线
- `@tiptap/extension-link` - 链接
- `@tiptap/extension-code-block-lowlight` - 代码高亮
- `katex` - LaTeX渲染
- `lowlight` - 语法高亮

UI 组件：
- Shadcn/UI (已配置)
- Tailwind CSS 4
- Lucide React (图标)

## 下一步开发

根据 GEMINI.md 的规划，接下来可以实现：

1. **后端API** - 使用Next.js API Routes
2. **数据库** - Prisma + PostgreSQL
3. **认证** - NextAuth.js (Google登录)
4. **文章管理** - CRUD操作
5. **高级功能** - 密码保护、阅后即焚、附件上传等

查看 `EDITOR.md` 获取更多技术细节。
