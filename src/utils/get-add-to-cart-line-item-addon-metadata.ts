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
}

export const getAddToCartLineItemAddonMetadata = ({
  addon,
  lineItem
}: GetAddToCartAddonLineItemMetadataProps): CartLineItemMetadata => {
  const key = getAddToCartLineItemWriteMetadataKey({ lineItem })
  const metadata = {
    key,
    type: CartLineItemMetadataPropertiesTypeSchema.enum.addon,
    title: addon.model?.title ?? '',
    image: addon.model?.thumbnail?.image?.url ?? ''
  }
  return metadata
}
