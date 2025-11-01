'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from '@/hooks/useTheme'

interface MermaidRendererProps {
  code: string
  className?: string
}

// Initialize mermaid only once
let mermaidInitialized = false

export function MermaidRenderer({ code, className = '' }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (!containerRef.current || !code) {
      setIsLoading(false)
      return
    }

    // Initialize mermaid with theme-appropriate settings
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        themeVariables: {
        primaryColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
        primaryTextColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        primaryBorderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        lineColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
        secondaryColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
        tertiaryColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        background: theme === 'dark' ? '#111827' : '#ffffff',
        mainBkg: theme === 'dark' ? '#1f2937' : '#ffffff',
        secondBkg: theme === 'dark' ? '#374151' : '#f9fafb',
        tertiaryBkg: theme === 'dark' ? '#4b5563' : '#f3f4f6',
        textColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        taskTextColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        taskBkgColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        taskBorderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        activationBorderColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
        activationBkgColor: theme === 'dark' ? '#1e40af' : '#dbeafe',
        labelColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        labelBackgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        sequenceNumberColor: '#ffffff',
        sectionBkgColor: theme === 'dark' ? '#374151' : '#dbeafe',
        altSectionBkgColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
        sectionBkgColor2: theme === 'dark' ? '#4b5563' : '#bfdbfe',
        excludeBkgColor: theme === 'dark' ? '#374151' : '#fee2e2',
        gridColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        doneTaskBkgColor: theme === 'dark' ? '#22c55e' : '#86efac',
        doneTaskBorderColor: theme === 'dark' ? '#16a34a' : '#22c55e',
        critBorderColor: theme === 'dark' ? '#dc2626' : '#ef4444',
        critBkgColor: theme === 'dark' ? '#7f1d1d' : '#fee2e2',
        todayLineColor: theme === 'dark' ? '#dc2626' : '#ef4444',
        personBorder: theme === 'dark' ? '#4b5563' : '#d1d5db',
        personBkg: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        flowchart: {
          curve: 'basis',
          padding: 15,
        },
      })
      mermaidInitialized = true
    }

    const render = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Clear previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
        
        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Create a temporary element for rendering
        const tempDiv = document.createElement('div')
        tempDiv.id = id
        tempDiv.textContent = code
        
        // Parse and render the diagram
        const { svg } = await mermaid.render(id, code)
        
        // Set the rendered SVG to our container
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Add some styling to the SVG
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.display = 'block'
            svgElement.style.margin = '0 auto'
          }
        }
        
        setIsLoading(false)
      } catch (err: any) {
        console.error('Mermaid rendering error:', err)
        setError(err?.message || String(err))
        setIsLoading(false)
      }
    }

    // Delay render to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      render()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      // Clean up any leftover mermaid elements
      const leftoverElements = document.querySelectorAll('[id^="d-mermaid-"]')
      leftoverElements.forEach(el => el.remove())
    }
  }, [code, theme])

  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive/20 rounded-md bg-destructive/10">
        <p className="font-semibold mb-1">Mermaid Syntax Error</p>
        <pre className="text-xs whitespace-pre-wrap overflow-x-auto">{error}</pre>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[100px] p-4">
        <div className="text-muted-foreground">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container ${className}`}
      style={{ minHeight: '100px' }}
    />
  )
}