export const isPresent = <T>(t: T | undefined | null): t is T => {
  return t !== undefined && t !== null
}

export const isDefined = <T>(t: T | undefined): t is T => {
  return t !== undefined
}

export const isNotNull = <T>(t: T | null): t is T => {
  return t !== null
}

export const isNotEmpty = <T>(t: T | undefined | null): t is NonNullable<T> => {
  if (t == null) {
    return false
  }
  if (typeof t === 'string') {
    return t.trim().length > 0
  }
  if (Array.isArray(t)) {
    return t.length > 0
  }
  return true
}

// Media type guards
export const isVideo = (
  media: unknown
): media is { __typename: 'CoreVideoRecord' } => {
  return (
    media != null &&
    typeof media === 'object' &&
    '__typename' in media &&
    media.__typename === 'CoreVideoRecord'
  )
}

export const isImage = (
  media: unknown
): media is { __typename: 'CoreImageRecord' } => {
  return (
    media != null &&
    typeof media === 'object' &&
    '__typename' in media &&
    media.__typename === 'CoreImageRecord'
  )
}
