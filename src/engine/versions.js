export const VERSIONS = [
  { id: '0.0.1-alpha.0', label: '0.0.1-alpha.0', isDefault: true },
]

export function getDefaultVersion() {
  return VERSIONS.find(v => v.isDefault)?.id || VERSIONS[0].id
}
