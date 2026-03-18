export async function loadWasmEngine(version) {
  const basePath = `${import.meta.env.BASE_URL}wasm/${version}`
  const cacheBust = `?t=${Date.now()}`

  // Remove previous script tag and module state so we always reload fresh WASM
  const oldScript = document.querySelector('script[data-azora-wasm]')
  if (oldScript) oldScript.remove()
  delete window.script

  // Load the Kotlin/Wasm webpack bundle via script tag.
  // It registers as UMD: globalThis.script = <Promise>
  // The Promise resolves with the module exports after WASM initialization.
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.setAttribute('data-azora-wasm', 'true')
    script.src = `${basePath}/composeApp.js${cacheBust}`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load WASM bundle for version ${version}`))
    document.head.appendChild(script)
  })

  // window.script is a Promise — await it to get the actual exports
  const ns = await window.script

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
        // azInterpret returns a JS Promise that resolves with a JsString
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

    async runTests(source) {
      try {
        // azRunTests returns a JS Promise that resolves with a JsString
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
