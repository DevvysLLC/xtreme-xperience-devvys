import clsx from 'clsx'
import type { FC } from 'react'
import type { SupercarModelFragment } from '../../core/dato/fragments/supercar-model.typegen'
import type { TrackModelFragment } from '../../core/dato/fragments/track-model.typegen'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { Carousel } from './components/carousel'
import type { SectionMediaGalleryFragment } from './section-media-gallery.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionMediaGalleryFragment
  model?: TrackModelFragment | SupercarModelFragment | null
  isFirstSection?: boolean
}

export const SectionMediaGallery: FC<Props> = ({
  data,
  model,
  isFirstSection
}) => {
  // Prefer model if present, otherwise use data
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const source = model ?? data
  const { id, title, config } = data
  const { gallery = [] } = source

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-media-gallery"
    >
      {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}

      {gallery.length > 0 && <Carousel gallery={gallery} />}
    </section>
  )
}
