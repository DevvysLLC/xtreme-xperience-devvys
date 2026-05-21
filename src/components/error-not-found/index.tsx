import { getTranslations } from 'next-intl/server'
import { initDatoSdk } from '../../core/dato/sdk'
import { CoreCta } from '../core-cta'
import { CoreLottie } from '../core-lottie'
import { CoreTextMarkdown } from '../core-text-markdown'
import styles from './style.module.scss'

export const ErrorNotFound = async () => {
  const t = await getTranslations('error_not_found')
  const sdk = initDatoSdk()
  const { globalConfig } = await sdk.getGlobalConfig()
  const title404 = globalConfig?.title404 || t('title')
  const subtitle404 = globalConfig?.subtitle404 || t('subtitle')
  const description404 = globalConfig?.description404
  const ctas404 = globalConfig?.ctas404

  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <CoreLottie src="/animation/animation-404.lottie" />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{title404}</h1>

        {subtitle404 && <p className={styles.subtitle}>{subtitle404}</p>}

        {description404 && (
          <div className={styles.description}>
            <CoreTextMarkdown type="rte">{description404}</CoreTextMarkdown>
          </div>
        )}

        {ctas404 && ctas404.length > 0 && (
          <div className={styles.ctas}>
            {ctas404.map((cta) => (
              <CoreCta key={cta.id} data={cta} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
