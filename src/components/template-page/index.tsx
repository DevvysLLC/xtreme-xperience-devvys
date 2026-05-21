import type { FC } from 'react'
import { SectionRenderer } from '../section-renderer'
import { StructuredData } from '../structured-data'
import type { GetPageQuery } from './get-page.typegen'

export type TemplatePageProps = {
  data: GetPageQuery
}

export const TemplatePage: FC<TemplatePageProps> = ({ data }) => {
  const { allPages } = data
  const firstPage = allPages[0] ?? null
  const { sections } = firstPage?.content ?? { sections: [] }
  const config = firstPage?.config ?? null
  const seo = config?.seo ?? null
  const handle = config?.handle ?? ''
  const pageTitle = seo?.title ?? 'Page'

  return (
    <>
      <StructuredData
        pathname={`/${handle}`}
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
          datePublished: firstPage?._createdAt,
          dateModified: firstPage?._updatedAt
        }}
      />
      <SectionRenderer sections={sections} />
    </>
  )
}
