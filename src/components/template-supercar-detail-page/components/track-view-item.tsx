'use client'

import { useEffect, useRef } from 'react'
import {
  useAnalyticsGA4Event,
  type ViewItemEventData
} from '../../../features/analytics'

type Props = {
  data: ViewItemEventData
}

export const TrackViewItem = ({ data }: Props) => {
  const ga4 = useAnalyticsGA4Event()
  const lastTrackedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    const trackKey = `${data.item_id}:${data.page_path ?? ''}`

    if (lastTrackedKeyRef.current === trackKey) {
      return
    }

    lastTrackedKeyRef.current = trackKey
    ga4.trackViewItem(data)
  }, [ga4, data])

  return null
}
