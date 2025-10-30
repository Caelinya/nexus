/**
 * Editor configuration
 */

export const editorConfig = {
  // TipTap extensions config
  extensions: {
    mathKatex: {
      throwOnError: false,
    },
    codeBlock: {
      defaultLanguage: 'plaintext',
    },
    table: {
      resizable: true,
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    },
    link: {
      openOnClick: false,
      autolink: true,
    },
    placeholder: {
      text: 'Start writing... Supports Markdown syntax like # heading, - list, > quote, $formula$',
    },
  },

  // UI settings
  ui: {
    minHeight: 400,
    defaultHeight: 600,
    defaultTheme: 'github-dark',
    stickyToolbar: true,
  },

  // Performance
  performance: {
    debounceDelay: 300,
    autoSaveDelay: 2000,
  },

  // Limits
  limits: {
    maxTitleLength: 200,
    maxContentLength: 100000,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
} as const

export type EditorConfig = typeof editorConfig
