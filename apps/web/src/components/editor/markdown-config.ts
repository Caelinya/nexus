import MarkdownIt from 'markdown-it'

// Callout markdown-it plugin
function calloutPlugin(md: MarkdownIt) {
  // Custom blockquote parser
  md.block.ruler.before('blockquote', 'callout', (state: any, startLine: number, endLine: number, silent: boolean) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // Check for '> ' at start of line
    if (state.src.charCodeAt(pos) !== 0x3E /* > */) {
      return false
    }

    // Check if it's a callout pattern
    const lineText = state.src.slice(pos, max)
    const calloutMatch = lineText.match(/^>\s*\[!(\w+)\]([+-]?)\s*(.*)/)
    
    if (!calloutMatch) {
      return false
    }

    if (silent) {
      return true
    }

    const [, type, collapseMarker, title] = calloutMatch
    
    // Find the end of the callout block
    let nextLine = startLine
    let lastLineEmpty = false

    while (nextLine < endLine) {
      nextLine++
      if (nextLine >= endLine) break
      
      const nextPos = state.bMarks[nextLine] + state.tShift[nextLine]
      const nextMax = state.eMarks[nextLine]
      const nextLineText = state.src.slice(nextPos, nextMax)

      // Check if line starts with '> '
      if (!nextLineText.startsWith('>')) {
        break
      }

      // Check if it's an empty blockquote line
      if (nextLineText === '>') {
        lastLineEmpty = true
      } else {
        lastLineEmpty = false
      }
    }

    // Create tokens
    const token = state.push('callout_open', 'div', 1)
    token.attrs = [
      ['data-callout', ''],
      ['data-type', type],
    ]
    
    if (title) {
      token.attrs.push(['data-title', title.trim()])
    }
    
    if (collapseMarker === '-') {
      token.attrs.push(['data-collapsed', 'true'])
    } else if (collapseMarker === '+') {
      token.attrs.push(['data-collapsed', 'false'])
    }

    const contentToken = state.push('callout_content_open', 'div', 1)
    contentToken.attrs = [['data-callout-content', '']]

    // Parse content lines
    const oldLineMax = state.lineMax
    state.lineMax = nextLine

    // Process callout content
    const contentLines: string[] = []
    for (let line = startLine + 1; line < nextLine; line++) {
      const linePos = state.bMarks[line] + state.tShift[line]
      const lineMax = state.eMarks[line]
      let content = state.src.slice(linePos, lineMax)
      
      if (content.startsWith('> ')) {
        contentLines.push(content.slice(2))
      } else if (content === '>') {
        contentLines.push('')
      }
    }

    // Create a new state for the content
    const contentText = contentLines.join('\n')
    const contentState = new state.md.block.State(contentText, state.md, state.env, [])
    contentState.lineMax = contentLines.length
    
    // Parse the content
    state.md.block.tokenize(contentState, 0, contentLines.length, false)
    
    // Add parsed tokens
    for (const token of contentState.tokens) {
      state.tokens.push(token)
    }

    // Close tokens
    state.push('callout_content_close', 'div', -1)
    state.push('callout_close', 'div', -1)

    state.lineMax = oldLineMax
    state.line = nextLine

    return true
  })

  // Add renderer rules
  md.renderer.rules.callout_open = (tokens: any[], idx: number) => {
    const token = tokens[idx]
    const attrs = token.attrs || []
    let result = '<div'
    
    for (const [key, value] of attrs) {
      result += ` ${key}="${md.utils.escapeHtml(value)}"`
    }
    
    return result + '>'
  }

  md.renderer.rules.callout_content_open = () => '<div data-callout-content="">'
  md.renderer.rules.callout_content_close = () => '</div>'
  md.renderer.rules.callout_close = () => '</div>'
}

// Create custom markdown-it instance with callout plugin
export function createMarkdownItInstance() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
  
  // Add callout plugin
  md.use(calloutPlugin)
  
  return md
}