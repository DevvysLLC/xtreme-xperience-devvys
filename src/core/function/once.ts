/**
 * Creates a function that ensures the given function is only called once.
 * Subsequent calls return the cached result from the first invocation.
 */
export const once = <T>(fn: () => T): (() => T) => {
  let called = false
  let result: T

  return () => {
    if (!called) {
      called = true
      result = fn()
    }
    return result
  }
}
