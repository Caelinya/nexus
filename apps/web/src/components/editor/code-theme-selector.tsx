'use client'

import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'
import { CODE_THEMES, DEFAULT_CODE_THEME } from '@/constants/themes'

export function CodeThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_CODE_THEME)

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('code-theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      loadTheme(savedTheme)
    } else {
      loadTheme(DEFAULT_CODE_THEME)
    }
  }, [])

  const loadTheme = async (themeName: string) => {
    // Remove existing theme link
    const existingLink = document.getElementById('hljs-theme')
    if (existingLink) {
      existingLink.remove()
    }

    // Add new theme link
    const link = document.createElement('link')
    link.id = 'hljs-theme'
    link.rel = 'stylesheet'
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeName}.min.css`
    document.head.appendChild(link)
  }

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName)
    localStorage.setItem('code-theme', themeName)
    loadTheme(themeName)
  }

  const getCurrentThemeName = () => {
    const theme = CODE_THEMES.find((t) => t.value === currentTheme)
    return theme?.name || CODE_THEMES.find((t) => t.value === DEFAULT_CODE_THEME)?.name || 'GitHub Dark'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm">{getCurrentThemeName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">Code Highlight Theme</div>
        {CODE_THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className={currentTheme === theme.value ? 'bg-accent' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <span>{theme.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {theme.category}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
