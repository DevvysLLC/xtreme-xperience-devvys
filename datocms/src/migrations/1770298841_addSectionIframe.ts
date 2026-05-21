import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.itemTypes.create(
    {
      id: 'frxUjrsTQx6FBwQ9nJRyAg',
      name: '\uD83D\uDDA5\uFE0F Section - Iframe',
      api_key: 'section_iframe',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'CQzjcS0HQaK7YmyHZHY1YQ'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'HL6RhknbSVy18wfzb-PF5g',
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
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'Rh-6Yxd8TwKOTg_7CK9Rgw',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '1 Column', value: '1-column' },
          { hint: '', label: '2 Columns', value: '2-column' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'MRSgyFzdTiGihv5lJW84tg',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'e6osFECxSpWMkr8fxJvJ6A',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'Ha502RR4TrS7BFxS7r5otw',
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
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'DiMyVAuuTlS5xp3QjN_Oaw',
    label: 'CTAs',
    field_type: 'rich_text',
    api_key: 'ctas',
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] },
      size: { min: 0, max: 2 }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: true }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Embed Code" (`embed_code`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'IHO-fOgrQQS3W2I1iNgoOA',
    label: 'Embed Code',
    field_type: 'text',
    api_key: 'embed_code',
    appearance: { addons: [], editor: 'markdown', parameters: { toolbar: [] } }
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
          'foSIpVN8RVeYKx6DoIYa0Q',
          'frxUjrsTQx6FBwQ9nJRyAg'
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "(DEPRECATED) HubSpot Form ID" (`form_hubspot_guid`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.update('Br0qSlFTQ7GgS8hpmrFYug', {
    label: '(DEPRECATED) HubSpot Form ID'
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.itemTypes.update('frxUjrsTQx6FBwQ9nJRyAg', {
    presentation_title_field: { id: 'Rh-6Yxd8TwKOTg_7CK9Rgw', type: 'field' }
  })
}
