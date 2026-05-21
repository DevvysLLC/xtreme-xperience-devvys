import clsx from 'clsx'
import { CoreBrand } from '../../../components/core-brand'
import styles from './style.module.scss'

export default function StyleguideOverviewPage() {
  return (
    <div className={styles.overview}>
      <div
        className={clsx(styles.overview__item, styles['overview__item--black'])}
      >
        <CoreBrand />
      </div>
      <div className={styles.overview__item}>
        <CoreBrand />
      </div>
    </div>
  )
}
