import { isPresent } from '../typescript/guards'

export const extendUrlSearchParams = (
  inputUrl: string | URL,
  params: Record<
    string,
    | boolean
    | number
    | string
    | (boolean | number | string | null | undefined)[]
    | null
    | undefined
  >
): URL => {
  const url = new URL(inputUrl)

  const searchParams = new URLSearchParams(url.searchParams)
  Object.entries(params).forEach(([key, _value]) => {
    if (_value == null) {
      return
    }

    const value: string = encodeURIComponent(
      Array.isArray(_value)
        ? _value.filter(isPresent).join(',')
        : _value.toString()
    )

    searchParams.set(key, value)
  })
  searchParams.sort()

  url.search = searchParams.toString()

  return url
}
