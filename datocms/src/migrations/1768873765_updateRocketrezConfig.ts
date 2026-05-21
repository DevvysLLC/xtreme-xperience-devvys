import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log('Create model "\uD83D\uDEE1\uFE0F Insurance" (`insurance`)')
  await client.itemTypes.create(
    {
      id: 'YhvcUTT1QBameBu0P-PSYg',
      name: '\uD83D\uDEE1\uFE0F Insurance',
      api_key: 'insurance',
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'dBqd1zeBRJmNlR0xUoWz_A'
    }
  )

  console.log(
    'Create block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.itemTypes.create(
    {
      id: 'DRXrJvGQQUWHg9_2aGNhvA',
      name: '\uD83D\uDEE1\uFE0F Insurance - Model',
      api_key: 'insurance_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'dIRKNyszTQyrBlKKpmpN_g'
    }
  )

  console.log(
    'Create block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.itemTypes.create(
    {
      id: 'I0b7spHISgO1_NQuc_Me5A',
      name: '\uD83D\uDCC5 Booking - Supercar Group',
      api_key: 'booking_supercar_group',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'axb0trp9Slazr2pxPu6hJw'
    }
  )

  console.log(
    'Create block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.itemTypes.create(
    {
      id: 'BGZHvsRCTTu8vCgCKA_vEw',
      name: '\uD83D\uDCC5 Booking - Supercar',
      api_key: 'booking_supercar',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'L-eTEaePRlGI9NyI-WFD5g'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title (Internal)" (`title_internal`) in model "\uD83D\uDEE1\uFE0F Insurance" (`insurance`)'
  )
  await client.fields.create('YhvcUTT1QBameBu0P-PSYg', {
    id: 'F-3XchmVRVKayD0GlSk4Tg',
    label: 'Title (Internal)',
    field_type: 'string',
    api_key: 'title_internal',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Model" (`model`) in model "\uD83D\uDEE1\uFE0F Insurance" (`insurance`)'
  )
  await client.fields.create('YhvcUTT1QBameBu0P-PSYg', {
    id: 'OTBs-pWRQcCD7QxUgUVssQ',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['DRXrJvGQQUWHg9_2aGNhvA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'J1l7nGJeTti04ueKKb2c2A',
    label: 'Title',
    field_type: 'string',
    api_key: 'title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'N9juDU9_Q828HeKwr1z1xA',
    label: 'Rocket Rez ID',
    field_type: 'string',
    api_key: 'rocket_rez_id',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Rocket Rez uid" (`rocket_rez_uid`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'UhTZbTvhRxeYT1HvDXJkNA',
    label: 'Rocket Rez uid',
    field_type: 'string',
    api_key: 'rocket_rez_uid',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Rocket Rez Type" (`rocket_rez_type`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'UggYLlOjSXyyIoB_4eF4Sw',
    label: 'Rocket Rez Type',
    field_type: 'string',
    api_key: 'rocket_rez_type',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Retail', value: 'Retail' },
          { hint: '', label: 'Giftcard', value: 'Giftcard' }
        ]
      }
    },
    default_value: 'Retail'
  })

  console.log(
    'Create Multiple-paragraph text field "Coverage" (`coverage`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'DM2ieic4RbKp22PRoR1FGQ',
    label: 'Coverage',
    field_type: 'text',
    api_key: 'coverage',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'CHKvp2gaRyq3Uyadso7MMQ',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: [
          'heading',
          'bold',
          'italic',
          'unordered_list',
          'ordered_list',
          'quote',
          'link'
        ]
      }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Price" (`price`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'EExK3egTQP-MDwfECalicg',
    label: 'Price',
    field_type: 'single_block',
    api_key: 'price',
    validators: {
      single_block_blocks: { item_types: ['ft4xDixyRuaoVG_33vUqPw'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Badge" (`badge`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'DPEgYrQhT3Ov8cCPdbZk7A',
    label: 'Badge',
    field_type: 'single_block',
    api_key: 'badge',
    validators: {
      single_block_blocks: { item_types: ['B_Ne5JBoTKaz9kIS8_x6GA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.create('DRXrJvGQQUWHg9_2aGNhvA', {
    id: 'fbrRWtiNRdS-4NjnmRa-uQ',
    label: 'Thumbnail',
    field_type: 'single_block',
    api_key: 'thumbnail',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.fields.create('I0b7spHISgO1_NQuc_Me5A', {
    id: 'GXGxvFviRT2koLBUeQXJPw',
    label: 'Title',
    field_type: 'string',
    api_key: 'title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Supercars" (`supercars`) in block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.fields.create('I0b7spHISgO1_NQuc_Me5A', {
    id: 'Mxhk5tmzSCi1_EaoVf5j-w',
    label: 'Supercars',
    field_type: 'rich_text',
    api_key: 'supercars',
    validators: {
      rich_text_blocks: { item_types: ['BGZHvsRCTTu8vCgCKA_vEw'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Rocket Rez Seat Type Id" (`rocket_rez_seat_type_id`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'Tjrg-3w9TDWKa9vBXxBD-A',
    label: 'Rocket Rez Seat Type Id',
    field_type: 'string',
    api_key: 'rocket_rez_seat_type_id',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single link field "Supercar" (`supercar`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'RU3g6Y96R4mWzIGJ8uBWHQ',
    label: 'Supercar',
    field_type: 'link',
    api_key: 'supercar',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['Waja7LEiS9Se3JoNMhnZQg']
      },
      required: {}
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} }
  })

  console.log(
    'Create fieldset "Contact" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'MCihdPhpTUqxsDGmHJvKCw',
    title: 'Contact',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create fieldset "\uD83D\uDEE3\uFE0F Track Finder" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'EwFc1VHfQEqw20Gq_uMbIA',
    title: '\uD83D\uDEE3\uFE0F Track Finder',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Boolean field "Popular" (`popular`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'dagCP0xlQoCvQ9X16BxnkA',
    label: 'Popular',
    field_type: 'boolean',
    api_key: 'popular',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Integer number field "Booking Total Cars" (`booking_total_cars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'Y1hlXKXbTgWruszv5NOsNA',
    label: 'Booking Total Cars',
    field_type: 'integer',
    api_key: 'booking_total_cars',
    hint: 'The total number of cars the user is booking. Eg how many cars are in this "Experience"',
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 1
  })

  console.log(
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDCC5 Booking - Metadata" (`booking_metad`)'
  )
  await client.fields.create('AHqtwKTqREiuR28PzKxLrg', {
    id: 'SpKW3WkKRgi_ih9lSjTHkA',
    label: 'Subtitle',
    field_type: 'string',
    api_key: 'subtitle',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Badge" (`badge`) in block model "\uD83D\uDCC5 Booking - Metadata" (`booking_metad`)'
  )
  await client.fields.create('AHqtwKTqREiuR28PzKxLrg', {
    id: 'T5RlPJk3Tj6G-bnnLkR3qQ',
    label: 'Badge',
    field_type: 'single_block',
    api_key: 'badge',
    validators: {
      single_block_blocks: { item_types: ['B_Ne5JBoTKaz9kIS8_x6GA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create fieldset "\u270F\uFE0F Pages" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'JzYv1uGeQKuh1NEkRO6LzA',
    title: '\u270F\uFE0F Pages',
    collapsible: true
  })

  console.log(
    'Create fieldset "\u2699\uFE0F Metadata" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'TBlRe9jxR1KN9QvRxknGNQ',
    title: '\u2699\uFE0F Metadata',
    collapsible: true
  })

  console.log(
    'Create fieldset "\u270F\uFE0F Information" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'U2Pd_CCXSiWttNYxSXdX9g',
    title: '\u270F\uFE0F Information',
    collapsible: true
  })

  console.log(
    'Create fieldset "\uD83C\uDFA8 API Decorators (Deprecated)" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'dRWmaJGBTRSVGHsngqfPrg',
    title: '\uD83C\uDFA8 API Decorators (Deprecated)',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Multiple-paragraph text field "Cancellation Policy" (`cancellation_policy`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'dY7n2-maRn-Yo7KHV-I9iA',
    label: 'Cancellation Policy',
    field_type: 'text',
    api_key: 'cancellation_policy',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: [
          'bold',
          'italic',
          'strikethrough',
          'unordered_list',
          'ordered_list'
        ]
      }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Supercars" (`supercars`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'A65mdRQpSIyeUJOqwPjr_w',
    label: 'Supercars',
    field_type: 'rich_text',
    api_key: 'supercars',
    validators: {
      rich_text_blocks: { item_types: ['I0b7spHISgO1_NQuc_Me5A'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Multiple links field "Insurance" (`insurance`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'M8Hm35xYT3meFRGb8OWBtw',
    label: 'Insurance',
    field_type: 'links',
    api_key: 'insurance',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['YhvcUTT1QBameBu0P-PSYg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Multiple-paragraph text field "Legal Notice" (`legal_notice`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'IAFpe-ovTIm2tdniBtIKfw',
    label: 'Legal Notice',
    field_type: 'text',
    api_key: 'legal_notice',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: ['bold', 'italic', 'ordered_list', 'unordered_list']
      }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Multiple links field "Ride Along" (`ride_along`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'WiE0krtYR7eqKK-IhJOiPQ',
    label: 'Ride Along',
    field_type: 'links',
    api_key: 'ride_along',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['fvhQe2gWS8-0s_fQQjvXvg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Multiple links field "Addons" (`addons`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'IXjf9ROaQTuNUmItPSkOvw',
    label: 'Addons',
    field_type: 'links',
    api_key: 'addons',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['fvhQe2gWS8-0s_fQQjvXvg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Multiple links field "Upsell" (`upsell`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'UQPlM0VXSLuXVsYla5HOBQ',
    label: 'Upsell',
    field_type: 'links',
    api_key: 'upsell',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['fvhQe2gWS8-0s_fQQjvXvg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single-line string field "Rocket Rez Root ID (Legacy)" (`rocket_rez_root_id`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.destroy('JUVFkZ5IT0yh3O7ogdam7w')

  console.log(
    'Delete Modular Content (Multiple blocks) field "Cards" (`cards`) in block model "\uD83D\uDCC5 Booking - Page" (`booking_page`)'
  )
  await client.fields.destroy('QXKWgkSmRfOAMKgqFlAHsA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single link field "Sticky Track Finder Links" (`sticky_track_finder_links`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('E_SEG13FSQ2UyVbkmE6aEg', {
    position: 0,
    fieldset: { id: 'EwFc1VHfQEqw20Gq_uMbIA', type: 'fieldset' }
  })

  console.log(
    'Update Multiple-paragraph text field "Working Hours" (`working_hours`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('dhM44wkQRFi8YYb_wJjgVg', {
    position: 0,
    fieldset: { id: 'MCihdPhpTUqxsDGmHJvKCw', type: 'fieldset' }
  })

  console.log(
    'Update Single-line string field "Sticky Track Finder Heading" (`sticky_track_finder_heading`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('UIlV3VrXQd-IBFlU6aPiSA', {
    position: 1,
    fieldset: { id: 'EwFc1VHfQEqw20Gq_uMbIA', type: 'fieldset' }
  })

  console.log(
    'Update Single-line string field "Contact Phone Number" (`contact_phone_number`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('KkWVaUAjTAWRukXH5rL5lA', {
    position: 1,
    fieldset: { id: 'MCihdPhpTUqxsDGmHJvKCw', type: 'fieldset' }
  })

  console.log(
    'Update Boolean field "Popular" (`popular`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('dagCP0xlQoCvQ9X16BxnkA', { position: 7 })

  console.log(
    'Update Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('TG6NgbNFSAi66X0Mi3hltQ', {
    validators: { required: {} }
  })

  console.log(
    'Update Single-line string field "Rocket Rez uid" (`rocket_rez_uid`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('WqYuyhoTQ7OXZ3hcQWdMFw', {
    hint: 'Not required, but useful for debugging'
  })

  console.log(
    'Update Single-line string field "Rocket Rez Type" (`rocket_rez_type`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('Leowy8noQjiHUZF8jVNBJQ', {
    validators: { required: {} },
    default_value: 'Event'
  })

  console.log(
    'Update Single-line string field "Rocket Rez Root ID (Legacy)" (`rocket_rez_root_id`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('XHJyD6ycQqmmm7dk75kXXQ', {
    validators: { required: {} }
  })

  console.log(
    'Update Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.update('N_MiV2r2RCqjHHBiOp7K-A', {
    validators: { required: {} }
  })

  console.log(
    'Update Single-line string field "Rocket Rez Type" (`rocket_rez_type`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.update('Dp73PwtER5qjhH2U_cSOJA', {
    validators: { required: {} },
    default_value: 'Retail'
  })

  console.log(
    'Update Integer number field "Booking Total Cars" (`booking_total_cars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('Y1hlXKXbTgWruszv5NOsNA', { position: 3 })

  console.log(
    'Update Single-line string field "Rocket Seat Type ID" (`rocket_rez_id`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('ISHL7rmmT0Sj10QZnC2D1Q', {
    label: 'Rocket Seat Type ID'
  })

  console.log(
    'Update Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDCC5 Booking - Metadata" (`booking_metad`)'
  )
  await client.fields.update('SpKW3WkKRgi_ih9lSjTHkA', { position: 3 })

  console.log(
    'Update Modular Content (Multiple blocks) field "Decorators" (`decorators`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('Ga-tCDUST36Ds32AFulZmg', {
    position: 0,
    fieldset: { id: 'dRWmaJGBTRSVGHsngqfPrg', type: 'fieldset' }
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "Pages" (`pages`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('bOJYQ13VRg2eTsTVscbRUg', {
    position: 0,
    fieldset: { id: 'JzYv1uGeQKuh1NEkRO6LzA', type: 'fieldset' }
  })

  console.log(
    'Update Multiple-paragraph text field "Cancellation Policy" (`cancellation_policy`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('dY7n2-maRn-Yo7KHV-I9iA', { position: 0 })

  console.log(
    'Update Modular Content (Multiple blocks) field "Supercars" (`supercars`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('A65mdRQpSIyeUJOqwPjr_w', { position: 0 })

  console.log(
    'Update Multiple links field "Insurance" (`insurance`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('M8Hm35xYT3meFRGb8OWBtw', { position: 1 })

  console.log(
    'Update Multiple-paragraph text field "Legal Notice" (`legal_notice`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('IAFpe-ovTIm2tdniBtIKfw', { position: 1 })

  console.log(
    'Update Multiple links field "Ride Along" (`ride_along`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('WiE0krtYR7eqKK-IhJOiPQ', { position: 2 })

  console.log(
    'Update Multiple links field "Addons" (`addons`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('IXjf9ROaQTuNUmItPSkOvw', { position: 3 })

  console.log(
    'Update Multiple links field "Upsell" (`upsell`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('UQPlM0VXSLuXVsYla5HOBQ', { position: 4 })

  console.log('Finalize models/block models')

  console.log('Update model "\uD83D\uDEE1\uFE0F Insurance" (`insurance`)')
  await client.itemTypes.update('YhvcUTT1QBameBu0P-PSYg', {
    presentation_title_field: { id: 'F-3XchmVRVKayD0GlSk4Tg', type: 'field' },
    title_field: { id: 'F-3XchmVRVKayD0GlSk4Tg', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.itemTypes.update('DRXrJvGQQUWHg9_2aGNhvA', {
    presentation_title_field: { id: 'J1l7nGJeTti04ueKKb2c2A', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.itemTypes.update('I0b7spHISgO1_NQuc_Me5A', {
    presentation_title_field: { id: 'GXGxvFviRT2koLBUeQXJPw', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.itemTypes.update('BGZHvsRCTTu8vCgCKA_vEw', {
    presentation_title_field: { id: 'Tjrg-3w9TDWKa9vBXxBD-A', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDCC5 Section - Event Finder" (`section_event_finder`)'
  )
  await client.itemTypes.update('GZpT8my2QBeJcqfTPtCGIg', {
    name: '\uD83D\uDCC5 Section - Event Finder',
    api_key: 'section_event_finder'
  })

  console.log('Manage menu items')

  console.log('Create menu item "\uD83D\uDEE1\uFE0F Insurance"')
  await client.menuItems.create({
    id: 'A609ODE5S3e_M-MLHCyPag',
    label: '\uD83D\uDEE1\uFE0F Insurance',
    item_type: { id: 'YhvcUTT1QBameBu0P-PSYg', type: 'item_type' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update model schema menu item for model "\uD83D\uDEE1\uFE0F Insurance" (`insurance`)'
  )
  await client.schemaMenuItems.update('dBqd1zeBRJmNlR0xUoWz_A', {
    position: 13
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.schemaMenuItems.update('dIRKNyszTQyrBlKKpmpN_g', {
    position: 33
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.schemaMenuItems.update('OWE4DLnxR0OXvszI-pMxWg', {
    position: 100
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Badge" (`core_badge`)'
  )
  await client.schemaMenuItems.update('WRNz9vAbTses6Y5eqLgWWQ', {
    position: 96
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.schemaMenuItems.update('dXevvOMqTOCY4ULWsH8AyQ', {
    position: 79
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.schemaMenuItems.update('eL0Bup0rQn2qFOFYFty-2Q', {
    position: 46
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.schemaMenuItems.update('K1yK2MHkSWm3rfiynIA3Xg', {
    position: 45
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.schemaMenuItems.update('LCIZMxrjRvCJ60kRgglFKA', {
    position: 78
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.schemaMenuItems.update('PhOgOysiT9uPQAw-gT4GGQ', {
    position: 92
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.schemaMenuItems.update('Vk5Kq8TjR7yp2Oaf-RRAtw', {
    position: 88
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.schemaMenuItems.update('ZNuaXl-ZTEK0wh2B5TTsjQ', {
    position: 49
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.schemaMenuItems.update('WdXhe1LFQQWPS1rb1IfMsg', {
    position: 59
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - USP" (`section_usp`)'
  )
  await client.schemaMenuItems.update('P32ltwDgRca-MXkk7wr0tg', {
    position: 62
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Event Finder" (`section_event_finder`)'
  )
  await client.schemaMenuItems.update('NkMR4ttkSpa1msOvEUrL5Q', {
    position: 70
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.schemaMenuItems.update('S1ProRfKRk2PK3SAlZZOqg', {
    position: 73
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.schemaMenuItems.update('fzVePPv7Q6mMscnX3V8yIw', {
    position: 91
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.schemaMenuItems.update('C8FUntmpRDS_26VBlz8apQ', {
    position: 93
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.schemaMenuItems.update('IK9CCfydQY2GfTtyDHfrdA', {
    position: 81
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.schemaMenuItems.update('Quw9Nv9pTn-qUM2cSM0mBg', {
    position: 74
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.schemaMenuItems.update('CKgon9kATHWDBe29HpQ0SQ', {
    position: 69
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.schemaMenuItems.update('Wd6VR9ZRSs2hz0PH6NuZHw', {
    position: 58
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.schemaMenuItems.update('XJLB6OzWQpC1umD8tNwrpQ', {
    position: 66
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.schemaMenuItems.update('TmoxCsx8Ri-AUf_nsioMaA', {
    position: 94
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Post" (`post`)'
  )
  await client.schemaMenuItems.update('DyHShJ8BRmaWXMxFVOXU5A', {
    position: 99
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.schemaMenuItems.update('JEUgkHJDQJKcT_nmst_UqQ', {
    position: 76
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.schemaMenuItems.update('cWJzrGoIRjurl1OjbyaDSQ', {
    position: 80
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.schemaMenuItems.update('Q4v5wACvQxS1aCQtnXZd5Q', {
    position: 83
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.schemaMenuItems.update('LvNCw6B_Siu0ieaTCFoPuw', {
    position: 85
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.schemaMenuItems.update('IjEYvwmsTImztSNtOpOFdw', {
    position: 61
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.schemaMenuItems.update('flHBGeiDRk-pOxzxqgkxTg', {
    position: 68
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.schemaMenuItems.update('NDVWFKHmTWewQe09kRxH0A', {
    position: 64
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Metadata" (`booking_metad`)'
  )
  await client.schemaMenuItems.update('VpB-pp5ASqWUi3H33G_iUA', {
    position: 104
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Decorator" (`booking_decorator`)'
  )
  await client.schemaMenuItems.update('UBOHn75KSK6zzt2p-vy1Nw', {
    position: 105
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Page" (`booking_page`)'
  )
  await client.schemaMenuItems.update('YjuvxpbSTbSAvUDKMY1eWQ', {
    position: 106
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.schemaMenuItems.update('fd1l0fFKQBSFkUSv6z4GYw', {
    position: 102
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.schemaMenuItems.update('ZGpB5V7uTc-_uRae929nkA', {
    position: 71
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Category" (`category`)'
  )
  await client.schemaMenuItems.update('X3IkFB1-T_mwAyr_P75-7A', {
    position: 101
  })

  console.log(
    'Update block schema menu item for block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.schemaMenuItems.update('VEbHH3qERAOAP_ChpMTGtg', {
    position: 42
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Supercar - Config" (`supercar_config`)'
  )
  await client.schemaMenuItems.update('U3gxeclRR9S8_SFP_hqlbA', {
    position: 36
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.schemaMenuItems.update('SfSXYZCwQNeHBvs_K7Ruwg', {
    position: 35
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Track - Config" (`track_config`)'
  )
  await client.schemaMenuItems.update('XIebkEpbQKGTSyS8mqJZfQ', {
    position: 40
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.schemaMenuItems.update('P5xsJTn-TmORko9cVEDSrQ', {
    position: 41
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.schemaMenuItems.update('ew2IJPbWTFersXmWYXbfBg', {
    position: 34
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Content" (`page_content`)'
  )
  await client.schemaMenuItems.update('O65sjeaaQ3qfKFTnuyjo5w', {
    position: 39
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Config" (`page_config`)'
  )
  await client.schemaMenuItems.update('DLHrhSMUTaO5NIhwMW11rQ', {
    position: 38
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.schemaMenuItems.update('B1fbLr_bQXeL4dZnPObTRw', {
    position: 89
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Image" (`core_image`)'
  )
  await client.schemaMenuItems.update('Qk5_eLN3Tu6dM818aKGYUw', {
    position: 87
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.schemaMenuItems.update('N89P5xHZRc2NixLTrQkaTg', {
    position: 86
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.schemaMenuItems.update('CU-1MY3iR7qbBuSA6k7tbg', {
    position: 103
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.schemaMenuItems.update('KTb1ICT5TRC0PCGhpp8d5Q', {
    position: 67
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.schemaMenuItems.update('ItJOjnRdSly2ciAvI4Gpzg', {
    position: 63
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.schemaMenuItems.update('C7yoLZvxQLK4kGLYWhMzSA', {
    position: 50
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.schemaMenuItems.update('LCV5jboyS-ai01zek58ecA', {
    position: 52
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Press Brand Grid" (`section_press_brand_grid`)'
  )
  await client.schemaMenuItems.update('TCxV-xQXQXGH_vbONl406A', {
    position: 54
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.schemaMenuItems.update('YYBt5xiHRMWkzhGXfIknRw', {
    position: 47
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.schemaMenuItems.update('MNVeqdNxTUKImsN0Mis2jw', {
    position: 60
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.schemaMenuItems.update('HN3rShX8Sh2LY0WfG8EtIw', {
    position: 56
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.schemaMenuItems.update('UuE5aXNfSpSyM72KBLTfzQ', {
    position: 57
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.schemaMenuItems.update('IhHlEBT4TyG5M7xPE0DWLw', {
    position: 55
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Split Callout" (`section_split_callout`)'
  )
  await client.schemaMenuItems.update('ZwodKcGbSIS_LHJl_e2_3w', {
    position: 51
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Headline" (`section_headline`)'
  )
  await client.schemaMenuItems.update('dv0lj_0AT9Kv4WeTJoyC_A', {
    position: 48
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.schemaMenuItems.update('AIs2wUSHTAKZaMxGRU8xEQ', {
    position: 75
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.schemaMenuItems.update('axb0trp9Slazr2pxPu6hJw', {
    position: 107
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.schemaMenuItems.update('L-eTEaePRlGI9NyI-WFD5g', {
    position: 108
  })
}
