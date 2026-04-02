export const TARGETS = [
  { id: 'interpreted', label: 'Interpreted' },
  { id: 'kotlin-jvm', label: 'Kotlin-JVM 2.3.20' },
  { id: 'csharp-dotnet', label: 'C# .NET 10', disabled: true },
  { id: 'javascript', label: 'TypeScript 6.0' },
  { id: 'llvm-ir', label: 'LLVM IR' },
  { id: 'python', label: 'Python 3', disabled: true },
  { id: 'swift', label: 'Swift 6.2', disabled: true },
]

export default function TargetSelector({ target, onChange }) {
  return (
    <select
      value={target}
      onChange={(e) => onChange(e.target.value)}
      className="bg-az-80 text-az-20 border border-az-70 rounded-md px-2 py-1 text-sm font-mono
                 focus:outline-none focus:border-az-primary cursor-pointer"
    >
      {TARGETS.filter((t) => !t.disabled).map((t) => (
        <option key={t.id} value={t.id}>{t.label}</option>
      ))}
    </select>
  )
}
