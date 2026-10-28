import { type Client } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Updating "Booking - Discount Rule" (`booking_discount_rule`) targeting & badge options')
  const itemTypes = await client.itemTypes.list()
  const discountRuleModel = itemTypes.find((it) => it.api_key === 'booking_discount_rule')
  const promotionModel = itemTypes.find((it) => it.api_key === 'promotion')

  if (discountRuleModel) {
    const fields = await client.fields.list(discountRuleModel.id)
    const targetTypeField = fields.find((f) => f.api_key === 'target_type')

    if (targetTypeField) {
      console.log('Updating target_type field with packages, addons, and gift_cards options')
      await client.fields.update(targetTypeField.id, {
        validators: {
          enum: {
            values: ['all', 'supercars', 'ride_along', 'packages', 'addons', 'gift_cards']
          }
        },
        hint: 'Apply to all products, specific supercars, ride-alongs, packages, addons, or gift cards',
        appearance: {
          addons: [],
          editor: 'string_select',
          parameters: {
            options: [
              { hint: 'Applies across all products', label: 'All Products', value: 'all' },
              { hint: 'Applies to selected Supercars below', label: 'Supercars Only', value: 'supercars' },
              { hint: 'Applies to Ride-Along experiences only', label: 'Ride-Along Only', value: 'ride_along' },
              { hint: 'Applies to Multi-car Packages (e.g. Full Fleet, Apex, Podium)', label: 'Packages Only', value: 'packages' },
              { hint: 'Applies to Add-ons & Gift Packages (e.g. Full Throttle)', label: 'Add-ons & Media Packages', value: 'addons' },
              { hint: 'Applies to Gift Cards', label: 'Gift Cards Only', value: 'gift_cards' }
            ]
          }
        }
      })
    }

    const ruleBadgeLabelField = fields.find((f) => f.api_key === 'badge_label')
    if (ruleBadgeLabelField) {
      console.log('Updating badge_label hint on discount rule')
      await client.fields.update(ruleBadgeLabelField.id, {
        hint: 'Optional badge text to display (e.g. SALE or 10% OFF). Leave empty for no badge.',
        appearance: {
          addons: [],
          editor: 'single_line',
          parameters: { heading: false, placeholder: 'Leave empty for no badge' }
        }
      })
    }
  }

  if (promotionModel) {
    const promoFields = await client.fields.list(promotionModel.id)
    const promoBadgeLabelField = promoFields.find((f) => f.api_key === 'badge_label')
    if (promoBadgeLabelField) {
      console.log('Updating badge_label hint on promotion')
      await client.fields.update(promoBadgeLabelField.id, {
        hint: 'Optional default badge label for this campaign. Leave empty for no badge.',
        appearance: {
          addons: [],
          editor: 'single_line',
          parameters: { heading: false, placeholder: 'Leave empty for no badge' }
        }
      })
    }
  }

  console.log('Successfully updated Promotions Manager targeting and badge options.')
}

