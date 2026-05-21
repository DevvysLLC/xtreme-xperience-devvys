import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreSVGImage } from '../core-svg-upload'
import type { SectionPressBrandGridFragment } from './section-press-brand-grid.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionPressBrandGridFragment
}

export const SectionPressBrandGrid: FC<Props> = ({ data }) => {
  const { logos, config, id } = data
  const maxLogos = 6

  if (logos.length === 0) {
    return null
  }

  const logosToUse = logos.slice(0, maxLogos)

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-press-brand-grid"
    >
      <div className={styles.marquee}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div className={styles.marquee__inner} key={index}>
            {logosToUse.map((logo) => (
              <CoreSVGImage
                key={logo.id}
                data={logo}
                className={styles.marquee__logo}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
