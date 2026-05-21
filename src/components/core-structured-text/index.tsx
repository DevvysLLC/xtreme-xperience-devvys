'use client'
import type { FC } from 'react'
import { StructuredText } from 'react-datocms'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import type { CoreStructuredTextFragment } from './core-structured-text.typegen'

export type Props = {
  data: CoreStructuredTextFragment | null | undefined
}

export const CoreStructuredText: FC<Props> = ({ data }) => {
  if (!data?.value) {
    return null
  }

  const getRecordUrl = (record: {
    __typename: string
    entry?: { handle?: string | null }
  }) => {
    if (!record.entry?.handle) {
      return null
    }
    switch (record.__typename) {
      case 'PageRecord':
        return `/${record.entry.handle}`
      case 'LandingPageRecord':
        return `/landing-page/${record.entry.handle}`
      case 'PostRecord':
        return `/blog/${record.entry.handle}`
      case 'SupercarRecord':
        return `/supercars/${record.entry.handle}`
      case 'TrackRecord':
        return `/tracks/${record.entry.handle}`
      default:
        return null
    }
  }

  return (
    <StructuredText
      data={data}
      renderBlock={({ record }) => {
        switch (record.__typename) {
          case 'CoreCtaRecord':
            return <CoreCta data={record} styleType="orange" />
          case 'CoreImageRecord':
            return <CoreImage data={record} />
          case 'CoreVideoRecord':
            return <CoreVideo data={record} />
          default:
            return null
        }
      }}
      renderLinkToRecord={({ record, children, transformedMeta }) => {
        const url = getRecordUrl(record)
        if (!url) {
          return null
        }
        return (
          <a {...transformedMeta} href={url}>
            {children}
          </a>
        )
      }}
      renderInlineRecord={({ record }) => {
        const url = getRecordUrl(record)
        if (!url || record.__typename === 'LandingPageRecord') {
          return null
        }
        return <a href={url}>{record.entry.handle}</a>
      }}
    />
  )
}
