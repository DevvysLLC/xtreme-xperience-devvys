import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import styles from '../style.module.scss'

export default async function StyleguideTypographyPage() {
  const t = await getTranslations('styleguide.typography')

  return (
    <div className={styles.typography}>
      <div className={styles.fonts}>
        <div className={styles.fonts__item}>
          <div className={clsx(styles.fonts__name)}>{t('anton.name')}</div>
          <div
            className={clsx(
              styles.fonts__example,
              styles['fonts__example--anton']
            )}
          >
            {t('anton.example')}
          </div>
        </div>
        <div className={styles.fonts__item}>
          <div className={clsx(styles.fonts__name)}>{t('barlow.name')}</div>
          <div
            className={clsx(
              styles.fonts__example,
              styles['fonts__example--barlow']
            )}
          >
            {t('barlow.example')}
          </div>
        </div>
        <div className={styles.fonts__item}>
          <div className={clsx(styles.fonts__name)}>
            {t('barlow_semi_condensed.name')}
          </div>
          <div
            className={clsx(
              styles.fonts__example,
              styles['fonts__example--barlow-semi-condensed']
            )}
          >
            {t('barlow_semi_condensed.example')}
          </div>
        </div>
      </div>
      <div className={styles.styles}>
        <h2 className={styles.styles__title}>Styles</h2>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xxxlarge'],
              styles['styles__item__name--anton']
            )}
          >
            {t('xxxlarge_anton_regular')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xxlarge'],
              styles['styles__item__name--anton']
            )}
          >
            {t('xxlarge_anton_regular')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xlarge'],
              styles['styles__item__name--anton']
            )}
          >
            {t('xlarge_anton_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xlarge'],
              styles['styles__item__name--barlow-semi-condensed'],
              styles['styles__item__name--500'],
              styles['styles__item__name--uppercase']
            )}
          >
            {t('xlarge_barlow_medium')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xlarge'],
              styles['styles__item__name--barlow-semi-condensed'],
              styles['styles__item__name--700'],
              styles['styles__item__name--uppercase']
            )}
          >
            {t('xlarge_barlow_bold')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xlarge'],
              styles['styles__item__name--barlow-semi-condensed'],
              styles['styles__item__name--700'],
              styles['styles__item__name--uppercase'],
              styles['styles__item__name--italic']
            )}
          >
            {t('xlarge_barlow_bold_italic')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--large'],
              styles['styles__item__name--anton']
            )}
          >
            {t('large_anton_regular')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--medium'],
              styles['styles__item__name--anton']
            )}
          >
            {t('medium_anton_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--medium'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--500']
            )}
          >
            {t('medium_barlow_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--medium'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--700']
            )}
          >
            {t('medium_barlow_bold')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--regular'],
              styles['styles__item__name--anton']
            )}
          >
            {t('regular_anton_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--regular'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--400']
            )}
          >
            {t('regular_barlow_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--regular'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--700']
            )}
          >
            {t('regular_barlow_bold')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--small'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--400']
            )}
          >
            {t('small_barlow_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--small'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--700']
            )}
          >
            {t('small_barlow_bold')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xsmall'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--400']
            )}
          >
            {t('xsmall_barlow_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xsmall'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--700']
            )}
          >
            {t('xsmall_barlow_bold')}
          </span>
        </div>
        <div className={styles.styles__item}>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xxsmall'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--400']
            )}
          >
            {t('xxsmall_barlow_regular')}
          </span>
          <span
            className={clsx(
              styles.styles__item__name,
              styles['styles__item__name--xxsmall'],
              styles['styles__item__name--barlow'],
              styles['styles__item__name--700']
            )}
          >
            {t('xxsmall_barlow_bold')}
          </span>
        </div>
      </div>
    </div>
  )
}
