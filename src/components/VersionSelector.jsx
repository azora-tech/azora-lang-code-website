import { VERSIONS } from '../engine/versions.js'

export default function VersionSelector({ version, onChange }) {
  return (
    <select
      value={version}
      onChange={(e) => onChange(e.target.value)}
      className="bg-az-80 text-az-20 border border-az-70 rounded-md px-2 py-1 text-sm font-mono
                 focus:outline-none focus:border-az-primary cursor-pointer"
    >
      {VERSIONS.map((v) => (
        <option key={v.id} value={v.id}>{v.label}</option>
      ))}
    </select>
  )
}
