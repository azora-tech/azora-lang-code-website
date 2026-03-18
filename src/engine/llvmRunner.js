const COMPILER_URL = 'https://godbolt.org/api/compiler/irclang2210/compile'

export async function runLlvmIr(llvmIrCode) {
  const body = {
    source: llvmIrCode,
    options: {
      executeParameters: { args: '', stdin: '' },
      compilerOptions: { executorRequest: true },
      filters: { execute: true },
    },
  }

  const res = await fetch(COMPILER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return { success: false, output: '', errors: `Compiler server error: ${res.status} ${res.statusText}` }
  }

  const data = await res.json()

  // Compile errors come from buildResult.stderr
  const compileErrors = (data.buildResult?.stderr ?? [])
    .map(e => e.text?.replace(/\x1b\[[0-9;]*m/g, ''))
    .filter(e => e && !e.includes('warning:') && !e.includes('warning generated'))
    .join('\n')

  if (compileErrors) {
    return { success: false, output: '', errors: compileErrors }
  }

  // Runtime stdout
  const output = (data.stdout ?? [])
    .map(e => e.text)
    .join('\n')

  // Runtime errors from stderr
  const runtimeErrors = (data.stderr ?? [])
    .map(e => e.text)
    .filter(e => e && e !== 'Build failed')
    .join('\n')

  if (runtimeErrors) {
    return { success: false, output, errors: runtimeErrors }
  }

  return { success: true, output, errors: '' }
}
