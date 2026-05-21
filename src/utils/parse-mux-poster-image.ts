export type Params = {
  thumbnailUrl: string
  format?: 'jpg' | 'png' | 'webp'
  time?: number
  width?: number
}

export const parseMuxPosterImage = ({
  thumbnailUrl: url,
  format = 'webp',
  time = 0,
  width
}: Params): string => {
  try {
    if (url.length === 0) {
      throw new Error('URL string is empty')
    }

    const Url = new URL(url)

    if (Url.hostname.includes('image.mux.com') === false) {
      return url
    }

    const pathSegments = Url.pathname.split('/')
    const filename = pathSegments.pop()

    if (filename == null) {
      return url
    }

    if (filename.startsWith('thumbnail.') === false) {
      return url
    }

    Url.pathname = [...pathSegments, `thumbnail.${format}`].join('/')

    Url.searchParams.set('time', time.toString())

    if (width != null && width > 0) {
      Url.searchParams.set('width', Math.ceil(width).toString())
      Url.searchParams.set('fit_mode', 'preserve')
    }

    return Url.toString()
  } catch (err) {
    console.error('Mux video poster URL cannot be processed', err)
    return url
  }
}
