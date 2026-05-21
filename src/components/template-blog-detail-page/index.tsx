import { notFound } from 'next/navigation'
import { BlogArticle } from '../blog-article'
import { BlogCardCarousel } from '../blog-card-carousel'
import { BlogHero } from '../blog-hero'
import { StructuredData } from '../structured-data'
import type { GetPostQuery } from './get-post.typegen'

export type TemplateBlogDetailPageProps = {
  data: GetPostQuery
}

export const TemplateBlogDetailPage = async ({
  data
}: TemplateBlogDetailPageProps) => {
  const { post } = data
  if (!post) {
    return notFound()
  }
  const { model, config } = post
  const relatedPosts = model?.relatedPosts ?? []
  const seo = config?.seo ?? null
  const handle = config?.handle ?? ''
  const postTitle = model?.title ?? 'Blog Post'

  return (
    <>
      <StructuredData
        pathname={`/blog/${handle}`}
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
          { name: 'Blog', url: '/blog' },
          { name: postTitle }
        ]}
        dates={{
          datePublished: post?._createdAt,
          dateModified: post?._updatedAt
        }}
      />
      {model && <BlogHero post={post} context="detail" />}
      {model && <BlogArticle post={post} />}
      {model && relatedPosts.length > 0 && (
        <BlogCardCarousel posts={relatedPosts} />
      )}
    </>
  )
}
