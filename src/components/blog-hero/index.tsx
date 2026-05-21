import type { FC } from 'react'
import type { PostFragment } from '../../core/dato/fragments/post.typegen'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getRecordLink } from '../../utils/get-record-link'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import styles from './style.module.scss'

export type BlogHeroProps = {
  post: PostFragment
  context: 'listing' | 'detail'
}

export const BlogHero: FC<BlogHeroProps> = ({ post, context }) => {
  const { model } = post
  const { title, categories, link, featuredMedia } = model || {}
  const recordLink = post?.config ? getRecordLink(post.config, 'post') : null
  const renderLink = context === 'listing' && link && recordLink

  return (
    <section className={styles.section} id={model?.id ?? 'blog-hero'}>
      {renderLink && (
        <CoreCta
          href={recordLink}
          className={styles.link}
          layoutType="transparent"
          text={title}
          tabIndex={-1}
        />
      )}

      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.fade}></div>
          {isImage(featuredMedia) && (
            <CoreImage data={featuredMedia} className={styles.coreMedia} />
          )}
          {isVideo(featuredMedia) && (
            <CoreVideo data={featuredMedia} className={styles.coreMedia} />
          )}
        </div>
        <div className={styles.content}>
          {categories && categories?.length > 0 && (
            <span className={styles.eyebrow}>
              {categories[0]?.model?.title}
            </span>
          )}
          {title && <h2 className={styles.title}>{title}</h2>}
          {renderLink && (
            <CoreCta
              data={link}
              href={recordLink}
              className={styles.cta}
              layoutType="button"
              sizeType="small"
              styleType="orange"
              type="button"
            />
          )}
        </div>
      </div>
    </section>
  )
}
