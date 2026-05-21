import { type FC, memo } from 'react'
import { HERO_DESKTOP_MEDIA_QUERY } from '../../config/media'
import styles from './style.module.scss'

type LcpUrls = {
  mobile: string
  desktop?: string
  alt?: string | null
}

export type PosterLayerProps = {
  lcpUrls: LcpUrls
  sizes?: string
}

const PosterLayerInner: FC<PosterLayerProps> = ({ lcpUrls, sizes }) => {
  const { mobile, desktop, alt } = lcpUrls
  const desktopSrc = desktop ?? mobile

  if (!mobile) {
    return null
  }

  return (
    <picture className={styles.poster}>
      <source media={HERO_DESKTOP_MEDIA_QUERY} srcSet={desktopSrc} />
      <img
        src={mobile}
        sizes={sizes}
        alt={alt ?? ''}
        fetchPriority="high"
        loading="eager"
        decoding="auto"
      />
    </picture>
  )
}

export const PosterLayer = memo(PosterLayerInner)
