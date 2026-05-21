import type { SupercarModelFragment } from '../../../core/dato/fragments/supercar-model.typegen'

export type ContentData = {
  description: SupercarModelFragment['description']
  specBadges: SupercarModelFragment['specBadges']
  displayPrice: SupercarModelFragment['displayPrice']
  rideAlongPrice: SupercarModelFragment['rideAlongPrice']
}

export type MediaData = {
  thumbnail: SupercarModelFragment['thumbnail']
  modelViewer3d: SupercarModelFragment['modelViewer3d']
}

export type LayoutTranslations = {
  ride_along_prefix: string
  ride_along_suffix: string
  supercar_xperiences_prefix: string
  supercar_xperiences_suffix: string
}

export type SpecificationData = {
  topSpeed: string | null
  horsepower: string | null
  maxParticipantHeight: string | null
  zeroToSixty: string | null
  value: string | null
}

export type SpecificationTranslations = {
  top_speed: string
  horsepower: string
  max_participant_height: string
  zero_to_sixty: string
  value: string
  view_specs: string
}

export type DrawerTranslations = {
  title: string
  engine: string
  top_speed: string
  horsepower: string
  max_participant_height: string
  torque: string
  zero_to_sixty: string
  weight: string
  origin: string
  transmission: string
  vehicle_layout: string
  value: string
  starting_price: string
  book_now: string
  give_as_gift: string
}
