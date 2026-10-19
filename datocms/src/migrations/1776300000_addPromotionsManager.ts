import { type Client } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Finding or updating "Booking - Discount Rule" (`booking_discount_rule`)')
  const itemTypes = await client.itemTypes.list()
  const discountRuleModel = itemTypes.find((it) => it.api_key === 'booking_discount_rule')

  if (discountRuleModel) {
    console.log('Adding new targeting & exclusion fields to "Booking - Discount Rule"')

    // 1. Target Product Type
    await client.fields.create(discountRuleModel.id, {
      label: 'Target Product Type',
      api_key: 'target_type',
      field_type: 'string',
      validators: {
        enum: {
          values: ['all', 'supercars', 'ride_along']
        }
      },
      default_value: 'all',
      hint: 'Apply to all cars, specific supercars, or ride-alongs only',
      appearance: {
        addons: [],
        editor: 'string_select',
        parameters: {
          options: [
            { hint: 'Applies across all products', label: 'All Products', value: 'all' },
            { hint: 'Applies to selected Supercars below', label: 'Supercars Only', value: 'supercars' },
            { hint: 'Applies to Ride-Along experiences only', label: 'Ride-Along Only', value: 'ride_along' }
          ]
        }
      }
    })

    // 2. Excluded Tracks
    await client.fields.create(discountRuleModel.id, {
      label: 'Excluded Tracks',
      api_key: 'excluded_tracks',
      field_type: 'links',
      hint: 'Select tracks where this discount rule should NOT apply (e.g. COTA, Sonoma).',
      validators: {
        items_item_type: {
          item_types: ['ZJcRHg4SSX-WyCUJTg52HQ'] // Track item type
        }
      },
      appearance: {
        addons: [],
        editor: 'links_select',
        parameters: {}
      }
    })

    // 3. Days of the Week
    await client.fields.create(discountRuleModel.id, {
      label: 'Days of the Week',
      api_key: 'days_of_week',
      field_type: 'string',
      validators: {
        enum: {
          values: ['all', 'weekdays', 'weekends', 'monday_thursday', 'friday', 'saturday', 'sunday']
        }
      },
      default_value: 'all',
      hint: 'Target pricing by day of week (e.g. Monday-Thursday vs Weekends)',
      appearance: {
        addons: [],
        editor: 'string_select',
        parameters: {
          options: [
            { hint: 'Valid on all days', label: 'All Days', value: 'all' },
            { hint: 'Monday through Friday', label: 'Weekdays (Mon-Fri)', value: 'weekdays' },
            { hint: 'Monday through Thursday', label: 'Weekdays (Mon-Thu)', value: 'monday_thursday' },
            { hint: 'Saturday & Sunday', label: 'Weekends (Sat-Sun)', value: 'weekends' },
            { hint: 'Fridays only', label: 'Friday Only', value: 'friday' },
            { hint: 'Saturdays only', label: 'Saturday Only', value: 'saturday' },
            { hint: 'Sundays only', label: 'Sunday Only', value: 'sunday' }
          ]
        }
      }
    })

    // 4. Strikethrough Reference / Compare-at Price Override
    await client.fields.create(discountRuleModel.id, {
      label: 'Compare-at Reference Price Override (optional)',
      api_key: 'compare_at_override',
      field_type: 'float',
      hint: 'Optional original display price before discount to show as crossed-out strikethrough ($).',
      appearance: {
        addons: [],
        editor: 'float',
        parameters: {}
      }
    })
  }

  console.log('Creating collection model "Promotions Manager" (`promotion`)')
  const promotionModel = await client.itemTypes.create(
    {
      name: 'Promotions Manager',
      api_key: 'promotion',
      modular_block: false,
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      hint: 'Create and manage marketing promotions, discounts, badges, and strikethroughs.',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true
    }
  )

  console.log('Creating fields on "Promotions Manager"')

  // 1. Name
  const nameField = await client.fields.create(promotionModel.id, {
    label: 'Promotion Name',
    api_key: 'name',
    field_type: 'string',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: true, placeholder: 'e.g. Spring Speed Sale' }
    }
  })

  // Set title field
  await client.itemTypes.update(promotionModel.id, {
    title_field: { id: nameField.id, type: 'field' }
  })

  // 2. Slug
  await client.fields.create(promotionModel.id, {
    label: 'Slug',
    api_key: 'slug',
    field_type: 'slug',
    validators: {
      required: {},
      unique: {},
      slug_title_field: { title_field_id: nameField.id }
    },
    appearance: {
      addons: [],
      editor: 'slug',
      parameters: {}
    }
  })

  // 3. Active Status Toggle
  await client.fields.create(promotionModel.id, {
    label: 'Active',
    api_key: 'active',
    field_type: 'boolean',
    default_value: true,
    hint: 'Toggle promotion on or off across the site immediately.',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  // 4. Start Date / Time
  await client.fields.create(promotionModel.id, {
    label: 'Start Date & Time (optional)',
    api_key: 'start_date',
    field_type: 'date_time',
    hint: 'Leave blank to make active immediately upon publishing.',
    appearance: { addons: [], editor: 'date_time_picker', parameters: {} }
  })

  // 5. End Date / Time
  await client.fields.create(promotionModel.id, {
    label: 'End Date & Time (optional)',
    api_key: 'end_date',
    field_type: 'date_time',
    hint: 'Leave blank to keep active indefinitely.',
    appearance: { addons: [], editor: 'date_time_picker', parameters: {} }
  })

  // 6. Promotional Badge Label
  await client.fields.create(promotionModel.id, {
    label: 'Badge Label (optional)',
    api_key: 'badge_label',
    field_type: 'string',
    hint: 'Badge displayed on car cards & schedule timeslots (e.g. "$100 OFF", "30% OFF", "MORNING SPECIAL").',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: 'e.g. $100 OFF' }
    }
  })

  // 7. Headline
  await client.fields.create(promotionModel.id, {
    label: 'Headline (optional)',
    api_key: 'headline',
    field_type: 'string',
    hint: 'Optional marketing banner text or tagline.',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: 'e.g. Save up to $100 on Morning Track Sessions' }
    }
  })

  // 8. Description
  await client.fields.create(promotionModel.id, {
    label: 'Description (optional)',
    api_key: 'description',
    field_type: 'text',
    hint: 'Optional promotion details and terms.',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {}
    }
  })

  // 9. Nested Discount Rules (modular content)
  if (discountRuleModel) {
    await client.fields.create(promotionModel.id, {
      label: 'Discount Rules',
      api_key: 'rules',
      field_type: 'rich_text',
      validators: {
        rich_text_blocks: { item_types: [discountRuleModel.id] }
      },
      appearance: {
        addons: [],
        editor: 'rich_text',
        parameters: { start_collapsed: false }
      }
    })
  }

  console.log('Adding "Promotions Manager" to sidebar navigation')
  await client.menuItems.create({
    label: '🏷️ Promotions Manager',
    item_type: { id: promotionModel.id, type: 'item_type' }
  })

  console.log('Successfully completed Promotions Manager migration.')
}
