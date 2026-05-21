import { type FC, memo } from 'react'
import { isImage, isVideo } from '../../core/typescript/guards'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import type { CoreSocialCardFragment } from './core-social-card.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreSocialCardFragment
}

const CoreSocialCardInner: FC<Props> = ({ data }) => {
  // Defensive guard: Swiper's loop mode creates DOM clones that don't have React props
  if (!data) {
    return null
  }

  const { media, cta } = data

  if (!media) {
    return null
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__media}>
        {isImage(media) && <CoreImage data={media} layout="fill" />}
        {isVideo(media) && (
          <CoreVideo
            data={media}
            layout="fill"
            controlsClassName={styles.card__media__controls}
          />
        )}
      </div>

      {cta && (
        <CoreCta
          data={cta}
          className={styles.card__cta}
          layoutType="transparent"
        />
      )}
    </div>
  )
}

// Memoize to prevent re-renders when parent re-renders with same cards
export const CoreSocialCard = memo(CoreSocialCardInner)
