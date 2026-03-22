const COMPILER_URL = 'https://api.kotlinlang.org/api/2.3.20/compiler/run'

export async function runKotlin(kotlinCode) {
  const body = {
    args: '',
    files: [{ name: 'File.kt', text: kotlinCode, publicId: '' }],
    confType: 'java',
  }

  const res = await fetch(COMPILER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return { success: false, output: '', errors: `Compiler server error: ${res.status} ${res.statusText}` }
  }

  const data = await res.json()

  // errors is an object keyed by filename, each value is an array of diagnostics
  const allErrors = Object.values(data.errors ?? {}).flat()
  const compileErrors = allErrors
    .filter(e => e.severity === 'ERROR')
    .map(e => e.message)
    .join('\n')

  // stdout is wrapped in <outStream> tags
  const raw = data.text ?? ''
  const output = raw.replace(/<\/?outStream>/g, '').replace(/<\/?errStream>/g, '')

  if (compileErrors) {
    return { success: false, output, errors: compileErrors }
  }
  if (data.exception) {
    const ex = data.exception
    const msg = `${ex.fullName}: ${ex.message}`
    return { success: false, output, errors: msg }
  }
  return { success: true, output, errors: '' }
}
