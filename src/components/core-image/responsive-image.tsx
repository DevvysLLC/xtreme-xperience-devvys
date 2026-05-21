import { throttle } from '@github/mini-throttle'
import clsx from 'clsx'
import type { FC } from 'react'
import { useMemo } from 'react'
import useDimensions from 'react-cool-dimensions'
import { Image as DatoImage } from 'react-datocms'
import type { ImgixParams } from '../../core/dato/base-types'
import { round } from '../../core/math/round'
import { extendUrlSearchParams } from '../../core/url/extend-search-params'
import {
  type CustomizationProps,
  type DatoImageOptions,
  flattenImageData,
  type ImageData
} from './io'
import style from './style.module.scss'

type Props = {
  data: ImageData
} & DatoImageOptions &
  CustomizationProps

export const ResponsiveImage: FC<Props> = ({
  data: _data,
  transformations = { type: 'imgix', params: {} },
  responsiveWrapperClassName,
  ...props
}) => {
  const data = flattenImageData(_data)

  const {
    observe,
    width: _width,
    height: _height
  } = useDimensions({
    onResize: useMemo(
      () =>
        throttle(() => {
          // Triggered once per every 500 milliseconds
        }, 500),
      []
    )
  })

  if (data.width === null || data.height === null) {
    throw new Error(
      'Image dimensions must be defined [a536f773d826411dbf4c333db4223a9f]'
    )
  }

  const aspectRatio = round(data.width / data.height, 5)
  // Use measured width only so we never request the full data.width (e.g. 1920)
  // and then the display size (e.g. 960) — we load only the display size.
  const hasMeasuredWidth = _width != null && _width > 0
  const width: number = hasMeasuredWidth
    ? round(_width, -1, 'ceil')
    : data.width
  const height: number | null =
    props.layout === 'fill' && _height != null && _height > 0
      ? round(_height, -1, 'ceil')
      : null

  const srcSet = [data.src]
    .flatMap((src) => {
      return [1, 1.5].map((dpr) => {
        const mergedParams = {
          ...transformations.params,
          dpr,
          w: width,
          q: transformations.params.q ?? 75
        } satisfies ImgixParams

        const url = extendUrlSearchParams(src, mergedParams)

        return `${url} ${dpr}x`
      })
    })
    .join(', ')

  // 1x URL for src fallback so we never pass the API default (large) URL
  const src1x = srcSet.split(', ')[0]?.replace(/ 1x$/, '') ?? data.src

  // Don't render the image until we have measured width; otherwise we'd build
  // srcSet with data.width and trigger a large image load before the correct one.
  // Show Dato base64 blur placeholder when available.
  // Exception: priority images (hero LCP) must render immediately so the <img>
  // with fetchpriority="high" is in the SSR HTML. The initial srcSet uses
  // data.width which may be larger than needed, but the ResizeObserver updates
  // it to the correct size after hydration (typically within one frame).
  if (!hasMeasuredWidth && !props.priority) {
    return (
      <div
        className={clsx(style.wrapper, responsiveWrapperClassName, {
          [`${style.wrapper__fill}`]: props.layout === 'fill'
        })}
        ref={observe}
        style={{
          aspectRatio: String(aspectRatio)
        }}
      >
        {data.base64 && (
          <img aria-hidden src={data.base64} className={style.wrapper__blur} />
        )}
      </div>
    )
  }

  return (
    <div
      className={clsx(style.wrapper, responsiveWrapperClassName, {
        [`${style.wrapper__fill}`]: props.layout === 'fill'
      })}
      ref={observe}
    >
      <DatoImage
        {...props}
        data={{
          ...data,
          src: src1x,
          aspectRatio,
          width,
          height,
          srcSet,
          // We override implicit sizes because we use a dynamic srcSet with dpr
          sizes: null
        }}
      />
    </div>
  )
}
