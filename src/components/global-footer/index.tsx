import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ROUTES } from '../../config/routes'
import { initDatoSdk } from '../../core/dato/sdk'
import { getHref } from '../../utils/get-href'
import { CoreBrand } from '../core-brand'
import { CoreNewsletterSignupForm } from '../core-newsletter-signup-form'
import { CoreTextMarkdown } from '../core-text-markdown'
import { CoreKlaviyoForm } from '../core-klaviyo-form'
import { SectionRenderer } from '../section-renderer'
import { NavigationGroup } from './components/navigation-group'
import styles from './style.module.scss'

export const GlobalFooter = async () => {
  const sdk = initDatoSdk()
  const { footer } = await sdk.getFooter()
  const { globalConfig } = await sdk.getGlobalConfig()
  const { contactPhoneNumber, workingHours } = globalConfig ?? {}
  const { config, content } = footer ?? {}
  const { sections = [] } = content ?? { sections: [] }
  const {
    showNewsletterSignupForm = false,
    showSocial = false,
    social,
    navigation = []
  } = config ?? {}

  const t = await getTranslations('global_footer')
  const brand = t('brand_name')
  const year = new Date().getFullYear()

  const klaviyoNewsletterFormId = process.env.NEXT_PUBLIC_KLAVIYO_NEWSLETTER_FORM_ID

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__sections}>
        {sections.length > 0 && <SectionRenderer sections={sections} />}
      </div>
      <div className={styles.footer__main}>
        <div className={styles.footer__content}>
          <div className={styles.footer__top}>
            {showNewsletterSignupForm && config && (
              <div className={styles.newsletter}>
                {klaviyoNewsletterFormId ? (
                  <CoreKlaviyoForm formId={klaviyoNewsletterFormId} />
                ) : (
                  <CoreNewsletterSignupForm config={config} />
                )}
              </div>
            )}
            <div className={styles.footer__top__navigation}>
              {navigation.length > 0 &&
                navigation.map((group) => (
                  <NavigationGroup key={group.id} group={group} />
                ))}

              {(contactPhoneNumber || workingHours) && (
                <div className={styles.contacts}>
                  <h2 className={styles.contacts__title}>{t('call_us')}</h2>
                  {contactPhoneNumber && (
                    <div className={styles.contacts__content}>
                      <a href={`tel:${contactPhoneNumber}`}>
                        {contactPhoneNumber}
                      </a>
                    </div>
                  )}
                  {workingHours && (
                    <div className={styles.contacts__hours}>
                      <CoreTextMarkdown>{workingHours ?? ''}</CoreTextMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.footer__bottom}>
            <Link
              href={ROUTES.FRONTEND.HOME}
              className={styles.brand}
              aria-label={t('brand_name')}
            >
              <CoreBrand />
            </Link>

            <div className={styles.footer__bottom__navigation}>
              {showSocial && social?.children && social.children.length > 0 && (
                <div className={styles.social}>
                  <h2 className={styles.social__title}>{t('follow_us')}</h2>
                  <ul className={styles.social__list}>
                    {social.children.map((item) => (
                      <li className={styles.social__item} key={item.id}>
                        <Link
                          href={getHref(item)}
                          target={item.target || '_self'}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.copyright}>
                <span className={styles.copyright__text}>
                  {t('copyright', { year })} {brand}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
