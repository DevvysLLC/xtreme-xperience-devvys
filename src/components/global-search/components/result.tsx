'use client'

import { useTranslations } from 'next-intl'
import type { RecordConfig } from '../../../utils/get-record-link'
import { getRecordLink } from '../../../utils/get-record-link'
import { CoreCta } from '../../core-cta'
import { CoreIcon } from '../../core-icon'
import type { SearchDocument } from '../io'
import styles from '../style.module.scss'
import { getTitle } from '../utils'

type Props = {
  document: SearchDocument
  type: 'supercar' | 'track' | 'page'
}

const hasRecordConfig = (config: unknown): config is RecordConfig =>
  typeof config === 'object' && config !== null && 'handle' in config

export const SearchResult = ({ document, type }: Props) => {
  const t = useTranslations('search.utils')
  const { data } = document
  const title = getTitle(document, type, {
    missingTitleFallback: t('missing_title')
  })
  const recordLink = hasRecordConfig(data.config)
    ? getRecordLink(data.config, type)
    : null

  return (
    <div className={styles.globalSearch__resultWrapper}>
      {recordLink && (
        <CoreCta href={recordLink} layoutType="transparent" text={title} />
      )}
      <div className={styles.globalSearch__resultItem}>
        {recordLink && (
          <>
            <CoreCta href={recordLink} layoutType="text" text={title} />
            <CoreIcon icon="arrow-up-right" />
          </>
        )}
      </div>
    </div>
  )
}
