import type { InsuranceFragment } from '../core/dato/fragments/insurance.typegen'
import { CartLineItemMetadataPropertiesTypeSchema } from '../io/schemas'
import type {
  CartLineItemMetadata,
  RocketRezAddLineItemAddon
} from '../io/types'
import { getAddToCartLineItemWriteMetadataKey } from './get-cart-line-item-metadata-key'

type GetAddToCartInsuranceLineItemMetadataProps = {
  insurance: InsuranceFragment
  lineItem: RocketRezAddLineItemAddon
  totalSessions?: number
}

export const getAddToCartLineItemInsuranceMetadata = ({
  insurance,
  lineItem,
  totalSessions
}: GetAddToCartInsuranceLineItemMetadataProps): CartLineItemMetadata => {
  const key = getAddToCartLineItemWriteMetadataKey({ lineItem })
  const sessionsLabel = totalSessions ? `${totalSessions} sessions` : null
  const subtitle = [insurance.model?.coverage ?? null, sessionsLabel ?? null]
    .filter(Boolean)
    .join(' - ')
  const metadata = {
    key,
    type: CartLineItemMetadataPropertiesTypeSchema.enum.insurance,
    title: `Coverage **${insurance.model?.title ?? ''}**`,
    subtitle: subtitle ?? '',
    image: insurance.model?.thumbnail?.image?.url ?? ''
  }
  return metadata
}
