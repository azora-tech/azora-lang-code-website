import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header.jsx'
import CodeEditor from './components/CodeEditor.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import useAzoraEngine from './hooks/useAzoraEngine.js'
import { SAMPLE_CODE } from './data/sampleCode.js'
import { getDefaultVersion, isValidVersion } from './engine/versions.js'
import { runKotlin } from './engine/kotlinRunner.js'
import { runCSharp } from './engine/csharpRunner.js'
import { runJavaScript } from './engine/javascriptRunner.js'
import { runPython } from './engine/pythonRunner.js'
import { runSwift } from './engine/swiftRunner.js'
import { runLlvmIr } from './engine/llvmRunner.js'

const LS_CODE_KEY = 'azora-playground-code'
const LS_VERSION_KEY = 'azora-playground-version'
const LS_TARGET_KEY = 'azora-playground-target'

function loadSaved(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? v : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [code, setCode] = useState(() => loadSaved(LS_CODE_KEY, SAMPLE_CODE))
  const [version, setVersion] = useState(() => {
    const saved = loadSaved(LS_VERSION_KEY, getDefaultVersion())
    return isValidVersion(saved) ? saved : getDefaultVersion()
  })
  const [target, setTarget] = useState(() => loadSaved(LS_TARGET_KEY, 'interpreted'))
  const [activeTab, setActiveTab] = useState('console')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState({ console: [], preprocessed: '', kotlin: '', csharp: '', javascript: '', llvmIr: '', python: '', swift: '' })

  const engine = useAzoraEngine(version)

  // Persist code and version
  useEffect(() => {
    try { localStorage.setItem(LS_CODE_KEY, code) } catch {}
  }, [code])

  useEffect(() => {
    try { localStorage.setItem(LS_VERSION_KEY, version) } catch {}
  }, [version])

  useEffect(() => {
    try { localStorage.setItem(LS_TARGET_KEY, target) } catch {}
    // Clear console when switching targets
    setResults(prev => ({ ...prev, console: [] }))
    // If switching away from a target while on its tab, switch to console
    if (target !== 'kotlin-jvm' && activeTab === 'kotlin') {
      setActiveTab('console')
    }
    if (target !== 'csharp-dotnet' && activeTab === 'csharp') {
      setActiveTab('console')
    }
    if (target !== 'javascript' && activeTab === 'javascript') {
      setActiveTab('console')
    }
    if (target !== 'llvm-ir' && activeTab === 'llvm-ir') {
      setActiveTab('console')
    }
    if (target !== 'python' && activeTab === 'python') {
      setActiveTab('console')
    }
    if (target !== 'swift' && activeTab === 'swift') {
      setActiveTab('console')
    }
  }, [target])

  // Live preprocess on every code change (and on initial load)
  useEffect(() => {
    if (!engine.ready) return
    try {
      const ppResult = engine.preprocess(code)
      setResults(prev => ({
        ...prev,
        preprocessed: ppResult.success ? ppResult.output.trimEnd() : `// Error:\n// ${ppResult.errors}`,
      }))
    } catch {}
  }, [code, engine.ready, engine])

  // Live Kotlin codegen when target is kotlin-jvm
  useEffect(() => {
    if (!engine.ready || target !== 'kotlin-jvm') return
    try {
      const ktResult = engine.generateKotlin(code)
      setResults(prev => ({
        ...prev,
        kotlin: ktResult.success ? ktResult.output : `// Error:\n// ${ktResult.errors}`,
      }))
    } catch {}
  }, [code, target, engine.ready, engine])

  // Live C# codegen when target is csharp-dotnet
  useEffect(() => {
    if (!engine.ready || target !== 'csharp-dotnet') return
    try {
      const csResult = engine.generateCSharp(code)
      setResults(prev => ({
        ...prev,
        csharp: csResult.success ? csResult.output : `// Error:\n// ${csResult.errors}`,
      }))
    } catch {}
  }, [code, target, engine.ready, engine])

  // Live JavaScript codegen when target is javascript
  useEffect(() => {
    if (!engine.ready || target !== 'javascript') return
    try {
      const jsResult = engine.generateJavaScript(code)
      setResults(prev => ({
        ...prev,
        javascript: jsResult.success ? jsResult.output : `// Error:\n// ${jsResult.errors}`,
      }))
    } catch {}
  }, [code, target, engine.ready, engine])

  // Live LLVM IR codegen when target is llvm-ir
  useEffect(() => {
    if (!engine.ready || target !== 'llvm-ir') return
    try {
      const irResult = engine.generateLlvmIr(code)
      setResults(prev => ({
        ...prev,
        llvmIr: irResult.success ? irResult.output : `; Error:\n; ${irResult.errors}`,
      }))
    } catch {}
  }, [code, target, engine.ready, engine])

  // Live Python codegen when target is python
  useEffect(() => {
    if (!engine.ready || target !== 'python') return
    const pyResult = engine.generatePython(code)
    setResults(prev => ({
      ...prev,
      python: pyResult.success ? pyResult.output : `# Error:\n# ${pyResult.errors}`,
    }))
  }, [code, target, engine.ready, engine])

  // Live Swift codegen when target is swift
  useEffect(() => {
    if (!engine.ready || target !== 'swift') return
    const swResult = engine.generateSwift(code)
    setResults(prev => ({
      ...prev,
      swift: swResult.success ? swResult.output : `// Error:\n// ${swResult.errors}`,
    }))
  }, [code, target, engine.ready, engine])

  const parseOutput = useCallback((result) => {
    const messages = []
    if (result.output) {
      result.output.split('\n').forEach((line) => {
        if (line) messages.push({ text: line, type: 'output' })
      })
    }
    if (result.errors) {
      result.errors.split('\n').forEach((line) => {
        if (line) messages.push({ text: line, type: 'error' })
      })
    }
    return messages
  }, [])

  const handleRun = useCallback(async () => {
    if (!engine.ready || isRunning) return
    setIsRunning(true)
    setActiveTab('console')

    try {
      if (target === 'kotlin-jvm') {
        // Generate Kotlin code, then compile & run via the JetBrains compiler API
        const ktResult = engine.generateKotlin(code)
        const kotlinCode = ktResult.success ? ktResult.output : null

        setResults(prev => ({
          ...prev,
          kotlin: ktResult.success ? ktResult.output : `// Error:\n// ${ktResult.errors}`,
        }))

        if (!kotlinCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `Kotlin codegen failed: ${ktResult.errors}`, type: 'error' }],
          }))
          return
        }

        setResults(prev => ({
          ...prev,
          console: [{ text: 'Compiling and running on JVM...', type: 'output' }],
        }))

        const runResult = await runKotlin(kotlinCode)
        setResults(prev => ({
          ...prev,
          console: parseOutput(runResult),
        }))
      } else if (target === 'csharp-dotnet') {
        // Generate C# code, then compile & run via Godbolt API
        const csResult = engine.generateCSharp(code)
        const csharpCode = csResult.success ? csResult.output : null

        setResults(prev => ({
          ...prev,
          csharp: csResult.success ? csResult.output : `// Error:\n// ${csResult.errors}`,
        }))

        if (!csharpCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `C# codegen failed: ${csResult.errors}`, type: 'error' }],
          }))
          return
        }

        setResults(prev => ({
          ...prev,
          console: [{ text: 'Compiling and running on .NET...', type: 'output' }],
        }))

        const runResult = await runCSharp(csharpCode)
        setResults(prev => ({
          ...prev,
          console: parseOutput(runResult),
        }))
      } else if (target === 'javascript') {
        // Generate JavaScript code, then run in browser
        const jsResult = engine.generateJavaScript(code)
        const javascriptCode = jsResult.success ? jsResult.output : null

        setResults(prev => ({
          ...prev,
          javascript: jsResult.success ? jsResult.output : `// Error:\n// ${jsResult.errors}`,
        }))

        if (!javascriptCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `JavaScript codegen failed: ${jsResult.errors}`, type: 'error' }],
          }))
          return
        }

        const runResult = await runJavaScript(javascriptCode)
        setResults(prev => ({
          ...prev,
          console: parseOutput(runResult),
        }))
      } else if (target === 'llvm-ir') {
        // Generate LLVM IR, then compile & run via Godbolt
        const irResult = engine.generateLlvmIr(code)
        const llvmIrCode = irResult.success ? irResult.output : null

        setResults(prev => ({
          ...prev,
          llvmIr: irResult.success ? irResult.output : `; Error:\n; ${irResult.errors}`,
        }))

        if (!llvmIrCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `LLVM IR codegen failed: ${irResult.errors}`, type: 'error' }],
          }))
          return
        }

        setResults(prev => ({
          ...prev,
          console: [{ text: 'Compiling and running via LLVM...', type: 'output' }],
        }))

        const runResult = await runLlvmIr(llvmIrCode)
        setResults(prev => ({
          ...prev,
          console: parseOutput(runResult),
        }))
      } else if (target === 'python') {
        const pyResult = engine.generatePython(code)
        const pythonCode = pyResult.success ? pyResult.output : null

        setResults(prev => ({
          ...prev,
          python: pyResult.success ? pyResult.output : `# Error:\n# ${pyResult.errors}`,
        }))

        if (!pythonCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `Python codegen failed: ${pyResult.errors}`, type: 'error' }],
          }))
          return
        }

        setResults(prev => ({
          ...prev,
          console: [{ text: 'Running Python via Godbolt...', type: 'output' }],
        }))

        const runResult = await runPython(pythonCode)
        const pyMessages = parseOutput(runResult)
        setResults(prev => ({
          ...prev,
          console: pyMessages.length > 0 ? pyMessages : [{ text: '(no output)', type: 'output' }],
        }))
      } else if (target === 'swift') {
        const swResult = engine.generateSwift(code)
        const swiftCode = swResult.success ? swResult.output : null

        setResults(prev => ({
          ...prev,
          swift: swResult.success ? swResult.output : `// Error:\n// ${swResult.errors}`,
        }))

        if (!swiftCode) {
          setResults(prev => ({
            ...prev,
            console: [{ text: `Swift codegen failed: ${swResult.errors}`, type: 'error' }],
          }))
          return
        }

        setResults(prev => ({
          ...prev,
          console: [{ text: 'Running Swift via Godbolt...', type: 'output' }],
        }))

        const runResult = await runSwift(swiftCode)
        const swMessages = parseOutput(runResult)
        setResults(prev => ({
          ...prev,
          console: swMessages.length > 0 ? swMessages : [{ text: '(no output)', type: 'output' }],
        }))
      } else {
        // Interpreted target — run via WASM interpreter
        const interpretResult = await engine.interpret(code)
        setResults(prev => ({
          ...prev,
          console: parseOutput(interpretResult),
        }))
      }
    } catch (e) {
      setResults(prev => ({
        ...prev,
        console: [{ text: `Unexpected error: ${e.message}`, type: 'error' }],
      }))
    } finally {
      setIsRunning(false)
    }
  }, [code, engine, isRunning, parseOutput, target])

  const handleRunTests = useCallback(async () => {
    if (!engine.ready || isRunning) return
    setIsRunning(true)
    setActiveTab('console')

    try {
      const result = await engine.runTests(code)
      setResults(prev => ({
        ...prev,
        console: parseOutput(result),
      }))
    } catch (e) {
      setResults(prev => ({
        ...prev,
        console: [{ text: `Unexpected error: ${e.message}`, type: 'error' }],
      }))
    } finally {
      setIsRunning(false)
    }
  }, [code, engine, isRunning, parseOutput])

  // Loading / error state
  if (engine.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-az-90">
        <div className="text-center">
          <div className="text-az-primary font-mono font-bold text-3xl mb-4">Az</div>
          <div className="text-az-50 text-sm">Loading Azora engine...</div>
          <div className="mt-3 w-8 h-8 border-2 border-az-80 border-t-az-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (engine.error) {
    return (
      <div className="h-screen flex items-center justify-center bg-az-90">
        <div className="text-center max-w-md">
          <div className="text-az-primary font-mono font-bold text-3xl mb-4">Az</div>
          <div className="text-pastel-red text-sm mb-2">Failed to load engine</div>
          <div className="text-az-50 text-xs font-mono bg-az-85 rounded p-3">{engine.error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-az-90">
      <Header
        version={version}
        onVersionChange={setVersion}
        target={target}
        onTargetChange={setTarget}
        onRun={handleRun}
        onRunTests={handleRunTests}
        onClear={() => setResults({ console: [], preprocessed: '', kotlin: '', csharp: '', javascript: '', llvmIr: '', python: '', swift: '' })}
        isRunning={isRunning}
        engineReady={engine.ready}
        onLoadExample={setCode}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Editor */}
        <div className="flex-1 min-h-0 min-w-0 border-b md:border-b-0 md:border-r border-az-80">
          <CodeEditor
            value={code}
            onChange={setCode}
            onRun={handleRun}
            onRunTests={handleRunTests}
          />
        </div>

        {/* Output */}
        <div className="flex-1 min-h-0 min-w-0">
          <OutputPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            results={results}
            target={target}
          />
        </div>
      </div>
    </div>
  )
}
