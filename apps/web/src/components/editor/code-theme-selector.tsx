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

const CODE_THEMES = [
  { name: 'GitHub', value: 'github', category: 'light' },
  { name: 'GitHub Dark', value: 'github-dark', category: 'dark' },
  { name: 'VS Code', value: 'vs', category: 'light' },
  { name: 'VS Code Dark', value: 'vs2015', category: 'dark' },
  { name: 'Atom One Light', value: 'atom-one-light', category: 'light' },
  { name: 'Atom One Dark', value: 'atom-one-dark', category: 'dark' },
  { name: 'Monokai', value: 'monokai', category: 'dark' },
  { name: 'Dracula', value: 'base16/dracula', category: 'dark' },
  { name: 'Tokyo Night', value: 'tokyo-night-dark', category: 'dark' },
  { name: 'Nord', value: 'nord', category: 'dark' },
  { name: 'Gruvbox Dark', value: 'base16/gruvbox-dark-hard', category: 'dark' },
  { name: 'Solarized Light', value: 'base16/solarized-light', category: 'light' },
  { name: 'Solarized Dark', value: 'base16/solarized-dark', category: 'dark' },
]

export function CodeThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('github-dark')

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('code-theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      loadTheme(savedTheme)
    } else {
      loadTheme('github-dark')
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
    return CODE_THEMES.find((t) => t.value === currentTheme)?.name || 'GitHub Dark'
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
