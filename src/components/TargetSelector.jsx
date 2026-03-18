export const TARGETS = [
  { id: 'interpreted', label: 'Interpreted' },
  { id: 'kotlin-jvm', label: 'Kotlin-JVM 2.3.10' },
  { id: 'csharp-dotnet', label: 'C# .NET 10' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'llvm-ir', label: 'LLVM 22.1' },
]

export default function TargetSelector({ target, onChange }) {
  return (
    <select
      value={target}
      onChange={(e) => onChange(e.target.value)}
      className="bg-az-80 text-az-20 border border-az-70 rounded-md px-2 py-1 text-sm font-mono
                 focus:outline-none focus:border-az-primary cursor-pointer"
    >
      {TARGETS.map((t) => (
        <option key={t.id} value={t.id}>{t.label}</option>
      ))}
    </select>
  )
}
