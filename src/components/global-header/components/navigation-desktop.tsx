import clsx from 'clsx'
import Link from 'next/link'
import { getHref } from '../../../utils/get-href'
import { CoreIcon } from '../../core-icon'
import { useHeader } from '../context/header-context'
import type { GetHeaderQuery } from '../get-header.typegen'
import { getMegaMenuHandlers } from '../helpers/get-mega-menu-handlers'
import styles from '../style.module.scss'
import { MegaMenu } from './mega-menu'

type HeaderConfig = NonNullable<NonNullable<GetHeaderQuery['header']>['config']>

type Props = {
  items?: HeaderConfig['navigation']
}

export const NavigationDesktop = ({ items = [] }: Props) => {
  const { openMegaMenuId, setOpenMegaMenuId } = useHeader()

  return (
    <nav className={styles.navigationDesktop}>
      <ul className={styles.navigationDesktop__list}>
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length)
          const isOpen = openMegaMenuId === item.id
          const handlers = getMegaMenuHandlers(
            hasChildren,
            item.id,
            setOpenMegaMenuId
          )

          return (
            <li
              key={item.id}
              className={clsx(
                styles.navigationDesktop__item,
                isOpen && styles['navigationDesktop__item--isOpen']
              )}
              aria-haspopup={hasChildren}
              aria-expanded={isOpen}
              {...handlers}
            >
              <Link
                href={getHref(item)}
                className={styles.navigationDesktop__item__link}
              >
                <span className={styles.navigationDesktop__item__label}>
                  {item.label}
                </span>

                {hasChildren && (
                  <span className={styles.navigationDesktop__item__icon}>
                    <CoreIcon icon="chevron-down" />
                  </span>
                )}
              </Link>

              {hasChildren && item.children && (
                <MegaMenu items={item.children} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
