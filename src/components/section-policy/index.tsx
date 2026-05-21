import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import { CoreTextMarkdown } from '../core-text-markdown'
import { PolicyTabs } from './components/policy-tabs'
import type { SectionPolicyFragment } from './section-policy.typegen'
import styles from './style.module.scss'

export type Props = {
  data: SectionPolicyFragment
  isFirstSection?: boolean
}

// Server Component - renders static content
export const SectionPolicy: FC<Props> = ({ data, isFirstSection }) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const { config, id, title, subtitle, policies } = data

  // Extract and filter tabs on the server
  const tabs = policies
    .filter(
      (
        policy
      ): policy is typeof policy & {
        model: NonNullable<typeof policy.model>
      } => policy.model !== null
    )
    .map((policy) => policy.model)

  // Default to first tab for initial server render
  const defaultTabId = tabs[0]?.id ?? null

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={styles.section}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-policy"
    >
      <div className={styles.content}>
        {title && <HeadingTag className={styles.title}>{title}</HeadingTag>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {/* Client component only for interactive tab selection */}
        <PolicyTabs tabs={tabs} defaultTabId={defaultTabId} />
      </div>

      {/* Server-render all tab contents, hidden by CSS - enables instant switching */}
      <div className={styles.policies}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-policy-id={tab.id}
            className={styles.policyContent}
            // First tab visible by default for no-JS and initial render
            data-default={tab.id === defaultTabId ? 'true' : undefined}
          >
            <CoreTextMarkdown type="rte">{tab.body ?? ''}</CoreTextMarkdown>
          </div>
        ))}
      </div>
    </section>
  )
}
