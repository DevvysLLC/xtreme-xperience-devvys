const loadedScripts = new Set<string>()
const loadingScripts = new Map<string, Promise<void>>()

export const loadScriptOnce = (scriptSrc: string): Promise<void> => {
  if (loadedScripts.has(scriptSrc)) {
    return Promise.resolve()
  }

  const inFlight = loadingScripts.get(scriptSrc)
  if (inFlight) {
    return inFlight
  }

  const loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = scriptSrc
    script.defer = true

    script.onload = () => {
      loadedScripts.add(scriptSrc)
      loadingScripts.delete(scriptSrc)
      resolve()
    }

    script.onerror = () => {
      loadingScripts.delete(scriptSrc)
      script.remove()
      reject(new Error(`Failed to load script: ${scriptSrc}`))
    }

    document.body.appendChild(script)
  })

  loadingScripts.set(scriptSrc, loadPromise)
  return loadPromise
}
