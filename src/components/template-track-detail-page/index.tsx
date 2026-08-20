import { notFound } from 'next/navigation'
import { SectionRenderer } from '../section-renderer'
import { StructuredData } from '../structured-data'
import { CampaignStickyBarInitializer } from '../campaign-sticky-bar-initializer'
import type { GetTrackQuery } from './get-track.typegen'

export type TemplateTrackDetailPageProps = {
  data: GetTrackQuery
}

export const TemplateTrackDetailPage = async ({
  data
}: TemplateTrackDetailPageProps) => {
  const { track } = data
  if (!track) {
    return notFound()
  }
  const { sections } = track.content ?? { sections: [] }
  const model = track.model ?? null
  const config = track.config ?? null
  const seo = config?.seo ?? null
  const handle = config?.handle ?? ''
  const trackTitle = config?.title ?? 'Track'

  // Extract campaign fields from DatoCMS
  const campaignConfig = config
    ? {
        enableCampaignStickyBar: config.enableCampaignStickyBar ?? false,
        campaignStickyBarHeading: config.campaignStickyBarHeading ?? null,
        campaignStickyBarTimerEnd: config.campaignStickyBarTimerEnd ?? null,
        campaignStickyBarCtaTitle: config.campaignStickyBarCtaTitle ?? null,
        campaignStickyBarCtaLink: config.campaignStickyBarCtaLink ?? null
      }
    : null


  return (
    <>
      <CampaignStickyBarInitializer config={campaignConfig} />
      <StructuredData
        pathname={`/tracks/${handle}`}
        seo={{
          title: seo?.title,
          description: seo?.description,
          image: seo?.image
            ? {
                url: seo.image.url,
                alt: seo.image.alt,
                width: seo.image.width,
                height: seo.image.height
              }
            : null
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tracks', url: '/tracks' },
          { name: trackTitle }
        ]}
        dates={{
          datePublished: track._createdAt,
          dateModified: track._updatedAt
        }}
      />
      <SectionRenderer sections={sections} model={model} record={track} />
    </>
  )
}
