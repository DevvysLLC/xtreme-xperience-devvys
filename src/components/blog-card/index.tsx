import type { FC } from 'react'
import type { PostFragment } from '../../core/dato/fragments/post.typegen'
import { isImage, isVideo } from '../../core/typescript/guards'
import { getRecordLink } from '../../utils/get-record-link'
import { CoreCta } from '../core-cta'
import { CoreImage } from '../core-image'
import { CoreVideo } from '../core-video'
import style from './style.module.scss'

export type BlogCardProps = {
  post: PostFragment
}

export const BlogCard: FC<BlogCardProps> = ({ post }) => {
  const { model } = post
  const { title, link, featuredMedia, categories } = model || {}
  const recordLink = getRecordLink(post.config, 'post')

  return (
    <div className={style.card}>
      {link && recordLink && (
        <CoreCta
          href={recordLink}
          className={style.link}
          layoutType="transparent"
          text={link.title}
          tabIndex={-1}
        />
      )}
      {featuredMedia && (
        <div className={style.media}>
          {isImage(featuredMedia) && (
            <CoreImage data={featuredMedia} layout="fill" objectFit="cover" />
          )}
          {isVideo(featuredMedia) && (
            <CoreVideo data={featuredMedia} layout="fill" />
          )}
        </div>
      )}
      {categories && categories?.length > 0 && (
        <ul className={style.categoriesList}>
          {categories.map((category, index) => (
            <li className={style.category} key={index}>
              {category?.model?.title}
            </li>
          ))}
        </ul>
      )}
      {title && <h2 className={style.title}>{title}</h2>}
      {link && recordLink && (
        <div className={style.actions}>
          <CoreCta
            href={recordLink}
            className={style.cta}
            layoutType="button"
            sizeType="small"
            styleType="black"
            type="button"
            text={link.title}
          />
        </div>
      )}
    </div>
  )
}
