import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { generateSeoMetadata } from '../../../components/global-seo'
import { TemplatePage } from '../../../components/template-page'
import { initDatoSdk } from '../../../core/dato/sdk'
import { logger } from '../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type RouteParams = {
  handle: string[]
}

type Props = {
  params: Promise<RouteParams>
}

const getPageData = cache(async (params: RouteParams) => {
  const sdk = initDatoSdk()
  const slug = params.handle?.[0]

  if (!slug) {
    logger.warn({ params }, 'Missing slug in catch-all route params')
    return null
  }

  const response = await sdk.getPage({ handle: slug })

  if (!response?.allPages?.length) {
    return null
  }

  return response
})

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const awaitedParams = await params
  try {
    const response = await getPageData(awaitedParams)

    if (!response) {
      return generateSeoMetadata()
    }

    const pageSeo = response.allPages[0]?.config?.seo ?? null
    return generateSeoMetadata(pageSeo)
  } catch (error) {
    logger.error(
      { error, params: awaitedParams },
      'Failed to generate metadata for page'
    )
    return generateSeoMetadata()
  }
}

export default async function CatchAllPage({ params }: Props) {
  const awaitedParams = await params
  try {
    const response = await getPageData(awaitedParams)

    if (!response) {
      notFound()
    }

    logger.info({ response }, 'Page response')
    return <TemplatePage data={response} />
  } catch (error) {
    logger.error({ error, params: awaitedParams }, 'Page request failed')
    notFound()
  }
}
