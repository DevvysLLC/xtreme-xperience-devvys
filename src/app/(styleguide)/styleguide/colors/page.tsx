import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import styles from '../style.module.scss'

export default async function StyleguideColorsPage() {
  const t = await getTranslations('styleguide.colors')

  return (
    <div className={styles.colors__container}>
      <div className={styles.colors__section}>
        <div
          className={clsx(styles.colors__row, styles['colors__row--header'])}
        >
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('brand')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('spec')}</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--black']
              )}
            ></span>
            <span className={styles.colors__title}>{t('black')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#212121</span>
            <span className={styles.colors__key}>black</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--white']
              )}
            ></span>
            <span className={styles.colors__title}>{t('white')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#FFFFFF</span>
            <span className={styles.colors__key}>white</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--orange']
              )}
            ></span>
            <span className={styles.colors__title}>{t('orange')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#EB642C</span>
            <span className={styles.colors__key}>orange</span>
          </div>
        </div>
      </div>

      <div className={styles.colors__section}>
        <div
          className={clsx(styles.colors__row, styles['colors__row--header'])}
        >
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('basic')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('spec')}</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--black-80']
              )}
            ></span>
            <span className={styles.colors__title}>{t('black_80')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#212121, 0.80</span>
            <span className={styles.colors__key}>black-80</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--black-50']
              )}
            ></span>
            <span className={styles.colors__title}>{t('black_50')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#212121, 0.50</span>
            <span className={styles.colors__key}>black-50</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--black-20']
              )}
            ></span>
            <span className={styles.colors__title}>{t('black_20')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#212121, 0.20</span>
            <span className={styles.colors__key}>black-20</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--black-10']
              )}
            ></span>
            <span className={styles.colors__title}>{t('black_10')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#212121, 0.10</span>
            <span className={styles.colors__key}>black-10</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--white']
              )}
            ></span>
            <span className={styles.colors__title}>{t('white')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#FFFFFF</span>
            <span className={styles.colors__key}>white</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--white-80']
              )}
            ></span>
            <span className={styles.colors__title}>{t('white_80')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#FFFFFF, 0.80</span>
            <span className={styles.colors__key}>white-80</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--white-50']
              )}
            ></span>
            <span className={styles.colors__title}>{t('white_50')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#FFFFFF, 0.50</span>
            <span className={styles.colors__key}>white-50</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--white-20']
              )}
            ></span>
            <span className={styles.colors__title}>{t('white_20')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#FFFFFF, 0.20</span>
            <span className={styles.colors__key}>white-20</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--carrara']
              )}
            ></span>
            <span className={styles.colors__title}>{t('carrara')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#F0EDEB</span>
            <span className={styles.colors__key}>carrara</span>
          </div>
        </div>
      </div>

      <div className={styles.colors__section}>
        <div
          className={clsx(styles.colors__row, styles['colors__row--header'])}
        >
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>
              {t('backgrounds_and_borders')}
            </span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('spec')}</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--border_dark']
              )}
            ></span>
            <span className={styles.colors__title}>{t('border_dark')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#C1BFBE</span>
            <span className={styles.colors__key}>border-dark</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--border_light']
              )}
            ></span>
            <span className={styles.colors__title}>{t('border_light')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#F0EDEB</span>
            <span className={styles.colors__key}>border-light</span>
          </div>
        </div>
      </div>

      <div className={styles.colors__section}>
        <div
          className={clsx(styles.colors__row, styles['colors__row--header'])}
        >
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>
              {t('backgrounds_and_borders')}
            </span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('spec')}</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--border_dark']
              )}
            ></span>
            <span className={styles.colors__title}>{t('border_dark')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#C1BFBE</span>
            <span className={styles.colors__key}>border-dark</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--border_light']
              )}
            ></span>
            <span className={styles.colors__title}>{t('border_light')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#F0EDEB</span>
            <span className={styles.colors__key}>border-light</span>
          </div>
        </div>
      </div>

      <div className={styles.colors__section}>
        <div
          className={clsx(styles.colors__row, styles['colors__row--header'])}
        >
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('support')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__heading}>{t('spec')}</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--success']
              )}
            ></span>
            <span className={styles.colors__title}>{t('success')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#4A934A</span>
            <span className={styles.colors__key}>success</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--success_20']
              )}
            ></span>
            <span className={styles.colors__title}>{t('success_20')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#4A934A, 0.20</span>
            <span className={styles.colors__key}>success-20</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--error']
              )}
            ></span>
            <span className={styles.colors__title}>{t('error')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#C31414</span>
            <span className={styles.colors__key}>error</span>
          </div>
        </div>
        <div className={styles.colors__row}>
          <div
            className={clsx(
              styles.colors__column,
              styles['colors__column--row']
            )}
          >
            <span
              className={clsx(
                styles.colors__example,
                styles['colors__example--error_20']
              )}
            ></span>
            <span className={styles.colors__title}>{t('error_20')}</span>
          </div>
          <div className={styles.colors__column}>
            <span className={styles.colors__hex}>#C31414, 0.20</span>
            <span className={styles.colors__key}>error-20</span>
          </div>
        </div>
      </div>
    </div>
  )
}
