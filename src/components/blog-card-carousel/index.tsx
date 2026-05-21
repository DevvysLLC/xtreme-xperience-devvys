import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { PostFragment } from '../../core/dato/fragments/post.typegen'
import { BlogCard } from '../blog-card'
import { Carousel } from './components/carousel'
import styles from './style.module.scss'

export type BlogCardCarouselProps = {
  posts?: PostFragment[]
}

export const BlogCardCarousel: FC<BlogCardCarouselProps> = async ({
  posts
}) => {
  const t = await getTranslations('blog_card_carousel')

  const blogCards =
    posts && posts.length > 0
      ? posts.map((post) => <BlogCard key={post.id} post={post} />)
      : null

  return (
    <section className={styles.section}>
      <div className={styles.title}>{t('title')}</div>

      {blogCards && blogCards.length > 0 && <Carousel blogCards={blogCards} />}
    </section>
  )
}
