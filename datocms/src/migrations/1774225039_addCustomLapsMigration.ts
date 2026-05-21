import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.itemTypes.create(
    {
      id: 'Jwaw2zxlSa2HS5633lvsNQ',
      name: 'Booking - Event Override',
      api_key: 'booking_event_override',
      modular_block: true,
      draft_saving_active: false,
      hint: '',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'Jg9s15X7Sf-VxO4XqKWLnw'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single link field "Event" (`event`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'C-AfVtvYT7-xS57sC1QtEQ',
    label: 'Event',
    field_type: 'link',
    api_key: 'event',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['C5xdhHU0TxuME6A18rivgg']
      }
    },
    appearance: {
      addons: [],
      editor: 'link_select',
      parameters: { filters: [] }
    }
  })

  console.log(
    'Create Integer number field "Laps Per Session" (`laps_per_session`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'MWruaoLOQpySi757zBe7WQ',
    label: 'Laps Per Session',
    field_type: 'integer',
    api_key: 'laps_per_session',
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 3
  })

  console.log(
    'Create Single-line string field "Quantity Title (3 laps)" (`quantity_title_three_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'WQPJg6S2Qk23zTZEW4MBtA',
    label: 'Quantity Title (3 laps)',
    field_type: 'string',
    api_key: 'quantity_title_three_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Quantity Label (3 laps)" (`quantity_label_three_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'QGKrxSSZS3yU3yqezXlr2A',
    label: 'Quantity Label (3 laps)',
    field_type: 'string',
    api_key: 'quantity_label_three_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Quantity Title (6 laps)" (`quantity_title_six_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'EsczB75sTxKRo1GPiPL9HQ',
    label: 'Quantity Title (6 laps)',
    field_type: 'string',
    api_key: 'quantity_title_six_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Quantity Label (6 laps)" (`quantity_label_six_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'GTEb5tPzRcKXeV7fWnutHg',
    label: 'Quantity Label (6 laps)',
    field_type: 'string',
    api_key: 'quantity_label_six_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Quantity Title (9 laps)" (`quantity_title_nine_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'CEhul-0gQh6o5vuGVC8u9Q',
    label: 'Quantity Title (9 laps)',
    field_type: 'string',
    api_key: 'quantity_title_nine_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Quantity Label (9 laps)" (`quantity_label_nine_laps`) in block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.fields.create('Jwaw2zxlSa2HS5633lvsNQ', {
    id: 'RyrXCV0ETYqj3dLORfjwqA',
    label: 'Quantity Label (9 laps)',
    field_type: 'string',
    api_key: 'quantity_label_nine_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Boolean field "Enable Booking Bar" (`enable_booking_bar`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'FpxWotieQoCR8VPBWPzvqA',
    label: 'Enable Booking Bar',
    field_type: 'boolean',
    api_key: 'enable_booking_bar',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    default_value: true,
    fieldset: { id: 'JaRuEC5JSx-0SNPby9tJQg', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Hide Booking Bar on Paths" (`hide_booking_bar_on_paths`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'YCV6sqNPRbug4m-UDfHcWw',
    label: 'Hide Booking Bar on Paths',
    field_type: 'string',
    api_key: 'hide_booking_bar_on_paths',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'JaRuEC5JSx-0SNPby9tJQg', type: 'fieldset' }
  })

  console.log(
    'Create Boolean field "Add Card Links" (`add_card_links`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'aM9KfY6KR8Gp6pj97LuRDg',
    label: 'Add Card Links',
    field_type: 'boolean',
    api_key: 'add_card_links',
    hint: 'Check this if you want cards to link to the supercar detail page',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    default_value: true
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Event Overrides" (`event_overrides`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'O23swnIlRgqpyIg0nFISng',
    label: 'Event Overrides',
    field_type: 'rich_text',
    api_key: 'event_overrides',
    validators: {
      rich_text_blocks: { item_types: ['Jwaw2zxlSa2HS5633lvsNQ'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Boolean field "Add Card Links" (`add_card_links`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.update('aM9KfY6KR8Gp6pj97LuRDg', { position: 4 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "Booking - Event Override" (`booking_event_override`)'
  )
  await client.itemTypes.update('Jwaw2zxlSa2HS5633lvsNQ', {
    presentation_title_field: { id: 'QGKrxSSZS3yU3yqezXlr2A', type: 'field' }
  })
}
