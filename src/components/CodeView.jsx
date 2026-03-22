import { useState, useCallback } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift'
import llvm from 'react-syntax-highlighter/dist/esm/languages/prism/llvm'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import azora from '../data/azora-prism.js'

SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('swift', swift)
SyntaxHighlighter.registerLanguage('llvm', llvm)
SyntaxHighlighter.registerLanguage('azora', azora)

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#1A1A1A',
    color: '#FBFBFB',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: '#1A1A1A',
    color: '#FBFBFB',
  },
  keyword: { color: '#D16B8E' },
  function: { color: '#5BA3D0' },
  string: { color: '#7DBF8A' },
  number: { color: '#D4A574' },
  boolean: { color: '#D4A574' },
  comment: { color: '#676767' },
  'class-name': { color: '#5FA89F' },
  operator: { color: '#D14EEA' },
  punctuation: { color: '#9B9B9B' },
  builtin: { color: '#5BA3D0' },
  annotation: { color: '#E6C96B' },
  variable: { color: '#E6C96B' },
}

export default function CodeView({ code, language = 'kotlin' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-az-60 text-sm font-mono">
        Run your code to see output here.
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-az-80 text-az-40
                   hover:bg-az-70 hover:text-az-20 opacity-0 group-hover:opacity-100
                   transition-all z-10"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <SyntaxHighlighter
        language={language}
        style={customStyle}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#1A1A1A',
          minHeight: '100%',
          fontSize: '14px',
          lineHeight: '1.6',
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        }}
        showLineNumbers
        lineNumberStyle={{ color: '#4C4C4C', minWidth: '2.5em' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
