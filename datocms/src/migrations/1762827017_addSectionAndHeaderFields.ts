import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83C\uDFE0 Header - Content" (`header_content`)'
  )
  await client.itemTypes.create(
    {
      id: 'EOpMqUx8QzO1biLfK2Y-6A',
      name: '\uD83C\uDFE0 Header - Content',
      api_key: 'header_content',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'N7Wx00U-Rdek7uC-XmpOAQ'
    }
  )

  console.log(
    'Create block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.itemTypes.create(
    {
      id: 'GJ1M9fYvRRa9kk1fiBBjeQ',
      name: '\u2699\uFE0F Core - Announcement',
      api_key: 'core_announcement',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'OWE4DLnxR0OXvszI-pMxWg'
    }
  )

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.itemTypes.create(
    {
      id: 'L7u51GASQIakwH0d9Vq3yg',
      name: '\uD83D\uDDA5\uFE0F Section - Announcement Bar',
      api_key: 'section_announcement_bar',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'NDVWFKHmTWewQe09kRxH0A'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Multiple blocks) field "Sections" (`sections`) in block model "\uD83C\uDFE0 Header - Content" (`header_content`)'
  )
  await client.fields.create('EOpMqUx8QzO1biLfK2Y-6A', {
    id: 'QT475tDVTw25ouVgnLflMw',
    label: 'Sections',
    field_type: 'rich_text',
    api_key: 'sections',
    validators: {
      rich_text_blocks: { item_types: ['L7u51GASQIakwH0d9Vq3yg'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Title" (`title`) in block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.fields.create('GJ1M9fYvRRa9kk1fiBBjeQ', {
    id: 'X-5-cXQUSb2IorckJOH4qg',
    label: 'Title',
    field_type: 'text',
    api_key: 'title',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.fields.create('L7u51GASQIakwH0d9Vq3yg', {
    id: 'QmzwQGnCS-66Zhm2kfKbdA',
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
    'Create Modular Content (Multiple blocks) field "Cards" (`cards`) in block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.fields.create('L7u51GASQIakwH0d9Vq3yg', {
    id: 'Tyo2BsOQTW6BCTP5h2W3ZA',
    label: 'Cards',
    field_type: 'rich_text',
    api_key: 'cards',
    validators: {
      rich_text_blocks: { item_types: ['GJ1M9fYvRRa9kk1fiBBjeQ'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Content" (`content`) in model "\uD83C\uDFE0 Header" (`header`)'
  )
  await client.fields.create('AGNCKA6JTCKVfXu0_z0SVw', {
    id: 'THZ8fRR1T1C1Rvj24-SwBA',
    label: 'Content',
    field_type: 'single_block',
    api_key: 'content',
    validators: {
      single_block_blocks: { item_types: ['EOpMqUx8QzO1biLfK2Y-6A'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Date field "End Date" (`end_date`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'ELeB5PpqSduhrywaqnX0ZA',
    label: 'End Date',
    field_type: 'date',
    api_key: 'end_date',
    appearance: { addons: [], editor: 'date_picker', parameters: {} }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'DSTJbXyYTzyEHdP71w1tDw',
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
      parameters: { start_collapsed: false }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Multiple-paragraph text field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.destroy('DHBS7lNESWagOh7rawJ7dQ')

  console.log(
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.create('fEe3XtEfRrOrChEzbCSmHw', {
    id: 'HPg13-tjTiqlBEOpqn83hA',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.create('fEe3XtEfRrOrChEzbCSmHw', {
    id: 'dNh1sPRZRUm4-VD4CaCfkQ',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Subtitle" (`subtitle`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.update('PMay_h2zRnOXw2_-tcd2GA', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Update Date field "End Date" (`end_date`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('ELeB5PpqSduhrywaqnX0ZA', { position: 4 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Split Callout" (`section_split_callout`)'
  )
  await client.fields.update('Kt4OUnPoTM6y_-1HNYRDAA', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Update Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.update('HPg13-tjTiqlBEOpqn83hA', { position: 3 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.update('dNh1sPRZRUm4-VD4CaCfkQ', { position: 4 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFE0 Header - Content" (`header_content`)'
  )
  await client.schemaMenuItems.update('N7Wx00U-Rdek7uC-XmpOAQ', {
    position: 17
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.schemaMenuItems.update('NDVWFKHmTWewQe09kRxH0A', {
    position: 49
  })
}
