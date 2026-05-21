'use client'

import clsx from 'clsx'
import { useCallback } from 'react'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { CoreCta } from '../../core-cta'
import styles from '../style.module.scss'

type Props = {
  className?: string
  text: string
}

export const SupercarSpecButton: React.FC<Props> = ({ className, text }) => {
  const bus = useMainBus(DRAWER_REQUEST_OPEN_MESSAGE_NAME, () => {})

  const handleClick = useCallback(() => {
    bus.send({
      name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
      details: { id: 'supercar-full-spec-drawer' }
    })
  }, [bus])

  return (
    <CoreCta
      className={clsx(styles.specifications__button, className)}
      href={null}
      layoutType="button"
      sizeType="medium"
      styleType="black"
      text={text}
      onClick={handleClick}
    />
  )
}
