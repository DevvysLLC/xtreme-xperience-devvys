import { type Client } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating block model "Booking - Discount Rule" (`booking_discount_rule`)')

  const blockModel = await client.itemTypes.create(
    {
      name: 'Booking - Discount Rule',
      api_key: 'booking_discount_rule',
      modular_block: true,
      draft_saving_active: false,
      hint: 'Configure dynamic pricing discounts by car, time of day (morning/afternoon), and event scope.',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true
    }
  )

  console.log('Creating fields on "Booking - Discount Rule"')

  // 1. Rule title / name
  await client.fields.create(blockModel.id, {
    label: 'Rule Name',
    api_key: 'title',
    field_type: 'string',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: 'e.g. Morning 8-10 AM 10% Off' }
    }
  })

  // 2. Discount Type
  await client.fields.create(blockModel.id, {
    label: 'Discount Type',
    api_key: 'discount_type',
    field_type: 'string',
    validators: {
      required: {},
      enum: {
        values: ['percentage', 'fixed_amount']
      }
    },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: 'Percentage discount (e.g. 10%)', label: 'Percentage (%)', value: 'percentage' },
          { hint: 'Fixed amount discount in cents', label: 'Fixed Amount ($)', value: 'fixed_amount' }
        ]
      }
    }
  })

  // 3. Discount Value
  await client.fields.create(blockModel.id, {
    label: 'Discount Value',
    api_key: 'discount_value',
    field_type: 'float',
    validators: { required: {} },
    hint: 'Enter percentage points (e.g. 10 for 10%) or fixed amount in cents (e.g. 5000 for $50.00)',
    appearance: {
      addons: [],
      editor: 'float',
      parameters: {}
    }
  })

  // 4. Time Window
  await client.fields.create(blockModel.id, {
    label: 'Time Window',
    api_key: 'time_window',
    field_type: 'string',
    validators: {
      required: {},
      enum: {
        values: ['morning', 'afternoon', 'all_day', 'custom']
      }
    },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '8:00 AM to 10:00 AM', label: 'Morning (8:00 AM - 10:00 AM)', value: 'morning' },
          { hint: '10:30 AM to 5:30 PM', label: 'Afternoon (10:30 AM - 5:30 PM)', value: 'afternoon' },
          { hint: 'Applies to all schedule times', label: 'All Day', value: 'all_day' },
          { hint: 'Use custom start and end time fields below', label: 'Custom Window', value: 'custom' }
        ]
      }
    }
  })

  // 5. Custom Start Time
  await client.fields.create(blockModel.id, {
    label: 'Custom Start Time (optional)',
    api_key: 'start_time',
    field_type: 'string',
    hint: '24-hour format e.g. 08:00 (only used if Custom Window selected)',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: '08:00' }
    }
  })

  // 6. Custom End Time
  await client.fields.create(blockModel.id, {
    label: 'Custom End Time (optional)',
    api_key: 'end_time',
    field_type: 'string',
    hint: '24-hour format e.g. 10:00 (only used if Custom Window selected)',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: '10:00' }
    }
  })

  // 7. Apply to all events toggle
  await client.fields.create(blockModel.id, {
    label: 'Apply To All Events',
    api_key: 'apply_to_all_events',
    field_type: 'boolean',
    default_value: true,
    hint: 'If enabled, discount applies to all events by default.',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  // 8. Specific Events
  await client.fields.create(blockModel.id, {
    label: 'Target Events',
    api_key: 'events',
    field_type: 'links',
    hint: 'Select specific events if not applying to all events.',
    validators: {
      items_item_type: {
        item_types: ['C5xdhHU0TxuME6A18rivgg']
      }
    },
    appearance: {
      addons: [],
      editor: 'links_select',
      parameters: {}
    }
  })

  // 9. Target Supercars
  await client.fields.create(blockModel.id, {
    label: 'Target Supercars',
    api_key: 'supercars',
    field_type: 'links',
    hint: 'Leave empty to apply to ALL supercars, or select specific cars.',
    validators: {
      items_item_type: {
        item_types: ['Waja7LEiS9Se3JoNMhnZQg']
      }
    },
    appearance: {
      addons: [],
      editor: 'links_select',
      parameters: {}
    }
  })

  // 10. Badge label
  await client.fields.create(blockModel.id, {
    label: 'Badge Label (optional)',
    api_key: 'badge_label',
    field_type: 'string',
    hint: 'Optional badge text to display (e.g. SALE or 10% OFF)',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: 'SALE' }
    }
  })

  console.log('Adding "Discount Rules" modular content field to Booking Settings (`booking_config`)')
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    label: 'Discount Rules',
    api_key: 'discount_rules',
    field_type: 'rich_text',
    validators: {
      rich_text_blocks: { item_types: [blockModel.id] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Successfully created Booking Discount Rules model and fields.')
}
