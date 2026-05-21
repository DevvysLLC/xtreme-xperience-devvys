import type { FC } from 'react'
import { SectionRenderer } from '../section-renderer'
import { StructuredData } from '../structured-data'
import type { GetHomepageQuery } from './get-homepage.typegen'

export type TemplateHomepageProps = {
  data: GetHomepageQuery
}

export const TemplateHomepage: FC<TemplateHomepageProps> = ({ data }) => {
  const { homepage } = data
  const { sections } = homepage?.content ?? { sections: [] }
  const config = homepage?.config ?? null
  const seo = config?.seo ?? null

  return (
    <>
      <StructuredData
        pathname="/"
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
        breadcrumbs={[{ name: 'Home' }]}
        dates={{
          datePublished: homepage?._createdAt,
          dateModified: homepage?._updatedAt
        }}
      />
      <SectionRenderer sections={sections} />
    </>
  )
}
