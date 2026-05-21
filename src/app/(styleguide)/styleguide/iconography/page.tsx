import { CoreIcon } from '../../../../components/core-icon'
import styles from '../style.module.scss'

const ICON_LIST = [
  '3d',
  'account',
  'arrow-right',
  'bag',
  'cart',
  'check',
  'chevron-down',
  'chevron-right',
  'circle-play',
  'close',
  'date',
  'double-column',
  'car',
  'full-screen',
  'heart',
  'location',
  'menu',
  'minus',
  'mute',
  'ok',
  'pause',
  'play',
  'plus',
  'premium',
  'reviews',
  'search',
  'security',
  'shipping',
  'single-column',
  'sound-on',
  'travel',
  'view-password',
  'star-full',
  'star-half'
]

export default function StyleguideIconographyPage() {
  return (
    <div className={styles.iconography}>
      <div className={styles.iconography__list}>
        {ICON_LIST.map((icon) => (
          <div className={styles.item} key={icon}>
            <CoreIcon
              data={{
                __typename: 'CoreIconRecord',
                id: icon,
                icon
              }}
            />
            <span className={styles.item__name}>{icon}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
