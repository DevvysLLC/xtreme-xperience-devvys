import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import type { CoreSVGImageData } from './io'
import style from './style.module.scss'

export type Props = {
  data: CoreSVGImageData
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

export const CoreSVGImage: FC<Props> = ({ data, ref, ...params }) => {
  const { format, url, width, height, alt, title } = data
  const { className } = params
  const t = useTranslations('core_svg_upload')
  const ariaLabel = alt ?? title ?? t('no_aria_label')

  if (format && format !== 'svg') {
    throw new Error(
      'Image format must be svg [b536f775d826411dbf4c333db4223a9f]'
    )
  }

  if (width === null || height === null) {
    throw new Error(
      'Image dimensions must be defined [b536f273d826411dbf4c333db4223a9f]'
    )
  }

  if (width <= 0 || height <= 0) {
    throw new Error(
      'Image dimensions should be positive [b536f773d826411dbf4c333db45e3a9f]'
    )
  }

  return (
    <div ref={ref} className={clsx(style.SvgImage, className)}>
      <div
        className={style.SvgImage__placeholder}
        style={{
          backgroundImage: `url(${JSON.stringify(url)})`,
          aspectRatio: `${width}/${height}`
        }}
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  )
}
