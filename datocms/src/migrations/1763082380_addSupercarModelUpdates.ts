import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Multiple blocks) field "Gallery" (`gallery`) in block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.fields.create('ADb9Ui-VQsKHhq2GedmfUQ', {
    id: 'HdruNcWwTXiE5gUoHokGQA',
    label: 'Gallery',
    field_type: 'rich_text',
    api_key: 'gallery',
    validators: {
      rich_text_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Icon" (`icon`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'GHNsbpyNRKCZobLzPojTxg',
    label: 'Icon',
    field_type: 'string',
    api_key: 'icon',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Arrow down', value: 'arrow-down' },
          { hint: '', label: 'Arrow up', value: 'arrow-up' }
        ]
      }
    }
  })

  console.log(
    'Create Boolean field "Enabled" (`enabled`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'BlkNabRMSQ62tIDhwR9asw',
    label: 'Enabled',
    field_type: 'boolean',
    api_key: 'enabled',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Sold Out" (`sold_out`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'A4EpxNuSTjySdtLGyP9G3Q',
    label: 'Sold Out',
    field_type: 'boolean',
    api_key: 'sold_out',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Modular Content (Single block) field "Driving Price" (`driving_price`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'WDuvKDtyRkaEUFzVzebq9g',
    label: 'Driving Price',
    field_type: 'single_block',
    api_key: 'driving_price',
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
    'Create Modular Content (Single block) field "Ride Along Price" (`ride_along_price`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'JuudcT47QgqcR9IKJhW5iw',
    label: 'Ride Along Price',
    field_type: 'single_block',
    api_key: 'ride_along_price',
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
    'Create Multiple links field "Supercars" (`supercars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'XlFS57GBRPSbpnHBbv6dNg',
    label: 'Supercars',
    field_type: 'links',
    api_key: 'supercars',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['Waja7LEiS9Se3JoNMhnZQg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Gallery" (`gallery`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.create('ar7S0nqvTLiRuU7glh28Gg', {
    id: 'DuDiF_eZQQamTn-mJMaCUQ',
    label: 'Gallery',
    field_type: 'rich_text',
    api_key: 'gallery',
    validators: {
      rich_text_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Ride Along Price" (`ride_along_price`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'WsuQK3VzSuWRt0g4KOfHnA',
    label: 'Ride Along Price',
    field_type: 'single_block',
    api_key: 'ride_along_price',
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
    'Create Modular Content (Single block) field "Driving Price" (`driving_price`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'fFkbvrWhRg-mQbZPdgVEmQ',
    label: 'Driving Price',
    field_type: 'single_block',
    api_key: 'driving_price',
    validators: {
      single_block_blocks: { item_types: ['ft4xDixyRuaoVG_33vUqPw'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Modular Content (Multiple blocks) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.fields.destroy('Ei1Rvu2FTb-xxVHWyTUq4A')

  console.log(
    'Delete Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.destroy('PJWf4KpHSMyqniZURUskqQ')

  console.log(
    'Delete Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.destroy('CV1JemgBSz2uIb262QkeNQ')

  console.log(
    'Delete Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.destroy('RpOqhZGoQWKh0ruII2kfLA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Multiple blocks) field "Gallery" (`gallery`) in block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.fields.update('HdruNcWwTXiE5gUoHokGQA', { position: 7 })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.fields.update('KS5_nWJoRhu2qVRuzFwFnQ', { position: 6 })

  console.log(
    'Update Boolean field "Enabled" (`enabled`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('BlkNabRMSQ62tIDhwR9asw', { position: 3 })

  console.log(
    'Update Boolean field "Sold Out" (`sold_out`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('A4EpxNuSTjySdtLGyP9G3Q', { position: 4 })

  console.log(
    'Update Single-line string field "Title Internal" (`title_internal`) in block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.fields.update('cdIKXUVaRbmliJz0gBQSfQ', {
    default_value:
      'Please note this section does not have any direct inputs, the data comes from the model'
  })

  console.log(
    'Update Single-line string field "Title Internal" (`title_internal`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.update('P9loWVc1TSSRXbHLk_t8wg', {
    default_value:
      'Please note this section does not have any direct inputs, the data comes from the model'
  })

  console.log(
    'Update Modular Content (Single block) field "Driving Price" (`driving_price`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('WDuvKDtyRkaEUFzVzebq9g', { position: 20 })

  console.log(
    'Update Modular Content (Single block) field "Ride Along Price" (`ride_along_price`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('JuudcT47QgqcR9IKJhW5iw', { position: 21 })

  console.log(
    'Update Single-line string field "Title Internal" (`title_internal`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('I-QCpcD-Tb2Ggexp8j3CVQ', {
    default_value:
      'Please note this section does not have any direct inputs, the data comes from the model'
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "Gallery" (`gallery`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.update('DuDiF_eZQQamTn-mJMaCUQ', { position: 2 })

  console.log(
    'Update Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.update('H4Y1r5UmSeGCmCsX7rqZqg', { position: 1 })

  console.log(
    'Update Modular Content (Single block) field "Ride Along Price" (`ride_along_price`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('WsuQK3VzSuWRt0g4KOfHnA', { position: 17 })

  console.log(
    'Update Modular Content (Single block) field "Driving Price" (`driving_price`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('fFkbvrWhRg-mQbZPdgVEmQ', { position: 18 })

  console.log(
    'Update Single-line string field "Title Internal" (`title_internal`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.fields.update('fY5Eh1LOR_CPpjGsTNehGA', {
    default_value:
      'Please note this section does not have any direct inputs, the data comes from the model'
  })
}
