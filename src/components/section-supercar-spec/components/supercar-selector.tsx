'use client'
import { type FC, useMemo, useState } from 'react'
import type { SectionConfigFragment } from '../../../core/dato/fragments/section-config.typegen'
import type { SupercarModelFragment } from '../../../core/dato/fragments/supercar-model.typegen'
import styles from '../style.module.scss'
import { SupercarSpecLayout } from './layout'
import type { LayoutTranslations } from './types'

type Props = {
  supercars: NonNullable<SupercarModelFragment['supercars']>
  supercarModel: SupercarModelFragment
  sectionId: string
  config: SectionConfigFragment | null
  isFirstSection?: boolean
  translations: LayoutTranslations
}

export const SupercarSelector: FC<Props> = ({
  supercars,
  supercarModel,
  sectionId,
  config,
  isFirstSection,
  translations
}) => {
  const [selectedSupercarId, setSelectedSupercarId] = useState<string>(
    supercars[0]?.id ?? ''
  )

  const selectedSupercar = useMemo(
    () => supercars.find((supercar) => supercar.id === selectedSupercarId),
    [supercars, selectedSupercarId]
  )

  // Content comes from supercarModel (static)
  const { description, specBadges, displayPrice, rideAlongPrice } =
    supercarModel

  // Media come from selected supercar's model
  // Use selected supercar's model, or fallback to supercarModel
  const selectedModel = selectedSupercar?.model ?? supercarModel

  const { thumbnail, modelViewer3d } = selectedModel

  // Memoize content object to prevent unnecessary re-renders
  const contentData = useMemo(
    () => ({
      description,
      specBadges,
      displayPrice,
      rideAlongPrice
    }),
    [description, specBadges, displayPrice, rideAlongPrice]
  )

  // Memoize media object to prevent unnecessary re-renders
  const mediaData = useMemo(
    () => ({
      thumbnail,
      modelViewer3d
    }),
    [thumbnail, modelViewer3d]
  )

  // Memoize ReactNode props to prevent unnecessary re-renders of SupercarSpecLayout
  // These elements are recreated on every render, so memoizing them ensures
  // SupercarSpecLayout (which is memoized) only re-renders when data actually changes
  const mediaSlot = useMemo(
    () =>
      supercars.length > 0 ? (
        <div className={styles.select}>
          <select
            name="supercar"
            className={styles.select__select}
            value={selectedSupercarId}
            onChange={(e) => {
              setSelectedSupercarId(e.target.value)
            }}
          >
            {supercars.map((supercar) => (
              <option key={supercar.id} value={supercar.id}>
                {supercar.model?.title ?? ''}
              </option>
            ))}
          </select>
        </div>
      ) : undefined,
    [supercars, selectedSupercarId]
  )

  return (
    <SupercarSpecLayout
      sectionId={sectionId}
      config={config}
      isFirstSection={isFirstSection}
      content={contentData}
      media={mediaData}
      translations={translations}
      mediaSlot={mediaSlot}
    />
  )
}
