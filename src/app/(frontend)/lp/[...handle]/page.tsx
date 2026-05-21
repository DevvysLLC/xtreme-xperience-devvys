import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { generateSeoMetadata } from '../../../../components/global-seo'
import { TemplateLandingPage } from '../../../../components/template-landing-page'
import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type RouteParams = {
  handle: string[]
}

type Props = {
  params: Promise<RouteParams>
}

const getLandingPageData = cache(async (params: RouteParams) => {
  const sdk = initDatoSdk()
  const slug = params.handle?.[0]

  if (!slug) {
    logger.warn({ params }, 'Missing slug in landing-page route params')
    return null
  }

  const response = await sdk.getLandingPage({ handle: slug })

  if (!response?.allLandingPages?.length) {
    return null
  }

  return response
})

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const awaitedParams = await params
  try {
    const response = await getLandingPageData(awaitedParams)

    if (!response) {
      return generateSeoMetadata()
    }

    const landingPageSeo = response.allLandingPages[0]?.config?.seo ?? null
    return generateSeoMetadata(landingPageSeo)
  } catch (error) {
    logger.error(
      { error, params: awaitedParams },
      'Failed to generate metadata for landing page'
    )
    return generateSeoMetadata()
  }
}

export default async function LandingPage({ params }: Props) {
  const awaitedParams = await params
  try {
    const response = await getLandingPageData(awaitedParams)

    if (!response) {
      notFound()
    }

    logger.info({ response }, 'Landing page response')
    return <TemplateLandingPage data={response} />
  } catch (error) {
    logger.error(
      { error, params: awaitedParams },
      'Landing page request failed'
    )
    notFound()
  }
}
