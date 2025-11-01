'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface MermaidRendererProps {
  code: string
  className?: string
}

export function MermaidRenderer({ code, className = '' }: MermaidRendererProps) {
  const { theme } = useTheme()
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!code) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const renderMermaid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        // Configure mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        try {
          const { svg: renderedSvg } = await mermaid.render(id, code)
          
          if (mounted) {
            setSvg(renderedSvg)
            setIsLoading(false)
          }
        } catch (renderError: any) {
          // Clean up any elements created by mermaid
          const element = document.querySelector(`#${id}`)
          if (element) {
            element.remove()
          }
          
          // Also try to remove the mermaid internal elements
          const mermaidElements = document.querySelectorAll(`[id^="d${id}"]`)
          mermaidElements.forEach(el => el.remove())
          
          throw renderError
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Mermaid rendering error:', err)
          setError(err?.message || String(err))
          setIsLoading(false)
        }
      }
    }

    renderMermaid()

    return () => {
      mounted = false
    }
  }, [code, theme])

  if (!code) {
    return (
      <div className={`text-center text-muted-foreground p-4 ${className}`}>
        No Mermaid code provided
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-destructive p-3 border border-destructive/20 rounded-md bg-destructive/10">
          <p className="font-semibold text-sm mb-1">Mermaid Syntax Error</p>
          <pre className="text-xs whitespace-pre-wrap overflow-x-auto">{error}</pre>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center p-8 text-muted-foreground ${className}`}>
        <span>Rendering diagram...</span>
      </div>
    )
  }

  return (
    <div 
      className={`mermaid-output ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px',
        padding: '1rem',
      }}
    />
  )
}