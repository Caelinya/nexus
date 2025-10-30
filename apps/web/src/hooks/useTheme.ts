import { useEffect, useState } from 'react'
import { APP_THEMES, type AppTheme } from '@/constants/themes'

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check current theme from DOM (already set by blocking script)
    const isDark = document.documentElement.classList.contains('dark')
    const currentTheme = isDark ? 'dark' : 'light'
    setTheme(currentTheme)
  }, [])

  const applyTheme = (newTheme: AppTheme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else if (newTheme === 'light') {
      root.classList.remove('dark')
    } else {
      // Auto mode
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemPrefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  const setAndSaveTheme = (newTheme: AppTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setAndSaveTheme(newTheme)
  }

  return {
    theme,
    mounted,
    setTheme: setAndSaveTheme,
    toggleTheme,
  }
}
