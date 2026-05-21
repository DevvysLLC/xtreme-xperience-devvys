import type { FC } from 'react'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { CoreAnnouncementFragment } from './core-announcement.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreAnnouncementFragment
}

export const CoreAnnouncement: FC<Props> = ({ data }) => {
  const { title } = data

  if (!title) {
    return null
  }

  return (
    <div className={styles.announcement}>
      <CoreTextMarkdown>{title}</CoreTextMarkdown>
    </div>
  )
}
