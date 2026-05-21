'use client'

import clsx from 'clsx'
import { type FC, useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './style.module.scss'

const WAVE_CONFIG = {
  primary: { amplitude: 1.2, frequency: 2, speed: 0.7 },
  secondary: { amplitude: 0.4, frequency: 3, speed: 0.5 },
  vertical: { amplitude: 0.2, frequency: 5, speed: 0.15 }
} as const

export type Props = {
  className?: string
}

export const CoreFlagBackground: FC<Props> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const BASE_FLAG_WIDTH = 5
    const BASE_FLAG_HEIGHT = 3
    const FLAG_ASPECT = BASE_FLAG_WIDTH / BASE_FLAG_HEIGHT
    const COVER_MULTIPLIER = 1.2
    const CAMERA_Z = 5

    // Read layout before appendChild to avoid forced reflow (read after write)
    const initialWidth = container.clientWidth
    const initialHeight = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      initialWidth / initialHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    renderer.setSize(initialWidth, initialHeight)
    container.appendChild(renderer.domElement)

    const loader = new THREE.TextureLoader()

    const geometry = new THREE.PlaneGeometry(
      BASE_FLAG_WIDTH,
      BASE_FLAG_HEIGHT,
      50,
      30
    )

    const texture = loader.load('/images/flag.png')
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })

    const flag = new THREE.Mesh(geometry, material)
    scene.add(flag)

    flag.rotation.set(-0.1, 0, 0)
    camera.position.z = CAMERA_Z

    const updateLayout = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width <= 0 || height <= 0) {
        return
      }

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)

      const fovRad = (camera.fov * Math.PI) / 180
      const visibleHeight = 2 * Math.tan(fovRad / 2) * CAMERA_Z
      const visibleWidth = visibleHeight * camera.aspect

      let planeWidth: number
      let planeHeight: number
      if (visibleWidth / visibleHeight > FLAG_ASPECT) {
        planeWidth = visibleWidth * COVER_MULTIPLIER
        planeHeight = planeWidth / FLAG_ASPECT
      } else {
        planeHeight = visibleHeight * COVER_MULTIPLIER
        planeWidth = planeHeight * FLAG_ASPECT
      }

      flag.scale.set(
        planeWidth / BASE_FLAG_WIDTH,
        planeHeight / BASE_FLAG_HEIGHT,
        1
      )
    }

    // Defer first updateLayout to next frame so layout has settled after appendChild
    const rafId = requestAnimationFrame(() => {
      updateLayout()
    })

    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()
      const positions = geometry.attributes.position
      if (!positions) {
        return
      }

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)

        const { primary, secondary, vertical } = WAVE_CONFIG
        const waveX1 =
          primary.amplitude *
          Math.sin(x * primary.frequency + t * primary.speed)
        const waveX2 =
          secondary.amplitude *
          Math.sin(x * secondary.frequency + t * secondary.speed)
        const waveY1 =
          vertical.amplitude *
          Math.sin(y * vertical.frequency + t * vertical.speed)
        const multi = (x + 2.5) / 5

        positions.setZ(i, (waveX1 + waveX2 + waveY1) * multi)
      }

      positions.needsUpdate = true

      animationFrameRef.current = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      updateLayout()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={containerRef} className={clsx(styles.flag, className)} />
}
