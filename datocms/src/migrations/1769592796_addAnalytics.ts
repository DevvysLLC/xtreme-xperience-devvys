import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "\uD83C\uDF0E Google" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'Jlq-p7sYRnGmamJ-JBhgHQ',
    title: '\uD83C\uDF0E Google',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Boolean field "Google Enable GTM" (`google_enable_gtm`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'HXTaSHp-TmaopF-253cUZg',
    label: 'Google Enable GTM',
    field_type: 'boolean',
    api_key: 'google_enable_gtm',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'Jlq-p7sYRnGmamJ-JBhgHQ', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Google GTM ID" (`google_gtm_id`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'PEjFerW6Tdi5Eih1JsD62g',
    label: 'Google GTM ID',
    field_type: 'string',
    api_key: 'google_gtm_id',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'Jlq-p7sYRnGmamJ-JBhgHQ', type: 'fieldset' }
  })

  console.log(
    'Create Boolean field "Google Enable Event Tracking" (`google_enable_event_tracking`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'QYK6ccARRne8X9Ap_GCKOA',
    label: 'Google Enable Event Tracking',
    field_type: 'boolean',
    api_key: 'google_enable_event_tracking',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'Jlq-p7sYRnGmamJ-JBhgHQ', type: 'fieldset' }
  })

  console.log(
    'Create Boolean field "Google Enable Analytics" (`google_enable_analytics`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'Kh0u1qTIRMKJI-n-pEcUAQ',
    label: 'Google Enable Analytics',
    field_type: 'boolean',
    api_key: 'google_enable_analytics',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'Jlq-p7sYRnGmamJ-JBhgHQ', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Title (override)" (`title_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'AbNqmQoYT6myuddeh2M1YA',
    label: 'Title (override)',
    field_type: 'string',
    api_key: 'title_override',
    hint: 'Override the default supercar title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Thumbnail (override)" (`thumbnail_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'ZIITV_zpQru0fYt-D9aY7w',
    label: 'Thumbnail (override)',
    field_type: 'single_block',
    api_key: 'thumbnail_override',
    hint: 'Override the default supercar thumbnail',
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
    'Create Modular Content (Single block) field "Price (override)" (`price_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'N-Qt6WUfRtisEhF85T_y8A',
    label: 'Price (override)',
    field_type: 'single_block',
    api_key: 'price_override',
    hint: 'Override the default supercar price',
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
    'Create Modular Content (Single block) field "Badge (override)" (`badge_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'Tqi4PLNTQfirxRYs27ju8w',
    label: 'Badge (override)',
    field_type: 'single_block',
    api_key: 'badge_override',
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
    'Create Single-line string field "Newsletter Title" (`newsletter_title`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'e_KTy4mUQ_aQX0HyZ93Bsw',
    label: 'Newsletter Title',
    field_type: 'string',
    api_key: 'newsletter_title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Newsletter Description" (`newsletter_description`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'NMVkDM-cQNexkacJ1jA41w',
    label: 'Newsletter Description',
    field_type: 'text',
    api_key: 'newsletter_description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Single-line string field "Newsletter Field Placeholder" (`newsletter_field_placeholder`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'HliUvNOcQIuGX7LRWqAFUg',
    label: 'Newsletter Field Placeholder',
    field_type: 'string',
    api_key: 'newsletter_field_placeholder',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Newsletter Submit Button" (`newsletter_submit_button`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'P77it_-ZT3-f6hFRGxq6qg',
    label: 'Newsletter Submit Button',
    field_type: 'string',
    api_key: 'newsletter_submit_button',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Newsletter Note" (`newsletter_note`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'eUrYEReoTL6S3JWadPbPpw',
    label: 'Newsletter Note',
    field_type: 'string',
    api_key: 'newsletter_note',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Newsletter Success Message" (`newsletter_success_message`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'VUdmIFxwQLS2sdx8iElofA',
    label: 'Newsletter Success Message',
    field_type: 'string',
    api_key: 'newsletter_success_message',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Boolean field "Google Enable GTM" (`google_enable_gtm`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('HXTaSHp-TmaopF-253cUZg', { position: 0 })

  console.log(
    'Update Single-line string field "Google GTM ID" (`google_gtm_id`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('PEjFerW6Tdi5Eih1JsD62g', { position: 1 })

  console.log(
    'Update Boolean field "Google Enable Event Tracking" (`google_enable_event_tracking`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('QYK6ccARRne8X9Ap_GCKOA', { position: 2 })

  console.log(
    'Update Boolean field "Google Enable Analytics" (`google_enable_analytics`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('Kh0u1qTIRMKJI-n-pEcUAQ', { position: 3 })

  console.log(
    'Update Multiple-paragraph text field "Body" (`body`) in block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.fields.update('Q2HeYSECTUW9ljDzuFBahA', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: ['bold', 'italic', 'link', 'ordered_list', 'unordered_list']
      }
    }
  })

  console.log(
    'Update Single link field "Supercar" (`supercar`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('RU3g6Y96R4mWzIGJ8uBWHQ', { position: 6 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.update('FuskvUVKTpuOhPR2Wsikaw', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Update Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.update('N9juDU9_Q828HeKwr1z1xA', {
    hint: 'If this option is "Choose on drive day" the value must be "choose_on_drive_day" (all lower snake case)'
  })

  console.log(
    'Update Single-line string field "Rocket Rez uid" (`rocket_rez_uid`) in block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.fields.update('UhTZbTvhRxeYT1HvDXJkNA', {
    hint: 'Add "0" for "choose on drive day" option'
  })

  console.log(
    'Update Single link field "Social" (`social`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.update('V1GBGnWpQVO0qq3f5mvDAA', { position: 12 })

  console.log(
    'Update Boolean field "Show Social" (`show_social`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.update('J3R0bdtEQR2vqwvzI0cvlA', { position: 11 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.itemTypes.update('U7Y2BaDuQtCZ0faJKn2LIw', {
    presentation_title_field: { id: 'e_KTy4mUQ_aQX0HyZ93Bsw', type: 'field' }
  })
}
