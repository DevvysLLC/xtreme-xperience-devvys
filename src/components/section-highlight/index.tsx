import type { FC } from 'react'
import type { SupercarModelFragment } from '../../core/dato/fragments/supercar-model.typegen'
import type { TrackModelFragment } from '../../core/dato/fragments/track-model.typegen'
import { getSectionId } from '../../core/string/get-section-id'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreHighlight } from '../core-highlight'
import { CoreImage } from '../core-image'
import { CoreMap } from '../core-map'
import { CoreVideo } from '../core-video'
import type { SectionHighlightFragment } from './section-highlight.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionHighlightFragment
  model: TrackModelFragment | SupercarModelFragment | null
  isFirstSection?: boolean
}

export const SectionHighlight: FC<Props> = ({
  data,
  model,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, highlight = [], media, title, showMap } = data
  const location =
    model && 'location' in model && model.location ? model.location : null

  return (
    <section
      className={styles.section}
      id={getSectionId(config?.customId, id)}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-highlight"
    >
      <div className={styles.main}>
        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
        <div className={styles.media}>
          {showMap ? (
            <CoreMap
              lat={location?.latitude}
              long={location?.longitude}
              className={styles.map}
              zoom={7}
            />
          ) : isImage(media) ? (
            <CoreImage data={media} layout="fill" />
          ) : isVideo(media) ? (
            <CoreVideo data={media} layout="fill" />
          ) : (
            // Fallback to static map if no media is available
            <CoreMap
              lat={location?.latitude}
              long={location?.longitude}
              className={styles.map}
              showStaticImage={true}
              zoom={7}
            />
          )}
        </div>
      </div>

      <div className={styles.details}>
        {highlight.length > 0 &&
          highlight.map((item) => {
            return <CoreHighlight data={item} key={item.id} />
          })}
      </div>
    </section>
  )
}
