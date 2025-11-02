'use client'

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { useState, useEffect } from 'react'
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  Bug,
  FileText,
  Quote,
  HelpCircle,
  CheckCircle,
  XCircle,
  List,
  ChevronDown,
  ChevronRight,
  type LucideIcon
} from 'lucide-react'
import type { Node as ProsemirrorNode } from '@tiptap/pm/model'
import type { CalloutType } from './extensions/callout'

import { NodeViewProps } from '@tiptap/react'

interface CalloutRendererProps extends NodeViewProps {
}

// Icon mapping for different callout types
const calloutIcons: Record<CalloutType, LucideIcon> = {
  // Info types
  note: Info,
  info: Info,
  abstract: FileText,
  summary: FileText,
  tldr: FileText,
  // Hint types
  tip: Lightbulb,
  hint: Lightbulb,
  important: Lightbulb,
  // Warning types
  warning: AlertTriangle,
  caution: AlertTriangle,
  attention: AlertTriangle,
  // Danger types
  danger: AlertOctagon,
  error: AlertOctagon,
  bug: Bug,
  // Other types
  example: FileText,
  quote: Quote,
  cite: Quote,
  question: HelpCircle,
  help: HelpCircle,
  faq: HelpCircle,
  todo: List,
  success: CheckCircle,
  check: CheckCircle,
  done: CheckCircle,
  failure: XCircle,
  fail: XCircle,
  missing: XCircle,
}

// Color schemes for different callout types
const calloutColors: Record<CalloutType, { bg: string; border: string; icon: string }> = {
  // Info types
  note: { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-500', icon: 'text-blue-600 dark:text-blue-400' },
  info: { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-500', icon: 'text-blue-600 dark:text-blue-400' },
  abstract: { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-500', icon: 'text-cyan-600 dark:text-cyan-400' },
  summary: { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-500', icon: 'text-cyan-600 dark:text-cyan-400' },
  tldr: { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-500', icon: 'text-cyan-600 dark:text-cyan-400' },
  // Hint types
  tip: { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-500', icon: 'text-emerald-600 dark:text-emerald-400' },
  hint: { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-500', icon: 'text-emerald-600 dark:text-emerald-400' },
  important: { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-500', icon: 'text-emerald-600 dark:text-emerald-400' },
  // Warning types
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-500', icon: 'text-yellow-600 dark:text-yellow-400' },
  caution: { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-500', icon: 'text-yellow-600 dark:text-yellow-400' },
  attention: { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-500', icon: 'text-yellow-600 dark:text-yellow-400' },
  // Danger types
  danger: { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-500', icon: 'text-red-600 dark:text-red-400' },
  error: { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-500', icon: 'text-red-600 dark:text-red-400' },
  bug: { bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-500', icon: 'text-red-600 dark:text-red-400' },
  // Other types
  example: { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-500', icon: 'text-purple-600 dark:text-purple-400' },
  quote: { bg: 'bg-gray-50 dark:bg-gray-950', border: 'border-gray-500', icon: 'text-gray-600 dark:text-gray-400' },
  cite: { bg: 'bg-gray-50 dark:bg-gray-950', border: 'border-gray-500', icon: 'text-gray-600 dark:text-gray-400' },
  question: { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-500', icon: 'text-indigo-600 dark:text-indigo-400' },
  help: { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-500', icon: 'text-indigo-600 dark:text-indigo-400' },
  faq: { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-500', icon: 'text-indigo-600 dark:text-indigo-400' },
  todo: { bg: 'bg-pink-50 dark:bg-pink-950', border: 'border-pink-500', icon: 'text-pink-600 dark:text-pink-400' },
  success: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-500', icon: 'text-green-600 dark:text-green-400' },
  check: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-500', icon: 'text-green-600 dark:text-green-400' },
  done: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-500', icon: 'text-green-600 dark:text-green-400' },
  failure: { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-500', icon: 'text-orange-600 dark:text-orange-400' },
  fail: { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-500', icon: 'text-orange-600 dark:text-orange-400' },
  missing: { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-500', icon: 'text-orange-600 dark:text-orange-400' },
}

export function CalloutRenderer({ node, updateAttributes }: CalloutRendererProps) {
  const type = (node.attrs.type || 'note') as CalloutType
  const title = node.attrs.title || ''
  const collapsedAttr = node.attrs.collapsed
  
  // Determine initial collapsed state
  const initialCollapsed = collapsedAttr === 'true' || collapsedAttr === true
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)
  
  // Update collapsed state when node attributes change
  useEffect(() => {
    const newCollapsed = collapsedAttr === 'true' || collapsedAttr === true
    setIsCollapsed(newCollapsed)
  }, [collapsedAttr])

  const Icon = calloutIcons[type] || Info
  const colors = calloutColors[type] || calloutColors.note
  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1)
  
  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    updateAttributes({ collapsed: newCollapsed })
  }
  
  // Determine if this callout should be collapsible
  const isCollapsible = collapsedAttr !== null

  return (
    <NodeViewWrapper className="callout-wrapper my-4">
      <div
        className={`callout rounded-lg border-l-4 p-4 ${colors.bg} ${colors.border}`}
        data-callout=""
        data-type={type}
        data-title={title}
        data-collapsed={isCollapsed}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h6 className={`font-semibold ${colors.icon}`}>{displayTitle}</h6>
              {isCollapsible && (
                <button
                  onClick={handleToggleCollapse}
                  className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${colors.icon}`}
                  aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
            {!isCollapsed && (
              <div className="callout-content prose prose-sm dark:prose-invert max-w-none">
                <NodeViewContent />
              </div>
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}