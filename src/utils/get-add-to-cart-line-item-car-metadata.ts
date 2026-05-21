import { BOOKING_LAPS_PER_SESSION } from '../config/settings'
import type { SupercarBaseFragment } from '../core/dato/fragments/supercar-base.typegen'
import { CartLineItemMetadataPropertiesTypeSchema } from '../io/schemas'
import type {
  BookingUserSelectionState,
  CartLineItemMetadata,
  RocketRezAddLineItemCar
} from '../io/types'
import { getAddToCartLineItemWriteMetadataKey } from './get-cart-line-item-metadata-key'

type GetAddToCartCarLineItemMetadataProps = {
  supercar: SupercarBaseFragment
  lineItem: RocketRezAddLineItemCar
  userSelectionState: BookingUserSelectionState
  bookingSupercar?: {
    cartLineItemLabel?: string | null
    isMulticar?: boolean | null
    isRideAlong?: boolean | null
    multicarCount?: number | null
  }
  lapsPerSession?: number | null
}

export const getAddToCartLineItemCarMetadata = ({
  supercar,
  lineItem,
  userSelectionState,
  bookingSupercar,
  lapsPerSession
}: GetAddToCartCarLineItemMetadataProps): CartLineItemMetadata => {
  const key = getAddToCartLineItemWriteMetadataKey({ lineItem })
  const isoDate = userSelectionState.date ?? ''
  const resolvedLapsPerSession =
    typeof lapsPerSession === 'number' && lapsPerSession > 0
      ? lapsPerSession
      : BOOKING_LAPS_PER_SESSION
  const make = supercar.model?.make
  const model = supercar.model?.model
  const title =
    make && model
      ? `${make} <strong>${model}</strong>`
      : (supercar.model?.title ?? '')
  const metadata = {
    key,
    type: CartLineItemMetadataPropertiesTypeSchema.enum.car,
    title,
    image: supercar.model?.thumbnail?.image?.url ?? '',
    subtitle: userSelectionState.activeGroupTitle ?? '',
    label: bookingSupercar?.cartLineItemLabel ?? null,
    isMulticar: bookingSupercar?.isMulticar ?? null,
    isRideAlong: bookingSupercar?.isRideAlong ?? null,
    multicarCount: bookingSupercar?.multicarCount ?? null,
    properties: {
      date: isoDate,
      lapsPerSession: resolvedLapsPerSession,
      laps: (lineItem.quantity ?? 0) * resolvedLapsPerSession
    }
  }
  return metadata
}
