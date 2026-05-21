import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ErrorMessage } from '../../../../components/error-message'
import { generateSeoMetadata } from '../../../../components/global-seo'
import { TemplateBlogDetailPage } from '../../../../components/template-blog-detail-page'
import { initDatoSdk } from '../../../../core/dato/sdk'
import { logger } from '../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type Props = {
  params: Promise<{
    handle: string
  }>
}

const getBlogPostData = cache(async (handle: string) => {
  const sdk = initDatoSdk()
  return await sdk.getPost({ handle })
})

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { handle } = await params
  try {
    const response = await getBlogPostData(handle)

    if (!response?.post) {
      return generateSeoMetadata()
    }

    const postSeo = response.post.config?.seo ?? null
    return generateSeoMetadata(postSeo)
  } catch (error) {
    logger.error(
      { error, handle },
      'Failed to generate metadata for blog detail page'
    )
    return generateSeoMetadata()
  }
}

export default async function BlogDetailPage({ params }: Props) {
  try {
    const { handle } = await params
    const response = await getBlogPostData(handle)

    if (!response) {
      notFound()
    }

    logger.info(
      {
        response
      },
      'Blog detail response:'
    )

    return <TemplateBlogDetailPage data={response} />
  } catch (err) {
    logger.error({ error: err }, 'Blog detail request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load blog detail'
    return <ErrorMessage message={errorMessage} />
  }
}
