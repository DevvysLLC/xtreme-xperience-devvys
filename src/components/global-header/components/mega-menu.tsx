import type { MegaMenuItem } from '../hooks/use-mega-menu'
import { useMegaMenu } from '../hooks/use-mega-menu'
import styles from '../style.module.scss'
import { MegaMenuRegularList } from './mega-menu-regular-list'
import { NavigationSupercarsGrid } from './navigation-supercars-grid'

type Props = {
  items?: MegaMenuItem[]
}

export const MegaMenu = ({ items = [] }: Props) => {
  const { supercars, regular, regularHasMedia } = useMegaMenu(items)

  return (
    <div className={styles.megaMenu}>
      <div className={styles.megaMenu__content}>
        {regular.length > 0 && (
          <MegaMenuRegularList items={regular} hasMedia={regularHasMedia} />
        )}
        {supercars.length > 0 && <NavigationSupercarsGrid items={supercars} />}
      </div>
    </div>
  )
}
