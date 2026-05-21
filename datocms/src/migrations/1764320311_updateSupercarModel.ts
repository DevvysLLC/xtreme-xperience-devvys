import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.itemTypes.create(
    {
      id: 'DBzu2ruuTDyK6arjZwLMkg',
      name: 'Section - Supercar Grid Config',
      api_key: 'section_supercar_grid_config',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'Quw9Nv9pTn-qUM2cSM0mBg'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Header horizontal alignment" (`header_horizontal_alignment`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'LhTk9pPnRnuJUR6JBOKihQ',
    label: 'Header horizontal alignment',
    field_type: 'string',
    api_key: 'header_horizontal_alignment',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Left', value: 'left' },
          { hint: '', label: 'Center', value: 'center' },
          { hint: '', label: 'Right', value: 'right' }
        ]
      }
    },
    default_value: 'left'
  })

  console.log(
    'Create Boolean field "Header Border" (`header_border`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'dsEKFNyQSw6x9RoIZTY6nw',
    label: 'Header Border',
    field_type: 'boolean',
    api_key: 'header_border',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Show Filters" (`show_filters`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'Gw_d5JaqSUq79n4uspyQyQ',
    label: 'Show Filters',
    field_type: 'boolean',
    api_key: 'show_filters',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Card Type" (`card_type`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'N7NqigkMSrGEwhDg_kcpbA',
    label: 'Card Type',
    field_type: 'string',
    api_key: 'card_type',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Simple', value: 'simple' },
          { hint: '', label: 'Statistics', value: 'stats' }
        ]
      }
    },
    default_value: 'simple'
  })

  console.log(
    'Create Single-line string field "Section Background Color" (`section_background_color`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'ZF1fkxP6R62Na53g-_XnAw',
    label: 'Section Background Color',
    field_type: 'string',
    api_key: 'section_background_color',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'White', value: 'white' },
          { hint: '', label: 'Carrara', value: 'carrara' }
        ]
      }
    },
    default_value: 'white'
  })

  console.log(
    'Create Single-line string field "Card Background Color" (`card_background_color`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'PNeOyr7HRL69nFu8BpQgNQ',
    label: 'Card Background Color',
    field_type: 'string',
    api_key: 'card_background_color',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'White', value: 'white' },
          { hint: '', label: 'White 50', value: 'white-50' },
          { hint: '', label: 'Gray 50', value: 'gray-50' }
        ]
      }
    },
    default_value: 'white'
  })

  console.log(
    'Create Modular Content (Single block) field "Supercar Grid Config" (`supercar_grid_config`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.create('MmYG4Gj7SECdAJwKKjsO8g', {
    id: 'XW1eoDXTRaqi0hfeYAmMLQ',
    label: 'Supercar Grid Config',
    field_type: 'single_block',
    api_key: 'supercar_grid_config',
    validators: {
      single_block_blocks: { item_types: ['DBzu2ruuTDyK6arjZwLMkg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.create('MmYG4Gj7SECdAJwKKjsO8g', {
    id: 'Yxjc3vRgR5Obx1_JuBVR2g',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.create('MmYG4Gj7SECdAJwKKjsO8g', {
    id: 'EeM5fys4R56jjEqOfVYwSA',
    label: 'CTAs',
    field_type: 'rich_text',
    api_key: 'ctas',
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Tagline" (`tagline`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'TtS8fcRDTQGUev16oWhKzQ',
    label: 'Tagline',
    field_type: 'text',
    api_key: 'tagline',
    hint: 'Used for Multicar cards title',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Excerpt" (`excerpt`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'dSfCLJ0tSoqDK9VuUvdg6Q',
    label: 'Excerpt',
    field_type: 'text',
    api_key: 'excerpt',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Boolean field "Show Filters" (`show_filters`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.destroy('GtN2f70iT1CkiH5hh2TiDA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Supercar Grid Config" (`supercar_grid_config`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.update('XW1eoDXTRaqi0hfeYAmMLQ', { position: 2 })

  console.log(
    'Update Multiple links field "Supercars" (`supercars`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.update('VVYcY9LfQLKlrLYk_5QuhA', { position: 5 })

  console.log(
    'Update Multiple-paragraph text field "Tagline" (`tagline`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('TtS8fcRDTQGUev16oWhKzQ', { position: 4 })

  console.log(
    'Update Multiple-paragraph text field "Excerpt" (`excerpt`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('dSfCLJ0tSoqDK9VuUvdg6Q', { position: 20 })

  console.log(
    'Update Single asset field "Audio" (`audio`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.update('SrAInfX0RvmAJnruDJ63eQ', {
    validators: { extension: { extensions: ['mp3', 'mp4'] } }
  })

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('d9LtsjhJR4uAmJNSfaqA7g', {
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    }
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.itemTypes.update('DBzu2ruuTDyK6arjZwLMkg', {
    presentation_title_field: { id: 'LhTk9pPnRnuJUR6JBOKihQ', type: 'field' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.schemaMenuItems.update('Quw9Nv9pTn-qUM2cSM0mBg', {
    position: 66
  })
}
