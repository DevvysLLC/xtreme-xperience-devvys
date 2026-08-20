'use client'

import type { FC } from 'react'
import { useCallback } from 'react'
import { CoreBadge } from '../core-badge'
import { CoreCta } from '../core-cta'
import { useDialog } from '../global-dialog'

export type TrackNotifyMeButtonProps = {
  trackName: string
  soldOut: boolean
  className?: string
  text?: string
  variant?: 'button' | 'badge'
}

export const TrackNotifyMeButton: FC<TrackNotifyMeButtonProps> = ({
  trackName,
  soldOut,
  className,
  text = 'Notify Me',
  variant = 'button'
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

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleNotifyMe}
        className={className}
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'inline-flex'
        }}
      >
        <CoreBadge
          label={text}
          backgroundColor={'oklch(0.232 0.004 264.4 / 0.1)'}
          color={'oklch(0 0 0)'}
        />
      </button>
    )
  }

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
