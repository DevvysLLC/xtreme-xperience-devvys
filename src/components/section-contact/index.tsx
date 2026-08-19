import clsx from 'clsx'
import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreForm } from '../core-form'
import { CoreHubspotForm } from '../core-hubspot-form'
import { CoreSendlaneForm } from '../core-sendlane-form'
import { CoreKlaviyoForm } from '../core-klaviyo-form'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { SectionContactFragment } from './section-contact.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionContactFragment
  isFirstSection?: boolean
}

export const SectionContact: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, title, subtitle, description, form } = data
  const hubspotEmbed = form?.hubspotEmbed?.trim()
  const sendlaneEmbed = form?.sendlaneEmbed?.trim()

  const klaviyoFormIdMatch = /klaviyo-form-([a-zA-Z0-9]+)/.exec(sendlaneEmbed ?? '')
  const klaviyoFormId = klaviyoFormIdMatch?.[1] ?? null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-contact"
    >
      <div>
        {title && (
          <HeadingTag className={styles.section__title}>{title}</HeadingTag>
        )}

        {subtitle && <p className={styles.section__subtitle}>{subtitle}</p>}

        {description && (
          <div className={styles.section__description}>
            <CoreTextMarkdown type="rte">{description}</CoreTextMarkdown>
          </div>
        )}
      </div>

      <div className={styles.section__form}>
        {hubspotEmbed ? (
          <CoreHubspotForm
            embedForm={hubspotEmbed}
            hubspotVersion={form?.hubspotVersion}
          />
        ) : sendlaneEmbed ? (
          klaviyoFormId ? (
            <CoreKlaviyoForm formId={klaviyoFormId} />
          ) : (
            <CoreSendlaneForm embedForm={sendlaneEmbed} />
          )
        ) : (
          form && <CoreForm data={form} />
        )}
      </div>
    </section>
  )
}
