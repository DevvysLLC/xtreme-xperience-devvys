import type { FC } from 'react'
import { Logo } from './components/logo'
import style from './style.module.scss'

export const CoreBrand: FC = () => {
  return (
    <div className={style.coreBrand}>
      <Logo />
    </div>
  )
}
