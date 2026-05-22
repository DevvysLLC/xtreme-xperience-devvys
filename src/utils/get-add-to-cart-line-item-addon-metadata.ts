import type { AddonFragment } from '../core/dato/fragments/addon.typegen'
import { CartLineItemMetadataPropertiesTypeSchema } from '../io/schemas'
import type {
  CartLineItemMetadata,
  RocketRezAddLineItemAddon
} from '../io/types'
import { getAddToCartLineItemWriteMetadataKey } from './get-cart-line-item-metadata-key'

type GetAddToCartAddonLineItemMetadataProps = {
  addon: AddonFragment
  lineItem: RocketRezAddLineItemAddon
  date?: string | null
}

export const getAddToCartLineItemAddonMetadata = ({
  addon,
  lineItem,
  date
}: GetAddToCartAddonLineItemMetadataProps): CartLineItemMetadata => {
  const key = getAddToCartLineItemWriteMetadataKey({ lineItem })
  const metadata = {
    key,
    type: CartLineItemMetadataPropertiesTypeSchema.enum.addon,
    title: addon.model?.title ?? '',
    image: addon.model?.thumbnail?.image?.url ?? '',
    properties: {
      date: date ?? null
    }
  }
  return metadata
}
