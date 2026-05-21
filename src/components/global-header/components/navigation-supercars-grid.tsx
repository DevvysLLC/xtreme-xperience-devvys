import { useTranslations } from 'next-intl'
import { ROUTES } from '../../../config/routes'
import { CoreCta } from '../../core-cta'
import { CoreSupercarCard } from '../../core-supercar-card'
import type { MegaMenuItem } from '../hooks/use-mega-menu'
import styles from '../style.module.scss'

type Props = {
  items: MegaMenuItem[]
}

export const NavigationSupercarsGrid = ({ items }: Props) => {
  const t = useTranslations('global_header.supercars')

  return (
    <div className={styles.navigationSupercars}>
      <div className={styles.navigationSupercars__grid}>
        {items.map((item) => {
          if (item.link?.__typename === 'SupercarRecord') {
            return (
              <CoreSupercarCard
                key={item.id}
                data={item.link}
                type="simple"
                backgroundColor="gray-50"
                className={styles.navigationSupercars__card}
              />
            )
          }
        })}
      </div>
      <CoreCta
        text={t('view_all')}
        href={ROUTES.FRONTEND.SUPERCARS.LISTING}
        className={styles.navigationSupercars__cta}
      />
    </div>
  )
}
