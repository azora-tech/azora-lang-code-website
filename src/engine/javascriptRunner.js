export async function runJavaScript(jsCode) {
  const output = []
  const errors = []

  // Capture console output
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn

  console.log = (...args) => output.push(args.map(String).join(' '))
  console.error = (...args) => errors.push(args.map(String).join(' '))
  console.warn = (...args) => output.push(args.map(String).join(' '))

  // Provide process.stdout.write for print() mapping
  const origProcess = globalThis.process
  globalThis.process = {
    ...globalThis.process,
    stdout: { write: (s) => { output.push(s) } },
  }

  try {
    const fn = new Function(jsCode)
    const result = fn()
    // If the code returns a promise (async), await it
    if (result && typeof result.then === 'function') {
      await result
    }
    return {
      success: errors.length === 0,
      output: output.join('\n'),
      errors: errors.join('\n'),
    }
  } catch (e) {
    return {
      success: false,
      output: output.join('\n'),
      errors: e.message || String(e),
    }
  } finally {
    console.log = origLog
    console.error = origError
    console.warn = origWarn
    globalThis.process = origProcess
  }
}
