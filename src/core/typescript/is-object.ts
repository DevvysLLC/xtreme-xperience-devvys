/**
 * Basic object guard. It matches any object, including arrays and functions
 */
export const isObject = <T extends object, U>(
  term: T | U
): term is NonNullable<T> => {
  return term !== null && typeof term === 'object'
}
