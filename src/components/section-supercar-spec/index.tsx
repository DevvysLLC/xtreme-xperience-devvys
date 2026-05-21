import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import type { SupercarModelFragment } from '../../core/dato/fragments/supercar-model.typegen'
import { getSectionId } from '../../core/string/get-section-id'
import { SupercarFullSpecDrawer } from './components/drawer'
import { SupercarSpecLayout } from './components/layout'
import { SupercarSpecifications } from './components/specifications'
import { SupercarSelector } from './components/supercar-selector'
import type { SectionSupercarSpecFragment } from './section-supercar-spec.typegen'

type Props = {
  data: SectionSupercarSpecFragment
  model: SupercarModelFragment | null
  isFirstSection?: boolean
}

export const SectionSupercarSpec: FC<Props> = async ({
  data,
  model: supercarModel,
  isFirstSection
}) => {
  const { id, config } = data
  const t = await getTranslations('section_supercar_spec')
  const tDrawer = await getTranslations('section_supercar_spec.drawer')

  if (!supercarModel) {
    return null
  }

  const { supercars } = supercarModel

  // If we have supercars, use the selector component
  if (supercars && supercars.length > 0) {
    return (
      <SupercarSelector
        supercars={supercars}
        supercarModel={supercarModel}
        sectionId={getSectionId(config?.customId, id) ?? ''}
        config={config}
        isFirstSection={isFirstSection}
        translations={{
          ride_along_prefix: t('ride_along_prefix'),
          ride_along_suffix: t('ride_along_suffix'),
          supercar_xperiences_prefix: t('supercar_xperiences_prefix'),
          supercar_xperiences_suffix: t('supercar_xperiences_suffix')
        }}
      />
    )
  }

  // Otherwise, render directly from supercarModel
  const {
    thumbnail,
    description,
    specBadges,
    displayPrice,
    rideAlongPrice,
    topSpeed,
    horsepower,
    maxParticipantHeight,
    zeroToSixty,
    value,
    modelViewer3d
  } = supercarModel

  return (
    <SupercarSpecLayout
      sectionId={getSectionId(config?.customId, id) ?? ''}
      config={config}
      isFirstSection={isFirstSection}
      content={{
        description,
        specBadges,
        displayPrice,
        rideAlongPrice
      }}
      media={{
        thumbnail,
        modelViewer3d
      }}
      translations={{
        ride_along_prefix: t('ride_along_prefix'),
        ride_along_suffix: t('ride_along_suffix'),
        supercar_xperiences_prefix: t('supercar_xperiences_prefix'),
        supercar_xperiences_suffix: t('supercar_xperiences_suffix')
      }}
      specifications={
        <SupercarSpecifications
          data={{
            topSpeed,
            horsepower,
            maxParticipantHeight,
            zeroToSixty,
            value
          }}
          translations={{
            top_speed: t('top_speed'),
            horsepower: t('horsepower'),
            max_participant_height: t('max_participant_height'),
            zero_to_sixty: t('zero_to_sixty'),
            value: t('value'),
            view_specs: t('view_specs')
          }}
          showButton={true}
        />
      }
      drawer={
        supercarModel && (
          <SupercarFullSpecDrawer
            data={supercarModel}
            translations={{
              title: tDrawer('title'),
              engine: tDrawer('engine'),
              top_speed: tDrawer('top_speed'),
              horsepower: tDrawer('horsepower'),
              max_participant_height: tDrawer('max_participant_height'),
              torque: tDrawer('torque'),
              zero_to_sixty: tDrawer('zero_to_sixty'),
              weight: tDrawer('weight'),
              origin: tDrawer('origin'),
              transmission: tDrawer('transmission'),
              vehicle_layout: tDrawer('vehicle_layout'),
              value: tDrawer('value'),
              starting_price: tDrawer('starting_price'),
              book_now: tDrawer('book_now'),
              give_as_gift: tDrawer('give_as_gift')
            }}
          />
        )
      }
    />
  )
}
