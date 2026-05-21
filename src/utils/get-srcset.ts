import { logger } from '../core/logger/logger'
import { getDprFromWidth } from './get-dpr-from-width'

const context = 'getSrcset'

type GetSrcsetProps = {
  url: string
  sizes?: number[] | null
}

export const getSrcset = ({
  url,
  sizes = [320, 480, 640, 800]
}: GetSrcsetProps): string => {
  if (!url) {
    return ''
  }

  const formattedUrl = url.startsWith('//') ? `https:${url}` : url

  try {
    const maxWidth = Math.max(...(sizes ?? [320, 480, 640, 800]))

    const result = (sizes ?? [320, 480, 640, 800])
      .map((size) => {
        const imgixUrl = new URL(formattedUrl)
        const dpr = getDprFromWidth(size, maxWidth)
        if (dpr) {
          imgixUrl.searchParams.set('dpr', dpr)
        }
        return `${imgixUrl.toString()} ${size}w`
      })
      .join(', ')
    logger.info({
      context,
      data: {
        url,
        sizes,
        result
      }
    })
    return result
  } catch (error) {
    logger.error({ context, error }, 'Error getting srcset')
    return ''
  }
}
