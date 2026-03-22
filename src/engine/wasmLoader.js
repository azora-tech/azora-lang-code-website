export async function loadWasmEngine(version) {
  const basePath = `${import.meta.env.BASE_URL}wasm/${version}`
  const cacheBust = `?t=${Date.now()}`

  const oldScript = document.querySelector('script[data-azora-wasm]')
  if (oldScript) oldScript.remove()

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.setAttribute('data-azora-wasm', 'true')
    script.src = `${basePath}/azoraLang.js${cacheBust}`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load WASM bundle for version ${version}`))
    document.head.appendChild(script)
  })

  const ns = await waitForExports()

  return {
    preprocess(source) {
      try {
        const json = ns.azPreprocess(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    async interpret(source) {
      try {
        const json = await ns.azInterpret(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generateKotlin(source) {
      try {
        const json = ns.azGenerateKotlin(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generateCSharp(source) {
      try {
        const json = ns.azGenerateCSharp(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generateJavaScript(source) {
      try {
        const json = ns.azGenerateJavaScript(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generateLlvmIr(source) {
      try {
        const json = ns.azGenerateLlvmIr(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generatePython(source) {
      try {
        const json = ns.azGeneratePython(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    generateSwift(source) {
      try {
        const json = ns.azGenerateSwift(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    async runTests(source) {
      try {
        const json = await ns.azRunTests(source)
        return JSON.parse(json)
      } catch (e) {
        return { success: false, output: '', errors: e.message || String(e) }
      }
    },

    getVersion() {
      try {
        return ns.azGetVersion()
      } catch {
        return version
      }
    },
  }
}

async function waitForExports(maxAttempts = 200) {
  for (let i = 0; i < maxAttempts; i++) {
    const mod = globalThis.compiler
    if (mod) {
      try {
        const resolved = await mod
        if (resolved && typeof resolved.azInterpret === 'function') {
          return resolved
        }
      } catch (_) {}
      if (typeof mod.azInterpret === 'function') {
        return mod
      }
    }
    await new Promise(r => setTimeout(r, 50))
  }
  throw new Error('WASM module did not initialize within timeout')
}
