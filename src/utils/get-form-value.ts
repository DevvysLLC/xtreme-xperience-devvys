/**
 * Gets form value with priority: state → stored → default
 */
export const getFormValue = <T>(
  stateValue: T | null | undefined,
  storedValue: T | null | undefined,
  defaultValue: T
): T => {
  return stateValue ?? storedValue ?? defaultValue
}
