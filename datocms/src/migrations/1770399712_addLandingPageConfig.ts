import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.itemTypes.create(
    {
      id: 'B-WUKOLFR1ebqT5tadPcSw',
      name: '\uD83D\uDCDA Landing Page - Config',
      api_key: 'landing_page_config',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'bV1LLRsxQRW6G11rIbDdrw'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.fields.create('B-WUKOLFR1ebqT5tadPcSw', {
    id: 'TdRMp00ISdW7_Tflq88mhg',
    label: 'Title',
    field_type: 'string',
    api_key: 'title',
    hint: 'The page title',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create SEO meta tags field "Seo" (`seo`) in block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.fields.create('B-WUKOLFR1ebqT5tadPcSw', {
    id: 'fJoD1-W-RzWVuy6ClfGL9g',
    label: 'Seo',
    field_type: 'seo',
    api_key: 'seo',
    validators: { title_length: { max: 60 }, description_length: { max: 160 } },
    appearance: {
      addons: [],
      editor: 'seo',
      parameters: {
        fields: ['title', 'description', 'image', 'no_index', 'twitter_card'],
        previews: [
          'google',
          'twitter',
          'facebook',
          'linkedin',
          'slack',
          'telegram',
          'whatsapp'
        ]
      }
    }
  })

  console.log(
    'Create Slug field "Handle" (`handle`) in block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.fields.create('B-WUKOLFR1ebqT5tadPcSw', {
    id: 'fXSUZiM_SIGco8LZliaSPg',
    label: 'Handle',
    field_type: 'slug',
    api_key: 'handle',
    validators: {
      slug_title_field: { title_field_id: 'TdRMp00ISdW7_Tflq88mhg' },
      slug_format: { predefined_pattern: 'webpage_slug' }
    },
    appearance: {
      addons: [],
      editor: 'slug',
      parameters: { url_prefix: '/lp/', placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Landing Page" (`landing_page`)'
  )
  await client.fields.update('LTIiw1fuRX6Sr2u2_tzWfw', {
    validators: {
      single_block_blocks: { item_types: ['B-WUKOLFR1ebqT5tadPcSw'] },
      required: {}
    }
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.itemTypes.update('B-WUKOLFR1ebqT5tadPcSw', {
    presentation_title_field: { id: 'TdRMp00ISdW7_Tflq88mhg', type: 'field' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Landing Page - Config" (`landing_page_config`)'
  )
  await client.schemaMenuItems.update('bV1LLRsxQRW6G11rIbDdrw', {
    position: 40
  })
}
