'use client'
import NextLink from 'next/link'
import { useStyleguideLinks } from '../hooks/links'
import styles from '../style.module.scss'

export const Navigation = () => {
  const { linksList } = useStyleguideLinks()

  return (
    <>
      {linksList.map((linkGroup) => (
        <nav key={linkGroup.group} className={styles.nav}>
          <h3 className={styles.nav__title}>{linkGroup.group}</h3>
          <ul className={styles.nav__list}>
            {linkGroup.links.map((link) => (
              <li key={link.href} className={styles.nav__item}>
                <NextLink href={link.href} className={styles.nav__link}>
                  {link.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  )
}
