'use client'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'
import { CoreCta } from '../../core-cta'
import type { SectionAddonsGridFragment } from '../section-addons-grid.typegen'
import styles from '../style.module.scss'

type Props = {
  ctas?: SectionAddonsGridFragment['ctas']
}

export const Navigation: FC<Props> = ({ ctas }) => {
  const pathname = usePathname()

  if (!ctas || ctas.length === 0) {
    return null
  }

  return (
    <div className={styles.actions}>
      {ctas.map((cta) => {
        const { path: datoPath, link: datoLink } = cta
        const _datoHandle = datoLink?.entry?.handle
        const ctaHref = _datoHandle ? `/${_datoHandle}` : (datoPath ?? '')
        const isActive = ctaHref === pathname
        return (
          <div key={cta.id}>
            <CoreCta data={cta} styleType={isActive ? 'black' : 'white'} />
          </div>
        )
      })}
    </div>
  )
}
