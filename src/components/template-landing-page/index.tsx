import type { FC } from 'react'
import { SectionRenderer } from '../section-renderer'
import { StructuredData } from '../structured-data'
import type { GetLandingPageQuery } from './get-landing-page.typegen'

export type TemplateLandingPageProps = {
  data: GetLandingPageQuery
}

export const TemplateLandingPage: FC<TemplateLandingPageProps> = ({ data }) => {
  const { allLandingPages } = data
  const firstLandingPage = allLandingPages[0] ?? null
  const { sections } = firstLandingPage?.content ?? { sections: [] }
  const config = firstLandingPage?.config ?? null
  const seo = config?.seo ?? null
  const handle = config?.handle ?? ''
  const pageTitle = seo?.title ?? 'Landing Page'

  return (
    <>
      <StructuredData
        pathname={`/landing-page/${handle}`}
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
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: pageTitle }]}
        dates={{
          datePublished: firstLandingPage?._createdAt,
          dateModified: firstLandingPage?._updatedAt
        }}
      />
      <SectionRenderer sections={sections} />
    </>
  )
}
