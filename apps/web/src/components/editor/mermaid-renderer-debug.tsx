'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface MermaidRendererProps {
  code: string
  className?: string
}

export function MermaidRenderer({ code, className = '' }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [status, setStatus] = useState('initializing')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('MermaidRenderer: Received code:', code)
    
    if (!code) {
      setStatus('no-code')
      return
    }

    const loadAndRender = async () => {
      try {
        setStatus('loading-mermaid')
        
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import('mermaid')).default
        
        setStatus('configuring')
        
        // Configure mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
        })
        
        setStatus('rendering')
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}`
        
        // Try to render
        const { svg } = await mermaid.render(id, code)
        
        setStatus('rendered')
        
        // Update container
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Style the SVG
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.display = 'block'
            svgElement.style.margin = '0 auto'
          }
        }
        
      } catch (err: any) {
        console.error('Mermaid error:', err)
        setError(err?.message || String(err))
        setStatus('error')
      }
    }

    // Run after a small delay to ensure DOM is ready
    const timer = setTimeout(loadAndRender, 100)
    
    return () => {
      clearTimeout(timer)
      // Cleanup
      const elements = document.querySelectorAll('[id^="d-mermaid-"]')
      elements.forEach(el => el.remove())
    }
  }, [code, theme])

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className="text-xs text-muted-foreground mb-2">
        Status: {status} | Theme: {theme}
      </div>
      
      {error && (
        <div className="text-destructive text-sm mb-2 p-2 bg-destructive/10 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="mb-2 p-2 bg-muted rounded">
        <div className="text-xs font-mono whitespace-pre-wrap break-all">
          Code: {code}
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="min-h-[100px] flex items-center justify-center"
      >
        {status === 'no-code' && <span className="text-muted-foreground">No code provided</span>}
        {(status === 'initializing' || status === 'loading-mermaid' || status === 'configuring' || status === 'rendering') && 
          <span className="text-muted-foreground">Loading...</span>
        }
      </div>
    </div>
  )
}