/**
 * Theme configuration constants
 */

export interface CodeTheme {
  name: string
  value: string
  category: 'light' | 'dark'
}

export const CODE_THEMES: readonly CodeTheme[] = [
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
] as const

export const APP_THEMES = ['light', 'dark', 'auto'] as const
export type AppTheme = (typeof APP_THEMES)[number]

export const DEFAULT_CODE_THEME = 'github-dark'
export const DEFAULT_APP_THEME: AppTheme = 'light'
