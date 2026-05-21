import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log('Create model "\u270F\uFE0F Landing Page" (`landing_page`)')
  await client.itemTypes.create(
    {
      id: 'IDaSXkBJRgKW632Omcug-A',
      name: '\u270F\uFE0F Landing Page',
      api_key: 'landing_page',
      tree: true,
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'Hm4oVcM9T6WamcVuDUxhHQ'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in model "\u270F\uFE0F Landing Page" (`landing_page`)'
  )
  await client.fields.create('IDaSXkBJRgKW632Omcug-A', {
    id: 'CdA3FB9qSzKd18vhSf5Ydg',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    validators: { required: {}, unique: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Landing Page" (`landing_page`)'
  )
  await client.fields.create('IDaSXkBJRgKW632Omcug-A', {
    id: 'LTIiw1fuRX6Sr2u2_tzWfw',
    label: 'Config',
    field_type: 'single_block',
    api_key: 'config',
    validators: {
      single_block_blocks: { item_types: ['R-s6MDDjS76ugl5WsS5uzQ'] },
      required: {}
    },
    appearance: {
      addons: [],
      editor: 'frameless_single_block',
      parameters: {}
    },
    deep_filtering_enabled: true
  })

  console.log(
    'Create Modular Content (Single block) field "Content" (`content`) in model "\u270F\uFE0F Landing Page" (`landing_page`)'
  )
  await client.fields.create('IDaSXkBJRgKW632Omcug-A', {
    id: 'ZPK28vtpRWS-ayQGx-GSJQ',
    label: 'Content',
    field_type: 'single_block',
    api_key: 'content',
    validators: {
      single_block_blocks: { item_types: ['L9CuE6eYSxmP-Qgj-KvxAg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Cart Line Item Label" (`cart_line_item_label`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'FuRwOrRUQi2rIFiqBEB5QA',
    label: 'Cart Line Item Label',
    field_type: 'string',
    api_key: 'cart_line_item_label',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Track Xperience', value: 'track_xperience' },
          {
            hint: '',
            label: 'Multicar Track Xperience',
            value: 'multicar_track_experience'
          },
          { hint: '', label: 'Ride Along', value: 'ride_along' }
        ]
      }
    },
    default_value: 'track_experience'
  })

  console.log(
    'Create Boolean field "Is Ride Along" (`is_ride_along`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'KEVnz3lcRSOExpJhie4CSw',
    label: 'Is Ride Along',
    field_type: 'boolean',
    api_key: 'is_ride_along',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Is Multicar" (`is_multicar`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'Z5RaJie2RvuooCEQHwkZ8w',
    label: 'Is Multicar',
    field_type: 'boolean',
    api_key: 'is_multicar',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Integer number field "Multicar Count" (`multicar_count`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'Ih14b0I-TbuoasjAtNklnw',
    label: 'Multicar Count',
    field_type: 'integer',
    api_key: 'multicar_count',
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    }
  })

  console.log(
    'Create Color field "Title Color" (`title_color`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.fields.create('I6tUJOc9SA6B7fOaErBo1g', {
    id: 'I8o2hkfdT26sZiXTKVXPMQ',
    label: 'Title Color',
    field_type: 'color',
    api_key: 'title_color',
    hint: 'Please ensure it passes WCAG Accessibility',
    appearance: {
      addons: [],
      editor: 'color_picker',
      parameters: { enable_alpha: false, preset_colors: [] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Booking Announcement" (`booking_announcement`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'LxUmcAbfSn-fvpa9bX3cfg',
    label: 'Booking Announcement',
    field_type: 'single_block',
    api_key: 'booking_announcement',
    hint: 'If enabled, it will show below the Booking Progress Bar when the track is selected. It can be overwritten by Global Config',
    validators: {
      single_block_blocks: { item_types: ['L7u51GASQIakwH0d9Vq3yg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Booking Announcement" (`booking_announcement`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'cNEV0KrFR5ijTqJi8tKYDg',
    label: 'Booking Announcement',
    field_type: 'single_block',
    api_key: 'booking_announcement',
    hint: 'Global Booking announcement. If populated, it will override track booking if present.',
    validators: {
      single_block_blocks: { item_types: ['L7u51GASQIakwH0d9Vq3yg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single link field "Supercar" (`supercar`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('RU3g6Y96R4mWzIGJ8uBWHQ', { position: 1 })

  console.log(
    'Update Single-line string field "Title (override)" (`title_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('AbNqmQoYT6myuddeh2M1YA', { position: 7 })

  console.log(
    'Update Modular Content (Single block) field "Thumbnail (override)" (`thumbnail_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('ZIITV_zpQru0fYt-D9aY7w', { position: 8 })

  console.log(
    'Update Modular Content (Single block) field "Price (override)" (`price_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('N-Qt6WUfRtisEhF85T_y8A', { position: 9 })

  console.log(
    'Update Modular Content (Single block) field "Badge (override)" (`badge_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('Tqi4PLNTQfirxRYs27ju8w', { position: 10 })

  console.log(
    'Update Boolean field "Is Ride Along" (`is_ride_along`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('KEVnz3lcRSOExpJhie4CSw', { position: 4 })

  console.log(
    'Update Boolean field "Is Multicar" (`is_multicar`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('Z5RaJie2RvuooCEQHwkZ8w', { position: 5 })

  console.log(
    'Update Integer number field "Multicar Count" (`multicar_count`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('Ih14b0I-TbuoasjAtNklnw', { position: 6 })

  console.log(
    'Update Single-line string field "Rocket Rez uid" (`rocket_rez_uid`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.update('UhTZbTvhRxeYT1HvDXJkNA', {
    hint: 'If this option is "Choose on drive day" the value must be "choose_on_drive_day" (all lower snake case)'
  })

  console.log(
    'Update Structured text field "Body" (`body`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.update('Hi5_GLsURYmQuXadKXBxjw', {
    validators: {
      structured_text_blocks: {
        item_types: [
          'Dpb0LeFvRym9PXvdyVaIew',
          'PrRwA303RhehdZdoIR8DJA',
          'QHloTWPPR8Cw9V4xeFlaDg'
        ]
      },
      structured_text_inline_blocks: { item_types: [] },
      structured_text_links: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: [
          'AFEr51ZSRu63RSadF2W5nQ',
          'IDaSXkBJRgKW632Omcug-A',
          'SHn2LwXwS1KBDPW0hCpfJg',
          'Waja7LEiS9Se3JoNMhnZQg',
          'ZJcRHg4SSX-WyCUJTg52HQ'
        ]
      }
    }
  })

  console.log(
    'Update Color field "Title Color" (`title_color`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.fields.update('I8o2hkfdT26sZiXTKVXPMQ', { position: 3 })

  console.log(
    'Update Integer number field "(Deprecated) Booking Total Cars" (`booking_total_cars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('Y1hlXKXbTgWruszv5NOsNA', {
    label: '(Deprecated) Booking Total Cars',
    position: 35
  })

  console.log(
    'Update Modular Content (Single block) field "Logo Maker" (`logo_maker`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('db1-uqiFS9OYJWCVcgaPiA', { position: 32 })

  console.log(
    'Update Multiple links field "Supercars" (`supercars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('XlFS57GBRPSbpnHBbv6dNg', { position: 33 })

  console.log(
    'Update fieldset "\uD83C\uDFA8 (Deprecated) API Decorators" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.update('dRWmaJGBTRSVGHsngqfPrg', {
    title: '\uD83C\uDFA8 (Deprecated) API Decorators'
  })

  console.log('Finalize models/block models')

  console.log('Update model "\u270F\uFE0F Landing Page" (`landing_page`)')
  await client.itemTypes.update('IDaSXkBJRgKW632Omcug-A', {
    presentation_title_field: { id: 'CdA3FB9qSzKd18vhSf5Ydg', type: 'field' },
    title_field: { id: 'CdA3FB9qSzKd18vhSf5Ydg', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Create menu item "\u270F\uFE0F Landing Page"')
  await client.menuItems.create({
    id: 'W6Q4cHe4SD6_5iyRvQMYhQ',
    label: '\u270F\uFE0F Landing Page',
    item_type: { id: 'IDaSXkBJRgKW632Omcug-A', type: 'item_type' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Landing Page" (`landing_page`)'
  )
  await client.schemaMenuItems.update('Hm4oVcM9T6WamcVuDUxhHQ', {
    position: 92
  })
}
