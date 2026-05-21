'use client'

import type { FC } from 'react'
import { getSectionId } from '../../../../core/string/get-section-id'
import { CoreAnnouncement } from '../../../core-announcement'
import type { SectionAnnouncementBarFragment } from '../../../section-announcement-bar/section-announcement-bar.typegen'
import { BookingAnnouncementBarWrapper } from './components/announcement-bar-wrapper'
import { Carousel } from './components/carousel'

export type BookingAnnouncementProps = {
  /**
   * Announcement data: from global booking config first, then fallback to selected track's announcement when global is empty.
   */
  data: SectionAnnouncementBarFragment | null
}

export const BookingAnnouncement: FC<BookingAnnouncementProps> = ({ data }) => {
  if (!data) {
    return null
  }

  const { config, id, cards = [] } = data

  if (cards.length === 0) {
    return null
  }

  const announcementCards = cards.map((card) => (
    <CoreAnnouncement key={card.id} data={card} />
  ))

  return (
    <BookingAnnouncementBarWrapper
      id={getSectionId(config?.customId, id)}
      config={config}
    >
      <Carousel cards={announcementCards} />
    </BookingAnnouncementBarWrapper>
  )
}
