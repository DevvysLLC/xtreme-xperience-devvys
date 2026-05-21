import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { validateHtmlForEmbed } from '../../utils/is-html-safe-for-embed'
import { CoreCta } from '../core-cta'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { SectionIframeFragment } from './section-iframe.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionIframeFragment
  isFirstSection?: boolean
}

export const SectionIframe: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const {
    config,
    id,
    layout,
    title,
    subtitle,
    description,
    ctas,
    embedCode,
    fullscreenAspectRatio
  } = data

  const isFullscreen = layout === 'fullscreen'
  const aspectRatio = fullscreenAspectRatio || '16/9'

  const embedValidation =
    embedCode != null && embedCode.trim().length > 0
      ? validateHtmlForEmbed(embedCode)
      : null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        isFullscreen && styles['section--fullscreen'],
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-iframe"
    >
      {isFullscreen ? (
        <div className={styles.fullscreenAspectRatio} style={{ aspectRatio }}>
          {embedValidation?.safe === true && (
            <div
              className={styles.iframe}
              dangerouslySetInnerHTML={{ __html: embedValidation.html }}
            />
          )}
        </div>
      ) : (
        <div className={clsx(styles.container, styles[`container--${layout}`])}>
          <div className={styles.content}>
            {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {description && (
              <div className={styles.description}>
                <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
              </div>
            )}
            {ctas && ctas.length > 0 && (
              <div className={styles.ctas}>
                {ctas.map((cta) => (
                  <CoreCta key={cta.id} data={cta} />
                ))}
              </div>
            )}
          </div>

          {embedValidation?.safe === true && (
            <div
              className={styles.iframe}
              dangerouslySetInnerHTML={{ __html: embedValidation.html }}
            />
          )}
        </div>
      )}
    </section>
  )
}
