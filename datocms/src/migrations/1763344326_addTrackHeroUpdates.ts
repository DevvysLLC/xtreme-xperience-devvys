import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.itemTypes.create(
    {
      id: 'ExGw39zgSKeKR9IDP14Rew',
      name: '\uD83D\uDEE3\uFE0F Section - Track Hero',
      api_key: 'section_track_hero',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'XJLB6OzWQpC1umD8tNwrpQ'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'euppLNarSLaUrbs8wdlQqg',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'ZLheP4jGSQ-P6Mk9ukdG_w',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'f1AQBUMIQ92Zb4TRf_MMVA',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'eCQ3euKDSAeTSUuNztirzw',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Single-line string field "Marquee" (`marquee`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'bGfpCZdmS6uQyBU30vHXaA',
    label: 'Marquee',
    field_type: 'string',
    api_key: 'marquee',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'JhudxOrPRvK8pRyG16940w',
    label: 'Gradient',
    field_type: 'single_block',
    api_key: 'gradient',
    validators: {
      single_block_blocks: { item_types: ['TOfj9tVmS320OVdSwEzVLQ'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'MzNOkB1iTSup5fsY8piGew',
    label: 'Media',
    field_type: 'single_block',
    api_key: 'media',
    validators: {
      single_block_blocks: { item_types: ['C798bqdmSeucDjFGRDhzhA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'V0WR8j8YS6enFNraziOfHA',
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
    'Create Boolean field "Show Events" (`show_events`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'Qhjvt-cQTIu_FHoy01l9nA',
    label: 'Show Events',
    field_type: 'boolean',
    api_key: 'show_events',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
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

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.itemTypes.update('ExGw39zgSKeKR9IDP14Rew', {
    presentation_title_field: { id: 'ZLheP4jGSQ-P6Mk9ukdG_w', type: 'field' }
  })
}
