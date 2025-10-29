# 编辑器功能说明

## 已完成的功能

### 编辑器核心组件
- **位置**: `src/components/editor/`
- **主要组件**:
  - `editor.tsx` - 主编辑器组件
  - `toolbar.tsx` - 富文本工具栏
  - `extensions.ts` - Tiptap扩展配置

### 功能特性

#### 1. 富文本编辑
- **文本格式化**: 粗体、斜体、下划线、删除线、行内代码
- **标题**: H1, H2, H3, H4, H5, H6 - **支持 Markdown 输入**（输入 `# ` 自动转换为标题）
- **列表**: 无序列表、有序列表 - **支持 Markdown 输入**（`- ` 或 `* ` 自动转换）
- **其他**: 引用块、代码块 - **支持 Markdown 输入**（`> ` 自动转换引用）

#### 2. LaTeX 数学公式支持
- 使用 `@tiptap/extension-mathematics` 和 KaTeX
- 点击工具栏的 Σ 按钮插入数学公式
- **支持实时渲染**：输入 `$公式$` 会自动渲染
- 示例：`$E=mc^2$`、`$\frac{a}{b}$`

#### 3. 代码高亮
- 使用 `@tiptap/extension-code-block-lowlight`
- 支持多种编程语言语法高亮
- **支持 Markdown 输入**（输入 ``` 开始代码块）

#### 4. 高级功能
- **任务列表**: 支持可勾选的待办事项列表
- **表格**: 插入和编辑表格（可调整大小）
- **水平线**: 快速插入分隔线
- **链接插入**: 点击链接按钮添加超链接，支持自动检测URL
- **Typography**: 自动转换特殊字符（如 `->` 转为 `→`）

#### 5. 其他功能
- **字符计数**: 实时显示字符数
- **撤销/重做**: 支持编辑历史记录
- **实时预览**: 所见即所得，Markdown 输入实时转换
- **占位符提示**: 显示支持的 Markdown 语法提示

## 页面路由

- `/note` - 文章管理主页
- `/note/edit` - 文章编辑页面

## 使用方法

### 运行开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 访问编辑器
打开浏览器访问: `http://localhost:3000/note/edit`

### Markdown 实时渲染示例

编辑器支持在输入时自动渲染 Markdown：

**标题**：
- 输入 `# ` 自动转换为 H1
- 输入 `## ` 自动转换为 H2
- 以此类推...

**列表**：
- 输入 `- ` 或 `* ` 开始无序列表
- 输入 `1. ` 开始有序列表

**引用**：
- 输入 `> ` 开始引用块

**代码块**：
- 输入 ``` 开始代码块

### 使用 LaTeX
**方式1：工具栏**
1. 点击工具栏的 Σ 按钮
2. 输入 LaTeX 公式，例如: `E = mc^2`
3. 点击插入

**方式2：直接输入**
- 直接输入 `$公式$` 会自动渲染
- 例如：`$x^2 + y^2 = z^2$`

### 使用任务列表
1. 点击工具栏的任务列表按钮
2. 输入任务内容
3. 点击复选框标记完成

### 使用表格
1. 点击工具栏的表格按钮（自动插入3x3表格）
2. 点击单元格编辑内容
3. 可以继续添加行列

### 组件使用示例
\`\`\`tsx
import { Editor } from '@/components/editor'

function MyComponent() {
  const [content, setContent] = useState('')
  
  return (
    <Editor 
      content={content} 
      onChange={setContent}
      editable={true}
    />
  )
}
\`\`\`

## 技术栈

- **Next.js 16** (App Router)
- **Tiptap 3.x** - 富文本编辑器
- **KaTeX** - LaTeX 渲染
- **Shadcn/UI** - UI 组件库
- **Tailwind CSS 4** - 样式框架
- **Lowlight** - 代码语法高亮

## 待完成功能（根据GEMINI.md）

- Google 账户登录（NextAuth.js）
- 文章持久化存储（Prisma + PostgreSQL）
- 密码保护
- 阅后即焚
- IP 白/黑名单
- 附件上传与管理
- RESTful API

## 样式定制

编辑器样式在 `src/app/globals.css` 中定义，包括：
- `.ProseMirror` - 编辑器主容器
- `.math-node` - 数学公式节点样式
- `.code-block` - 代码块样式
- 支持深色模式
