import ConsoleOutput from './ConsoleOutput.jsx'
import CodeView from './CodeView.jsx'

const ALL_TABS = [
  { id: 'console', label: 'Console' },
  { id: 'preprocessed', label: 'Preprocessed' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'csharp', label: 'C#' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'swift', label: 'Swift' },
  { id: 'llvm-ir', label: 'LLVM IR' },
]

export default function OutputPanel({ activeTab, onTabChange, results, target }) {
  const consoleMessages = results?.console || []
  const hasErrors = consoleMessages.some(m => m.type === 'error')
  const preprocessedCode = results?.preprocessed || ''
  const kotlinCode = results?.kotlin || ''
  const csharpCode = results?.csharp || ''
  const javascriptCode = results?.javascript || ''
  const pythonCode = results?.python || ''
  const swiftCode = results?.swift || ''
  const llvmIrCode = results?.llvmIr || ''
  const tabs = ALL_TABS.filter(t => {
    if (t.id === 'kotlin') return target === 'kotlin-jvm'
    if (t.id === 'csharp') return target === 'csharp-dotnet'
    if (t.id === 'javascript') return target === 'javascript'
    if (t.id === 'python') return target === 'python'
    if (t.id === 'swift') return target === 'swift'
    if (t.id === 'llvm-ir') return target === 'llvm-ir'
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-az-80 bg-az-95 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                ? 'text-az-10'
                : 'text-az-60 hover:text-az-35'
              }`}
          >
            {tab.label}
            {tab.id === 'console' && hasErrors && (
              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-az-red" />
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-az-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'console' && (
          <ConsoleOutput messages={consoleMessages} />
        )}
        {activeTab === 'preprocessed' && (
          <CodeView code={preprocessedCode} language="azora" />
        )}
        {activeTab === 'kotlin' && target === 'kotlin-jvm' && (
          <CodeView code={kotlinCode} language="kotlin" />
        )}
        {activeTab === 'csharp' && target === 'csharp-dotnet' && (
          <CodeView code={csharpCode} language="csharp" />
        )}
        {activeTab === 'javascript' && target === 'javascript' && (
          <CodeView code={javascriptCode} language="javascript" />
        )}
        {activeTab === 'python' && target === 'python' && (
          <CodeView code={pythonCode} language="python" />
        )}
        {activeTab === 'swift' && target === 'swift' && (
          <CodeView code={swiftCode} language="swift" />
        )}
        {activeTab === 'llvm-ir' && target === 'llvm-ir' && (
          <CodeView code={llvmIrCode} language="llvm" />
        )}
      </div>
    </div>
  )
}
