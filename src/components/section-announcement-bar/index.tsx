import type { FC } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { CoreAnnouncement } from '../core-announcement'
import { AnnouncementBarWrapper } from './components/announcement-bar-wrapper'
import { Carousel } from './components/carousel'
import type { SectionAnnouncementBarFragment } from './section-announcement-bar.typegen'

export type Props = {
  data: SectionAnnouncementBarFragment
}

export const SectionAnnouncementBar: FC<Props> = ({ data }) => {
  const { config, id, cards = [] } = data

  if (cards.length === 0) {
    return null
  }

  const announcementCards = cards.map((card) => (
    <CoreAnnouncement key={card.id} data={card} />
  ))

  return (
    <AnnouncementBarWrapper
      id={getSectionId(config?.customId, id)}
      config={config}
    >
      <Carousel cards={announcementCards} />
    </AnnouncementBarWrapper>
  )
}
