'use client'

import type { FC } from 'react'
import { useCallback } from 'react'
import { CoreCta } from '../core-cta'
import { useDialog } from '../global-dialog'

export type TrackNotifyMeButtonProps = {
  trackName: string
  soldOut: boolean
  className?: string
  text?: string
}

export const TrackNotifyMeButton: FC<TrackNotifyMeButtonProps> = ({
  trackName,
  soldOut,
  className,
  text = 'Notify Me'
}) => {
  const { showDialog } = useDialog()

  const handleNotifyMe = useCallback(() => {
    const klaviyoFormId = process.env.NEXT_PUBLIC_KLAVIYO_NOTIFY_FORM_ID

    showDialog({
      translations: {
        title: `Notify Me - ${trackName}`,
        description: soldOut
          ? `This event is sold out. Sign up to get notified via email if tickets become available or as soon as new driving dates are scheduled for ${trackName}!`
          : `This event has passed. Sign up to get notified via email as soon as new driving dates are scheduled for ${trackName}!`,
        confirmButton: 'Got It',
        cancelButton: 'Close',
        ...(klaviyoFormId && { klaviyoFormId })
      },
      onConfirm: () => {}
    })
  }, [trackName, showDialog, soldOut])

  return (
    <CoreCta
      text={text}
      layoutType="button"
      styleType="orange"
      sizeType="small"
      className={className}
      onClick={handleNotifyMe}
    />
  )
}
