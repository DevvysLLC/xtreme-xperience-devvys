'use client'

import { useIsMutating } from '@tanstack/react-query'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../../core/messaging/main/messages/close-drawer'
import { useMainBus } from '../../../core/messaging/main/react'
import { BOOKING_CLEAR_MUTATION_KEY } from '../../../features/booking'
import { LOCATION_CLEAR_MUTATION_KEY } from '../../../features/location'
import { useRouteChange } from '../../../features/route'
import { Drawer } from '../../global-drawer'
import { TrackFinderDrawerProvider } from '../context/drawer-context'
import styles from '../style.module.scss'
import { TrackFinderDrawerContent } from './drawer-content'
import { TrackFinderDrawerHeader } from './drawer-header'

export const TrackFinderDrawer = () => {
  const t = useTranslations('track_finder.drawer')
  const mainBus = useMainBus(DRAWER_REQUEST_CLOSE_MESSAGE_NAME, () => {})
  const isClearingLocation = useIsMutating({
    mutationKey: LOCATION_CLEAR_MUTATION_KEY
  })
  const isClearingBooking = useIsMutating({
    mutationKey: BOOKING_CLEAR_MUTATION_KEY
  })
  const isPending = isClearingLocation > 0 || isClearingBooking > 0

  useRouteChange(() => {
    mainBus.send({
      name: DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
      details: { id: 'track-finder-drawer' }
    })
  })

  return (
    <Drawer
      id="track-finder-drawer"
      className={styles.drawer}
      title={t('title')}
    >
      <TrackFinderDrawerProvider>
        <div
          className={clsx(
            styles.drawer__body,
            isPending && styles['is-loading']
          )}
        >
          <TrackFinderDrawerHeader />
          <TrackFinderDrawerContent />
        </div>
      </TrackFinderDrawerProvider>
    </Drawer>
  )
}
