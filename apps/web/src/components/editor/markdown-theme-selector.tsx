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

// Available themes for CodeMirror
const MARKDOWN_EDITOR_THEMES = [
  { name: 'Auto', value: 'auto', description: 'Follow system theme' },
  { name: 'GitHub Light', value: 'github-light', description: 'GitHub light theme' },
  { name: 'Material Light', value: 'material-light', description: 'Material Design light' },
  { name: 'Solarized Light', value: 'solarized-light', description: 'Solarized light theme' },
  { name: 'One Dark', value: 'onedark', description: 'Atom One Dark theme' },
  { name: 'Dracula', value: 'dracula', description: 'Dracula theme' },
  { name: 'GitHub Dark', value: 'github-dark', description: 'GitHub dark theme' },
  { name: 'Material Dark', value: 'material-dark', description: 'Material Design dark' },
  { name: 'Solarized Dark', value: 'solarized-dark', description: 'Solarized dark theme' },
  { name: 'Monokai', value: 'monokai', description: 'Monokai theme' },
]

interface MarkdownThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export function MarkdownThemeSelector({ currentTheme, onThemeChange }: MarkdownThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('markdown-editor-theme')
    if (savedTheme) {
      setSelectedTheme(savedTheme)
      onThemeChange(savedTheme)
    }
  }, [onThemeChange])

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName)
    localStorage.setItem('markdown-editor-theme', themeName)
    onThemeChange(themeName)
  }

const getCurrentThemeName = () => {
  const theme = MARKDOWN_EDITOR_THEMES.find((t) => t.value === selectedTheme)
  return theme?.name || 'Auto'
}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="text-sm">{getCurrentThemeName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <div className="px-2 py-1.5 text-sm font-semibold">Markdown Editor Theme</div>
        {MARKDOWN_EDITOR_THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className={selectedTheme === theme.value ? 'bg-accent' : ''}
          >
            <div className="flex flex-col gap-0.5 w-full">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}