interface CodeBlockProps {
  code: string
  title?: string
}

export default function CodeBlock({ code, title }: CodeBlockProps) {
  return (
    <div style={{ marginTop: '15px' }}>
      {title && (
        <div style={{
          background: title.includes('悪い') ? '#5c2626' : '#1e3a1e',
          color: title.includes('悪い') ? '#ff8a8a' : '#8aff8a',
          padding: '8px 12px',
          borderRadius: '4px 4px 0 0',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'Monaco, Menlo, monospace'
        }}>
          {title}
        </div>
      )}
      <pre style={{
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: '15px',
        borderRadius: title ? '0 0 4px 4px' : '4px',
        overflow: 'auto',
        fontSize: '12px',
        lineHeight: '1.6',
        margin: 0,
        maxHeight: '400px',
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

interface Token {
  type: 'comment' | 'string' | 'code'
  value: string
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    // Single-line comment
    if (code.slice(i, i + 2) === '//') {
      const end = code.indexOf('\n', i)
      const commentEnd = end === -1 ? code.length : end
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) })
      i = commentEnd
      continue
    }

    // String literals
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]
      let j = i + 1
      while (j < code.length) {
        if (code[j] === '\\') {
          j += 2
          continue
        }
        if (code[j] === quote) {
          j++
          break
        }
        j++
      }
      tokens.push({ type: 'string', value: code.slice(i, j) })
      i = j
      continue
    }

    // Regular code - collect until next special token
    let j = i
    while (j < code.length) {
      if (code.slice(j, j + 2) === '//' ||
          code[j] === '"' || code[j] === "'" || code[j] === '`') {
        break
      }
      j++
    }
    if (j > i) {
      tokens.push({ type: 'code', value: code.slice(i, j) })
      i = j
    }
  }

  return tokens
}

function highlightCodePart(code: string): string {
  const keywords = /\b(const|let|var|function|return|if|else|async|await|import|export|default|from|interface|type|null|true|false)\b/g
  const hooks = /\b(useState|useEffect|useMemo|useRef|useCallback)\b/g
  const numbers = /\b(\d+)\b/g
  const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g
  const properties = /\.([a-zA-Z_][a-zA-Z0-9_]*)/g

  return code
    .replace(keywords, '<span style="color:#569cd6">$1</span>')
    .replace(hooks, '<span style="color:#dcdcaa">$1</span>')
    .replace(functions, '<span style="color:#dcdcaa">$1</span>')
    .replace(properties, '.<span style="color:#9cdcfe">$1</span>')
    .replace(numbers, '<span style="color:#b5cea8">$1</span>')
}

function highlightCode(code: string): string {
  const tokens = tokenize(code)

  return tokens.map(token => {
    const escaped = escapeHtml(token.value)

    switch (token.type) {
      case 'comment':
        return `<span style="color:#6a9955">${escaped}</span>`
      case 'string':
        return `<span style="color:#ce9178">${escaped}</span>`
      case 'code':
        return highlightCodePart(escaped)
      default:
        return escaped
    }
  }).join('')
}
