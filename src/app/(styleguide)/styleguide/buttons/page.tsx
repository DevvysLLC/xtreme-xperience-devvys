import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import { CoreCta } from '../../../../components/core-cta'
import styles from '../style.module.scss'

export default async function StyleguideButtonsPage() {
  const t = await getTranslations('styleguide.buttons')

  return (
    <div className={styles.buttons}>
      <div className={styles.buttons__section}>
        <div
          className={clsx(styles.buttons__row, styles['buttons__row--header'])}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>{t('styles')}</span>
          </div>
        </div>
        <div
          className={clsx(styles.buttons__row, styles['buttons__row--header'])}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_layouts.button')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.large')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.medium')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.small')}
            </span>
          </div>
        </div>
        <div className={styles.buttons__row}>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.black')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="large"
              styleType="black"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="medium"
              styleType="black"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="small"
              styleType="black"
              type="button"
            />
          </div>
        </div>
        <div
          className={clsx(
            styles.buttons__row,
            styles['buttons__row--background-dark']
          )}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.white')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="large"
              styleType="white"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="medium"
              styleType="white"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="small"
              styleType="white"
              type="button"
            />
          </div>
        </div>
        <div className={styles.buttons__row}>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.orange')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="large"
              styleType="orange"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="medium"
              styleType="orange"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="button"
              sizeType="small"
              styleType="orange"
              type="button"
            />
          </div>
        </div>
        <div
          className={clsx(styles.buttons__row, styles['buttons__row--header'])}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_layouts.underline')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.black')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.white')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.orange')}
            </span>
          </div>
        </div>
        <div
          className={clsx(
            styles.buttons__row,
            styles['buttons__row--background-dark']
          )}
        >
          <div className={styles.buttons__column}></div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="underline"
              sizeType="large"
              styleType="black"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="underline"
              sizeType="medium"
              styleType="white"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="underline"
              sizeType="small"
              styleType="orange"
              type="button"
            />
          </div>
        </div>
        <div
          className={clsx(styles.buttons__row, styles['buttons__row--header'])}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_layouts.pill')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.large')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.medium')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_sizes.small')}
            </span>
          </div>
        </div>
        <div className={styles.buttons__row}>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.black')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="large"
              styleType="black"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="medium"
              styleType="black"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="small"
              styleType="black"
              type="button"
            />
          </div>
        </div>
        <div
          className={clsx(
            styles.buttons__row,
            styles['buttons__row--background-dark']
          )}
        >
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.white')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="large"
              styleType="white"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="medium"
              styleType="white"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="small"
              styleType="white"
              type="button"
            />
          </div>
        </div>
        <div className={styles.buttons__row}>
          <div className={styles.buttons__column}>
            <span className={styles.buttons__heading}>
              {t('button_styles.orange')}
            </span>
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="large"
              styleType="orange"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="medium"
              styleType="orange"
              type="button"
            />
          </div>
          <div className={styles.buttons__column}>
            <CoreCta
              text={t('book_now')}
              layoutType="pill"
              sizeType="small"
              styleType="orange"
              type="button"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
