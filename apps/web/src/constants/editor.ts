/**
 * Editor configuration constants
 */

export const EDITOR_CONFIG = {
  // Heights
  MIN_HEIGHT: '400px',
  DEFAULT_HEIGHT: '600px',
  
  // Timing
  DEBOUNCE_DELAY: 300, // ms
  AUTO_SAVE_DELAY: 2000, // ms
  
  // Limits
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 100000,
  
  // Reading speed
  WORDS_PER_MINUTE: 200,
} as const

export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  TOGGLE_MARKDOWN: 'Ctrl+/',
  TOGGLE_LAYOUT: 'Ctrl+\\',
  BOLD: 'Ctrl+B',
  ITALIC: 'Ctrl+I',
  UNDERLINE: 'Ctrl+U',
} as const
