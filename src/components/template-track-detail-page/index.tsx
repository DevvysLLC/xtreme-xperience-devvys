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

  // Extract campaign fields with fallback to support safe local build before CMS fields are added.
  // const campaignConfig = config
  //   ? {
  //       enableCampaignStickyBar: (config as any).enableCampaignStickyBar ?? false,
  //       campaignStickyBarHeading: (config as any).campaignStickyBarHeading ?? null,
  //       campaignStickyBarTimerEnd: (config as any).campaignStickyBarTimerEnd ?? null,
  //       campaignStickyBarCtaTitle: (config as any).campaignStickyBarCtaTitle ?? null,
  //       campaignStickyBarCtaLink: (config as any).campaignStickyBarCtaLink ?? null
  //     }
  //   : null

  // Active mock campaignConfig for local testing/preview (uncomment the above block to connect to DatoCMS live later)
  const campaignConfig = config
    ? {
        enableCampaignStickyBar: true,
        campaignStickyBarHeading: "Portland Special - Save 20% on bookings today!",
        campaignStickyBarTimerEnd: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours timer
        campaignStickyBarCtaTitle: "Book Portland Now",
        campaignStickyBarCtaLink: "/booking?track=portland"
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
