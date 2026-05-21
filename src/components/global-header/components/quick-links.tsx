import { getHref } from '../../../utils/get-href'
import { CoreCta } from '../../core-cta'
import type { GetHeaderQuery } from '../get-header.typegen'
import styles from '../style.module.scss'

type HeaderConfig = NonNullable<NonNullable<GetHeaderQuery['header']>['config']>

type Props = {
  items?: NonNullable<HeaderConfig['quickLinks']>['children']
}

export const QuickLinks = ({ items = [] }: Props) => {
  return (
    <div className={styles.quickLinks}>
      <div className={styles.quickLinks__wrapper}>
        {items.map((item) => (
          <div className={styles.quickLinks__item} key={item.id}>
            <CoreCta
              key={item.id}
              layoutType="pill"
              styleType="white-transparent"
              sizeType="small"
              text={item.label}
              href={getHref(item)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
