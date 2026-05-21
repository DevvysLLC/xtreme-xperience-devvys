'use client'

import dynamic from 'next/dynamic'
import type { CSSProperties, FC } from 'react'

const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then(
      (module) => module.DotLottieReact
    ),
  { ssr: false }
)

type Props = {
  /**
   * Path to the .lottie or .json file (relative to public folder)
   * Example: "/animation/my-animation.lottie"
   */
  src: string
  /**
   * Whether the animation should loop
   * @default true
   */
  loop?: boolean
  /**
   * Whether the animation should autoplay
   * @default true
   */
  autoplay?: boolean
  /**
   * Animation speed (1 = normal, 2 = double speed, 0.5 = half speed)
   * @default 1
   */
  speed?: number
  /**
   * Custom styles for the container
   */
  style?: CSSProperties
  /**
   * Custom class name for the container
   */
  className?: string
}

export const CoreLottie: FC<Props> = ({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  style,
  className
}) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      speed={speed}
      style={style}
      className={className}
    />
  )
}
