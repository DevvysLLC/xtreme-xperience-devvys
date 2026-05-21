import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ErrorMessage } from '../../../../components/error-message'
import { generateSeoMetadata } from '../../../../components/global-seo'
import { TemplateTrackDetailPage } from '../../../../components/template-track-detail-page'
import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type Props = {
  params: Promise<{
    handle: string
  }>
}

const getTrackData = cache(async (handle: string) => {
  const sdk = initDatoSdk()
  return await sdk.getTrack({ handle })
})

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { handle } = await params
  try {
    const response = await getTrackData(handle)

    if (!response?.track) {
      return generateSeoMetadata()
    }

    const trackSeo = response.track.config?.seo ?? null
    return generateSeoMetadata(trackSeo)
  } catch (error) {
    logger.error(
      { error, handle },
      'Failed to generate metadata for track detail page'
    )
    return generateSeoMetadata()
  }
}

export default async function TrackDetailPage({ params }: Props) {
  try {
    const { handle } = await params
    const response = await getTrackData(handle)

    if (!response) {
      notFound()
    }

    logger.info(
      {
        response
      },
      'Track detail response:'
    )

    return <TemplateTrackDetailPage data={response} />
  } catch (err) {
    logger.error({ error: err }, 'Track detail request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load track detail'
    return <ErrorMessage message={errorMessage} />
  }
}
