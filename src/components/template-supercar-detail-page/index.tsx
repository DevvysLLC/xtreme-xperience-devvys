import { notFound } from 'next/navigation'
import { ANALYTICS_BRAND_NAME } from '../../config/analytics'
import { SectionRenderer } from '../section-renderer'
import { StructuredData } from '../structured-data'
import { TrackViewItem } from './components/track-view-item'
import type { GetSupercarQuery } from './get-supercar.typegen'

export type TemplateSupercarDetailPageProps = {
  data: GetSupercarQuery
}

export const TemplateSupercarDetailPage = async ({
  data
}: TemplateSupercarDetailPageProps) => {
  const { supercar } = data
  if (!supercar) {
    return notFound()
  }
  const { sections } = supercar.content ?? { sections: [] }
  const model = supercar.model ?? null
  const config = supercar.config ?? null
  const seo = config?.seo ?? null
  const handle = config?.handle ?? ''
  const supercarTitle = config?.title ?? 'Supercar'

  return (
    <>
      <TrackViewItem
        data={{
          item_id: supercar.id,
          item_name: supercarTitle,
          item_brand: ANALYTICS_BRAND_NAME,
          item_category: 'supercar',
          item_variant: 'supercar',
          page_path: `/supercars/${handle}`
        }}
      />
      <StructuredData
        pathname={`/supercars/${handle}`}
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
          { name: 'Supercars', url: '/supercars' },
          { name: supercarTitle }
        ]}
        dates={{
          datePublished: supercar._createdAt,
          dateModified: supercar._updatedAt
        }}
      />
      <SectionRenderer sections={sections} model={model} />
    </>
  )
}
