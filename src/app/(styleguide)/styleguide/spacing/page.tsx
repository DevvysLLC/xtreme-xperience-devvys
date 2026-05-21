import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import styles from '../style.module.scss'

export default async function StyleguideSpacingPage() {
  const t = await getTranslations('styleguide.spacing')

  return (
    <div className={styles.spacing}>
      <div
        className={clsx(styles.spacing__row, styles['spacing__row--header'])}
      >
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('scale')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('rem')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('px')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('spec')}</span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xxsmall')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>.25</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>4</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xxsmall']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xxsmall')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>.25</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>4</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xxsmall']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xsmall')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>.5</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>8</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xsmall']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('small')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>.75</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>12</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--small']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('regular')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>1</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>16</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--regular']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('medium')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>1.5</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>24</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--medium']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('large')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>2</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>32</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--large']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xlarge')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>2.5</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>40</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xlarge']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xxlarge')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>4</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>64</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xxlarge']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xxxlarge')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>5</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>80</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xxxlarge']
            )}
          ></span>
        </div>
      </div>

      <div className={clsx(styles.spacing__row)}>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>{t('xxxxlarge')}</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>7.5</span>
        </div>
        <div className={styles.spacing__column}>
          <span className={styles.spacing__title}>120</span>
        </div>
        <div className={styles.spacing__column}>
          <span
            className={clsx(
              styles.spacing__example,
              styles['spacing__example--xxxxlarge']
            )}
          ></span>
        </div>
      </div>
    </div>
  )
}
