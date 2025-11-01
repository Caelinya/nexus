'use client'

import React, { useState, useRef, useEffect, WheelEvent, MouseEvent } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface MermaidRendererProps {
  code: string
  className?: string
}

const MIN_SCALE = 0.25
const MAX_SCALE = 4
const ZOOM_SPEED_FACTOR = 0.005

export function MermaidRendererInteractive({ code, className = '' }: MermaidRendererProps) {
  const { theme } = useTheme()
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isPanning = useRef(false)
  const lastPanPoint = useRef({ x: 0, y: 0 })

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
        
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        const id = `mermaid-interactive-${Date.now()}`
        const { svg: renderedSvg } = await mermaid.render(id, code)
        
        if (mounted) {
          setSvg(renderedSvg)
          setScale(1)
          setPosition({ x: 0, y: 0 })
          setIsLoading(false)
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

  const clampScale = (newScale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

  const handleZoom = (delta: number, centerX: number, centerY: number) => {
    if (!viewportRef.current) return

    const viewportRect = viewportRef.current.getBoundingClientRect()
    const newScale = clampScale(scale + delta)
    
    // Position of the cursor relative to the viewport
    const cursorX = centerX - viewportRect.left
    const cursorY = centerY - viewportRect.top
    
    // The point in the content that is under the cursor
    const pointX = (cursorX - position.x) / scale
    const pointY = (cursorY - position.y) / scale
    
    // The new position of the content
    const newX = cursorX - pointX * newScale
    const newY = cursorY - pointY * newScale

    setScale(newScale)
    setPosition({ x: newX, y: newY })
  }

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY * -1 * ZOOM_SPEED_FACTOR * scale // Adjust speed based on current scale
      handleZoom(delta, e.clientX, e.clientY)
    }
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only pan with left-click
    isPanning.current = true
    lastPanPoint.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.style.cursor = 'grabbing'
    e.currentTarget.style.userSelect = 'none'
  }

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    isPanning.current = false
    e.currentTarget.style.cursor = 'grab'
    e.currentTarget.style.userSelect = 'auto'
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastPanPoint.current.x
    const dy = e.clientY - lastPanPoint.current.y
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    lastPanPoint.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning.current) {
        handleMouseUp(e);
    }
  }

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    if (!viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    handleZoom(0.2 * scale, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  const zoomOut = () => {
    if (!viewportRef.current) return
    const rect = viewportRef.current.getBoundingClientRect()
    handleZoom(-0.2 * scale, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

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
      <div className="flex justify-center items-center min-h-[200px] p-4">
        <div className="text-muted-foreground">Rendering interactive diagram...</div>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-md border', className)}>
      <div
        ref={viewportRef}
        className="w-full h-full min-h-[200px] overflow-hidden relative"
        style={{ cursor: 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={resetView}
      >
        <div
          ref={contentRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: 'transform 0.1s linear',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md border">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut} disabled={scale <= MIN_SCALE}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <div className="text-xs font-mono w-14 text-center select-none" title="Current Zoom">
            {(scale * 100).toFixed(0)}%
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn} disabled={scale >= MAX_SCALE}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View (Double-click)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}