import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ErrorMessage } from '../../../../components/error-message'
import { generateSeoMetadata } from '../../../../components/global-seo'
import { TemplateSupercarDetailPage } from '../../../../components/template-supercar-detail-page'
import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type Props = {
  params: Promise<{
    handle: string
  }>
}

const getSupercarData = cache(async (handle: string) => {
  const sdk = initDatoSdk()
  return await sdk.getSupercar({ handle })
})

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { handle } = await params
  try {
    const response = await getSupercarData(handle)

    if (!response?.supercar) {
      return generateSeoMetadata()
    }

    const supercarSeo = response.supercar.config?.seo ?? null
    return generateSeoMetadata(supercarSeo)
  } catch (error) {
    logger.error(
      { error, handle },
      'Failed to generate metadata for supercar detail page'
    )
    return generateSeoMetadata()
  }
}

export default async function SupercarDetailPage({ params }: Props) {
  try {
    const { handle } = await params
    const response = await getSupercarData(handle)

    if (!response) {
      notFound()
    }

    logger.info(
      {
        response
      },
      'Supercar detail response:'
    )

    return <TemplateSupercarDetailPage data={response} />
  } catch (err) {
    logger.error({ error: err }, 'Supercar detail request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load supercar detail'
    return <ErrorMessage message={errorMessage} />
  }
}
