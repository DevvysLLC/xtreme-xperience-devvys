import clsx from 'clsx'
import Link from 'next/link'
import { getHref } from '../../../utils/get-href'
import { CoreMediaCard } from '../../core-media-card'
import type { MegaMenuItem } from '../hooks/use-mega-menu'
import styles from '../style.module.scss'

type Props = {
  items: MegaMenuItem[]
  hasMedia: boolean
}

export const MegaMenuRegularList = ({ items, hasMedia }: Props) => {
  return (
    <ul
      className={clsx(
        styles.megaMenu__list,
        !hasMedia && styles['megaMenu__list--noMedia']
      )}
    >
      {items.map((item) => {
        return (
          <li key={item.id} className={styles.megaMenu__item}>
            <Link href={getHref(item)}>
              {item.media && (
                <CoreMediaCard
                  data={{
                    __typename: 'CoreMediaCardRecord',
                    id: item.id,
                    title: null,
                    subtitle: null,
                    highlight: null,
                    media: item.media,
                    gradient: null,
                    cta: null
                  }}
                  className={styles.megaMenu__item__media}
                />
              )}
              <span className={styles.megaMenu__item__title}>{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
