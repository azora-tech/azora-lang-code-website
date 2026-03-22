const COMPILER_URL = 'https://godbolt.org/api/compiler/swift62/compile'

export async function runSwift(swiftCode) {
  try {
    const body = {
      source: swiftCode,
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
      return { success: false, output: '', errors: `Swift server error: ${res.status} ${res.statusText}` }
    }

    const data = await res.json()

    const compileErrors = (data.buildResult?.stderr ?? [])
      .map(e => e.text)
      .filter(Boolean)
      .join('\n')

    if (compileErrors) {
      return { success: false, output: '', errors: compileErrors }
    }

    const output = (data.stdout ?? [])
      .map(e => e.text)
      .join('\n')

    const runtimeErrors = (data.stderr ?? [])
      .map(e => e.text)
      .filter(Boolean)
      .join('\n')

    if (runtimeErrors) {
      return { success: false, output, errors: runtimeErrors }
    }

    return { success: true, output, errors: '' }
  } catch (e) {
    return { success: false, output: '', errors: `Swift runner error: ${e.message}` }
  }
}
