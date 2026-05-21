export const FORM_QUERY_KEY_PREFIX = ['frontend', 'form'] as const

export const getFormQueryKey = (handle: string) =>
  [...FORM_QUERY_KEY_PREFIX, handle] as const
