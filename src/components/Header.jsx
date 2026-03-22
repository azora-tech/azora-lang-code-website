import VersionSelector from './VersionSelector.jsx'
import TargetSelector from './TargetSelector.jsx'
import ExampleSelector from './ExampleSelector.jsx'

export default function Header({ version, onVersionChange, target, onTargetChange, onRun, onRunTests, isRunning, engineReady, onLoadExample }) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 bg-az-95 border-b border-az-80 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-az-primary font-mono font-bold text-xl">Az</span>
        <span className="text-az-20 font-semibold text-sm hidden sm:inline">Azora Playground</span>
        <span className="text-[10px] text-az-60 border border-az-70 rounded px-1.5 py-0.5 hidden sm:inline">v0.0.1</span>
      </div>

      <VersionSelector version={version} onChange={onVersionChange} />
      <TargetSelector target={target} onChange={onTargetChange} />
      <ExampleSelector onSelect={onLoadExample} />

      <div className="flex-1 min-w-0" />

      <div className="flex items-center gap-2">
        {isRunning && (
          <div className="w-2 h-2 rounded-full bg-az-primary animate-pulse" />
        )}

        <button
          onClick={onRunTests}
          disabled={isRunning || !engineReady}
          className="px-3 py-1 text-sm rounded-md border border-az-70 text-az-30
                     hover:bg-az-80 hover:text-az-10 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors cursor-pointer"
          title="Run Tests (Ctrl+Shift+Enter)"
        >
          Run Tests
        </button>

        <button
          onClick={onRun}
          disabled={isRunning || !engineReady}
          className="px-4 py-1 text-sm rounded-md bg-az-green text-az-95 font-medium
                     hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors cursor-pointer"
          title="Run (Ctrl+Enter)"
        >
          Run
        </button>
      </div>
    </header>
  )
}
