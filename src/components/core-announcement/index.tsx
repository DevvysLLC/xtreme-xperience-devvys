import clsx from 'clsx'
import type { FC } from 'react'
import { CoreTextMarkdown } from '../core-text-markdown'
import type { CoreAnnouncementFragment } from './core-announcement.typegen'
import styles from './style.module.scss'

export type Props = {
  data: CoreAnnouncementFragment
  className?: string
}

export const CoreAnnouncement: FC<Props> = ({ data, className }) => {
  const { title } = data

  if (!title) {
    return null
  }

  return (
    <div className={clsx(styles.announcement, className)}>
      <CoreTextMarkdown>{title}</CoreTextMarkdown>
    </div>
  )
}
