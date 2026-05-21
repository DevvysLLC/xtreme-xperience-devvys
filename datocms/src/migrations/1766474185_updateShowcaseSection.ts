import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDCC5 Section - Location Picker" (`section_location_picker`)'
  )
  await client.itemTypes.create(
    {
      id: 'GZpT8my2QBeJcqfTPtCGIg',
      name: '\uD83D\uDCC5 Section - Location Picker',
      api_key: 'section_location_picker',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'NkMR4ttkSpa1msOvEUrL5Q'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDCC5 Section - Location Picker" (`section_location_picker`)'
  )
  await client.fields.create('GZpT8my2QBeJcqfTPtCGIg', {
    id: 'VNi7ysUSSQOJAUbfH4NYIw',
    label: 'Config',
    field_type: 'single_block',
    api_key: 'config',
    validators: {
      single_block_blocks: { item_types: ['QG68cRN5Tr6_-emTklhMAg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCC5 Section - Location Picker" (`section_location_picker`)'
  )
  await client.fields.create('GZpT8my2QBeJcqfTPtCGIg', {
    id: 'PiBpbwz-RyC1BWvyBYp9kQ',
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
    'Create Modular Content (Single block) field "Showcase Thumbnail" (`showcase_thumbnail`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'QPR6kdg4Rf6II2wlDov2Rw',
    label: 'Showcase Thumbnail',
    field_type: 'single_block',
    api_key: 'showcase_thumbnail',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Multiple blocks) field "Sections" (`sections`) in block model "\uD83D\uDCDA Page - Content" (`page_content`)'
  )
  await client.fields.update('YxX8gq2hSAKkbaqtuFQLzw', {
    validators: {
      rich_text_blocks: {
        item_types: [
          'ADb9Ui-VQsKHhq2GedmfUQ',
          'AZPnhsr2Q4igOR6l5pakWw',
          'Ab0NZm8lRqKUWrsvaWZ8dA',
          'Bd_J_3MrS6qpjlxzYbIssw',
          'Egiw2WiRQXGl65gNK9G6Rw',
          'ExGw39zgSKeKR9IDP14Rew',
          'FOo5sFWlS-6DEPY76lvhww',
          'GJtYJjxPQA2e5m38Hs8cug',
          'GZpT8my2QBeJcqfTPtCGIg',
          'HzciiYAMRyKOLx7CX69U9Q',
          'I6tUJOc9SA6B7fOaErBo1g',
          'LOTwpXWiSzq0KhK9NOlJ0w',
          'LudhX9NjTk65U2U1Q8dL1g',
          'MK-gWkLWTeGYg6-EzAoTQw',
          'MmYG4Gj7SECdAJwKKjsO8g',
          'M6Eqatu0Ro2A7VoCtBgRoQ',
          'NF7JVHsmQHuqIE3BUAUrmA',
          'OdJLte3sQRq8oT9SbSjY6A',
          'Qwc0SwomSyauTmZrlQ-fhg',
          'WU6ueJWZTfuxaFlXZDJy6w',
          'ZUG1JR-nTMmVDBkvK5HEBw',
          'aBPYjVj8T6KfjIrbrn5KKA',
          'ar7S0nqvTLiRuU7glh28Gg',
          'cS0F9pnjQSu4cV9RRoBvMg',
          'c2ZW9BjWQzaTcboXDWmD1A',
          'fEe3XtEfRrOrChEzbCSmHw',
          'fMMmhDjkQWm6LifdYSnc9Q',
          'foSIpVN8RVeYKx6DoIYa0Q'
        ]
      }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Showcase Thumbnail" (`showcase_thumbnail`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('QPR6kdg4Rf6II2wlDov2Rw', { position: 27 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDCC5 Section - Location Picker" (`section_location_picker`)'
  )
  await client.itemTypes.update('GZpT8my2QBeJcqfTPtCGIg', {
    presentation_title_field: { id: 'PiBpbwz-RyC1BWvyBYp9kQ', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.itemTypes.update('DBzu2ruuTDyK6arjZwLMkg', {
    name: '\uD83C\uDFCE\uFE0F Section - Supercar Grid Config'
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Location Picker" (`section_location_picker`)'
  )
  await client.schemaMenuItems.update('NkMR4ttkSpa1msOvEUrL5Q', {
    position: 64
  })
}
