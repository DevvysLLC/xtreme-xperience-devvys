'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { getHref } from '../../../utils/get-href'
import { PlusIcon } from '../../core-icon/icons/plus'
import type { GetFooterQuery } from '../get-footer.typegen'
import styles from '../style.module.scss'

type NavigationGroup = NonNullable<
  NonNullable<GetFooterQuery['footer']>['config']
>['navigation'][number]

type Props = {
  group: NavigationGroup
}

export const NavigationGroup = ({ group }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      aria-label={group.label ?? ''}
      key={group.id}
    >
      <button
        onClick={() => {
          setOpen(!open)
        }}
        aria-expanded={open}
        aria-controls={`group-${group.id}`}
        className={styles.navigation__toggle}
      >
        <span className={styles.navigation__label}>{group.label}</span>
        <span
          className={clsx(
            styles.navigation__icon,
            open && styles['navigation__icon--isOpen']
          )}
        >
          <PlusIcon />
        </span>
      </button>

      <div
        className={clsx(
          styles.navigation__list__wrapper,
          open && styles['navigation__list__wrapper--isOpen']
        )}
      >
        <ul id={`group-${group.id}`} className={styles.navigation__list}>
          {group.children.map((child) => {
            return (
              <li key={child.id} className={styles.navigation__item}>
                <Link href={getHref(child)} target={child.target || '_self'}>
                  {child.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
