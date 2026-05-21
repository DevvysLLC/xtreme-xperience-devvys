import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.itemTypes.create(
    {
      id: 'Bd_J_3MrS6qpjlxzYbIssw',
      name: '\uD83D\uDDA5\uFE0F Section - Contact',
      api_key: 'section_contact',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'MNVeqdNxTUKImsN0Mis2jw'
    }
  )

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.itemTypes.create(
    {
      id: 'HzciiYAMRyKOLx7CX69U9Q',
      name: '\uD83D\uDDA5\uFE0F Section - Accordion',
      api_key: 'section_accordion',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'HN3rShX8Sh2LY0WfG8EtIw'
    }
  )

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.itemTypes.create(
    {
      id: 'LOTwpXWiSzq0KhK9NOlJ0w',
      name: '\uD83D\uDDA5\uFE0F Section - Policies',
      api_key: 'section_policy',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'WdXhe1LFQQWPS1rb1IfMsg'
    }
  )

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.itemTypes.create(
    {
      id: 'M6Eqatu0Ro2A7VoCtBgRoQ',
      name: '\uD83D\uDDA5\uFE0F Section - Highlight',
      api_key: 'section_highlight',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'UuE5aXNfSpSyM72KBLTfzQ'
    }
  )

  console.log(
    'Create block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.itemTypes.create(
    {
      id: 'WU6ueJWZTfuxaFlXZDJy6w',
      name: '\uD83C\uDFCE\uFE0F Section - Supercar brand hero',
      api_key: 'section_supercar_brand_hero',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'JEUgkHJDQJKcT_nmst_UqQ'
    }
  )

  console.log('Create model "\u270F\uFE0F Policy" (`policy`)')
  await client.itemTypes.create(
    {
      id: 'XIaoTjJISUKVzkvgENOS3A',
      name: '\u270F\uFE0F Policy',
      api_key: 'policy',
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'G8pl3AWVQd-bI4w9owMTNQ'
    }
  )

  console.log(
    'Create block model "\u270F\uFE0F Policy - Model" (`policy_model`)'
  )
  await client.itemTypes.create(
    {
      id: 'XKTPVjwpTfSXcRyRcDL2-Q',
      name: '\u270F\uFE0F Policy - Model',
      api_key: 'policy_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'WHHCSsT9R025MJmi8lTWOw'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'ACiRdil3RtybbGDpnRylJA',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'Qmoe0X61RZqPFNDiDcQvVg',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'HGR2ROTtQsuW6qvUSZVUUQ',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'FuskvUVKTpuOhPR2Wsikaw',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'UAQraOU2ScuQ5jklvfpTuQ',
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
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'VbepcDoLSn2Qv1lTFFvgxg',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Default', value: 'default' },
          { hint: '', label: 'Reverse', value: 'reverse' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'CJtKtn2ET3Oei9GHnQAR-w',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'A3lSGzpPT4OTqT223aI0JQ',
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
    'Create Modular Content (Multiple blocks) field "Accordion" (`accordion`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'XNsjyhMqSw2oXAmZ8U4sVA',
    label: 'Accordion',
    field_type: 'rich_text',
    api_key: 'accordion',
    validators: {
      rich_text_blocks: { item_types: ['AovD4daPRwKBgOEY-nl6LQ'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.fields.create('HzciiYAMRyKOLx7CX69U9Q', {
    id: 'feGCdJYJTH2TrGyiPZzjIQ',
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

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.create('LOTwpXWiSzq0KhK9NOlJ0w', {
    id: 'GHBIV5HUSy6Iaj_8vk9EoA',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.create('LOTwpXWiSzq0KhK9NOlJ0w', {
    id: 'XQfXsp8PQ2-mxMDPBfnL8w',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.create('LOTwpXWiSzq0KhK9NOlJ0w', {
    id: 'MV_VY2BMShyYf4akFsztZg',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.create('LOTwpXWiSzq0KhK9NOlJ0w', {
    id: 'CV1JemgBSz2uIb262QkeNQ',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Multiple links field "Policies" (`policies`) in block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.fields.create('LOTwpXWiSzq0KhK9NOlJ0w', {
    id: 'c-VcCwoJTEmI_Vt3pvGObA',
    label: 'Policies',
    field_type: 'links',
    api_key: 'policies',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['XIaoTjJISUKVzkvgENOS3A']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'JUMFiB0VTYOUmri_S86HHg',
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
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'LyxsDxPOTsKpVgMV03JjBA',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Default', value: 'default' },
          { hint: '', label: 'Reverse', value: 'reverse' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'RS9jDXJAQmqFrFoPL84Xgg',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'Y19vVdw-SMy2kVWokx3lfQ',
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
    'Create Modular Content (Multiple blocks) field "Highlight" (`highlight`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'aDoe6yo_TUqTLq7ZKNhNTw',
    label: 'Highlight',
    field_type: 'rich_text',
    api_key: 'highlight',
    validators: {
      rich_text_blocks: { item_types: ['fCe0HjpPR_irS7VGM4lG2A'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'Nhqcqj-URX6IXOKfPhLkXA',
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

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'FLNqJ5tCTACQ57c7J3ZQeQ',
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
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'XlOecM5DSLSxfxr98UT-Dw',
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
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'PBLWDRKQSLSe_YLlR8TsVA',
    label: 'Media',
    field_type: 'single_block',
    api_key: 'media',
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single asset field "Logo" (`logo`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'KY5TzG6tRbG4zXFJ4PSydg',
    label: 'Logo',
    field_type: 'file',
    api_key: 'logo',
    appearance: { addons: [], editor: 'file', parameters: {} }
  })

  console.log(
    'Create Single asset field "Audio" (`audio`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'SrAInfX0RvmAJnruDJ63eQ',
    label: 'Audio',
    field_type: 'file',
    api_key: 'audio',
    validators: { extension: { extensions: ['mp4'] } },
    appearance: { addons: [], editor: 'file', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in model "\u270F\uFE0F Policy" (`policy`)'
  )
  await client.fields.create('XIaoTjJISUKVzkvgENOS3A', {
    id: 'E10OrP9tRSaqxJpz__QFrQ',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Model" (`model`) in model "\u270F\uFE0F Policy" (`policy`)'
  )
  await client.fields.create('XIaoTjJISUKVzkvgENOS3A', {
    id: 'BPymefSfTyeG6guaiPR64A',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['XKTPVjwpTfSXcRyRcDL2-Q'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\u270F\uFE0F Policy - Model" (`policy_model`)'
  )
  await client.fields.create('XKTPVjwpTfSXcRyRcDL2-Q', {
    id: 'ZcZVs2qDTgW1rWUtMsIChw',
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
    'Create Multiple-paragraph text field "Body" (`body`) in block model "\u270F\uFE0F Policy - Model" (`policy_model`)'
  )
  await client.fields.create('XKTPVjwpTfSXcRyRcDL2-Q', {
    id: 'WYY9CTw0R-CCNC-o99fPZA',
    label: 'Body',
    field_type: 'text',
    api_key: 'body',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: [
          'bold',
          'heading',
          'italic',
          'link',
          'ordered_list',
          'unordered_list'
        ]
      }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.create('C798bqdmSeucDjFGRDhzhA', {
    id: 'EXvy09hjT_KVw4Ma-qP5zg',
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
    'Create Single link field "Quick Links" (`quick_links`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'B65qUAJbTlaO0TwowdKDgw',
    label: 'Quick Links',
    field_type: 'link',
    api_key: 'quick_links',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['dnuYSe4hTg2GK6p5aRlZZQ']
      }
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Relative Paths" (`relative_paths`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'TOznVDwXSS-g1-XYIF3ScA',
    label: 'Relative Paths',
    field_type: 'string',
    api_key: 'relative_paths',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    default_value:
      'A comma separated list of paths to adjust header position on'
  })

  console.log(
    'Create Boolean field "Add Bottom Border" (`add_bottom_border`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.create('QG68cRN5Tr6_-emTklhMAg', {
    id: 'e-9tfZDISfucJReHozJzoA',
    label: 'Add Bottom Border',
    field_type: 'boolean',
    api_key: 'add_bottom_border',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Horizontal Alignment" (`horizontal_alignment`) in block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.fields.create('X22zvr4MTi21gMhwRGSG-A', {
    id: 'Is0OtcI2TL6ivE7TWhI3IQ',
    label: 'Horizontal Alignment',
    field_type: 'string',
    api_key: 'horizontal_alignment',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Left', value: 'start' },
          { hint: '', label: 'Center', value: 'center' },
          { hint: '', label: 'Right', value: 'end' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Description" (`description`) in block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.fields.create('X22zvr4MTi21gMhwRGSG-A', {
    id: 'UuSlYDQoTJOBD3YGMxJKdg',
    label: 'Description',
    field_type: 'string',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'WOETeZRsRpmgQt273b6TdA',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Default', value: 'default' },
          { hint: '', label: 'Reverse', value: 'reverse' }
        ]
      }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'Fdm5EXnrSP2e_yREjJRB9g',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Multiple-paragraph text field "Desciption" (`desciption`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.destroy('I-lt95MCSbKQoj_dkVJysg')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Post" (`post`)'
  )
  await client.fields.update('TcxzsE5NTOu952EXSdsSog', {
    validators: {
      single_block_blocks: { item_types: ['A_gs2Z6HSgafR1zUnwIS7Q'] },
      required: {}
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Gradient" (`gradient`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.update('EXvy09hjT_KVw4Ma-qP5zg', { position: 5 })

  console.log(
    'Update Single link field "Quick Links" (`quick_links`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.update('B65qUAJbTlaO0TwowdKDgw', { position: 2 })

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
          'SHn2LwXwS1KBDPW0hCpfJg',
          'Waja7LEiS9Se3JoNMhnZQg',
          'ZJcRHg4SSX-WyCUJTg52HQ'
        ]
      }
    }
  })

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
          'WU6ueJWZTfuxaFlXZDJy6w',
          'ZUG1JR-nTMmVDBkvK5HEBw',
          'c2ZW9BjWQzaTcboXDWmD1A',
          'fEe3XtEfRrOrChEzbCSmHw',
          'fMMmhDjkQWm6LifdYSnc9Q',
          'foSIpVN8RVeYKx6DoIYa0Q'
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "Icon" (`icon`) in block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.fields.update('ZpHbgnA1Si-Uz3esffCORw', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '3D', value: '3d' },
          { hint: '', label: 'Account', value: 'account' },
          { hint: '', label: 'Check', value: 'check' },
          { hint: '', label: 'Date', value: 'date' },
          { hint: '', label: 'Double Column', value: 'double-column' },
          { hint: '', label: 'Car', value: 'car' },
          { hint: '', label: 'Heart', value: 'heart' },
          { hint: '', label: 'Location', value: 'location' },
          { hint: '', label: 'Plus', value: 'plus' },
          { hint: '', label: 'Premium', value: 'premium' },
          { hint: '', label: 'Reviews', value: 'reviews' },
          { hint: '', label: 'Security', value: 'security' },
          { hint: '', label: 'Shipping', value: 'shipping' },
          { hint: '', label: 'Single Column', value: 'single-column' },
          { hint: '', label: 'Travel', value: 'travel' }
        ]
      }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Page" (`page`)'
  )
  await client.fields.update('P0seb2FhRbSQluAbsOoxPQ', {
    validators: {
      single_block_blocks: { item_types: ['R-s6MDDjS76ugl5WsS5uzQ'] },
      required: {}
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83C\uDFCE\uFE0F Supercar" (`supercar`)'
  )
  await client.fields.update('FePMc8CJQHyM3FXuEefPaQ', {
    validators: {
      single_block_blocks: { item_types: ['NJaYgfWSQdGE_5symrHhfg'] },
      required: {}
    }
  })

  console.log(
    'Update Single-line string field "Horizontal Alignment" (`horizontal_alignment`) in block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.fields.update('Is0OtcI2TL6ivE7TWhI3IQ', { position: 2 })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83D\uDEE3\uFE0F Track" (`track`)'
  )
  await client.fields.update('Jv9-D6zZRYuNPfoz8mYPMA', {
    validators: {
      single_block_blocks: { item_types: ['GpezlzpbSo2kuWKtSZBfpg'] },
      required: {}
    }
  })

  console.log(
    'Update Single-line string field "Layout" (`layout`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.update('WOETeZRsRpmgQt273b6TdA', { position: 2 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.update('Fdm5EXnrSP2e_yREjJRB9g', { position: 5 })

  console.log(
    'Update Multiple-paragraph text field "Body" (`body`) in block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.fields.update('Shxvd3EhRG2oYIw6BIr-Ow', { position: 3 })

  console.log('Destroy models/block models')

  console.log(
    'Delete block model "\uD83D\uDDA5\uFE0F Section - Media Callout Grid" (`section_media_callout_grid`)'
  )
  await client.itemTypes.destroy('W3FN0L1NRy27Q6-t8dwFHg', {
    skip_menu_items_deletion: true
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.itemTypes.update('Bd_J_3MrS6qpjlxzYbIssw', {
    presentation_title_field: { id: 'Qmoe0X61RZqPFNDiDcQvVg', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.itemTypes.update('HzciiYAMRyKOLx7CX69U9Q', {
    presentation_title_field: { id: 'CJtKtn2ET3Oei9GHnQAR-w', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.itemTypes.update('LOTwpXWiSzq0KhK9NOlJ0w', {
    presentation_title_field: { id: 'XQfXsp8PQ2-mxMDPBfnL8w', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.itemTypes.update('M6Eqatu0Ro2A7VoCtBgRoQ', {
    presentation_title_field: { id: 'RS9jDXJAQmqFrFoPL84Xgg', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.itemTypes.update('WU6ueJWZTfuxaFlXZDJy6w', {
    presentation_image_field: { id: 'KY5TzG6tRbG4zXFJ4PSydg', type: 'field' }
  })

  console.log('Update model "\u270F\uFE0F Policy" (`policy`)')
  await client.itemTypes.update('XIaoTjJISUKVzkvgENOS3A', {
    presentation_title_field: { id: 'E10OrP9tRSaqxJpz__QFrQ', type: 'field' },
    title_field: { id: 'E10OrP9tRSaqxJpz__QFrQ', type: 'field' }
  })

  console.log(
    'Update block model "\u270F\uFE0F Policy - Model" (`policy_model`)'
  )
  await client.itemTypes.update('XKTPVjwpTfSXcRyRcDL2-Q', {
    presentation_title_field: { id: 'ZcZVs2qDTgW1rWUtMsIChw', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.itemTypes.update('HReTypuARpuNUHBYn52PmQ', {
    presentation_title_field: { id: 'TOznVDwXSS-g1-XYIF3ScA', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Create menu item "\u270F\uFE0F Policy"')
  await client.menuItems.create({
    id: 'clwBsWn-Q4qSzwBBflQL_w',
    label: '\u270F\uFE0F Policy',
    item_type: { id: 'XIaoTjJISUKVzkvgENOS3A', type: 'item_type' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Policy" (`policy`)'
  )
  await client.schemaMenuItems.update('G8pl3AWVQd-bI4w9owMTNQ', {
    position: 15
  })

  console.log(
    'Update block schema menu item for block model "\u270F\uFE0F Policy - Model" (`policy_model`)'
  )
  await client.schemaMenuItems.update('WHHCSsT9R025MJmi8lTWOw', {
    position: 25
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.schemaMenuItems.update('UuE5aXNfSpSyM72KBLTfzQ', {
    position: 49
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.schemaMenuItems.update('HN3rShX8Sh2LY0WfG8EtIw', {
    position: 48
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.schemaMenuItems.update('WdXhe1LFQQWPS1rb1IfMsg', {
    position: 51
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.schemaMenuItems.update('MNVeqdNxTUKImsN0Mis2jw', {
    position: 52
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar brand hero" (`section_supercar_brand_hero`)'
  )
  await client.schemaMenuItems.update('JEUgkHJDQJKcT_nmst_UqQ', {
    position: 63
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.schemaMenuItems.update('TmoxCsx8Ri-AUf_nsioMaA', {
    position: 81
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.schemaMenuItems.update('B1fbLr_bQXeL4dZnPObTRw', {
    position: 75
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Badge" (`core_badge`)'
  )
  await client.schemaMenuItems.update('WRNz9vAbTses6Y5eqLgWWQ', {
    position: 82
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Image" (`core_image`)'
  )
  await client.schemaMenuItems.update('Qk5_eLN3Tu6dM818aKGYUw', {
    position: 73
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.schemaMenuItems.update('N89P5xHZRc2NixLTrQkaTg', {
    position: 72
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.schemaMenuItems.update('Vk5Kq8TjR7yp2Oaf-RRAtw', {
    position: 74
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.schemaMenuItems.update('fzVePPv7Q6mMscnX3V8yIw', {
    position: 77
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.schemaMenuItems.update('PhOgOysiT9uPQAw-gT4GGQ', {
    position: 79
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.schemaMenuItems.update('OWE4DLnxR0OXvszI-pMxWg', {
    position: 84
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.schemaMenuItems.update('C8FUntmpRDS_26VBlz8apQ', {
    position: 78
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Post" (`post`)'
  )
  await client.schemaMenuItems.update('DyHShJ8BRmaWXMxFVOXU5A', {
    position: 83
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.schemaMenuItems.update('IK9CCfydQY2GfTtyDHfrdA', {
    position: 65
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.schemaMenuItems.update('cWJzrGoIRjurl1OjbyaDSQ', {
    position: 64
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.schemaMenuItems.update('Q4v5wACvQxS1aCQtnXZd5Q', {
    position: 68
  })

  console.log(
    'Update block schema menu item for block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.schemaMenuItems.update('U1YM8hH8S5W_dXXCt7i81A', {
    position: 26
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.schemaMenuItems.update('LvNCw6B_Siu0ieaTCFoPuw', {
    position: 69
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.schemaMenuItems.update('flHBGeiDRk-pOxzxqgkxTg', {
    position: 58
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.schemaMenuItems.update('NDVWFKHmTWewQe09kRxH0A', {
    position: 56
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.schemaMenuItems.update('AIs2wUSHTAKZaMxGRU8xEQ', {
    position: 61
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.schemaMenuItems.update('ZGpB5V7uTc-_uRae929nkA', {
    position: 59
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.schemaMenuItems.update('CKgon9kATHWDBe29HpQ0SQ', {
    position: 57
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.schemaMenuItems.update('S1ProRfKRk2PK3SAlZZOqg', {
    position: 60
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - USP" (`section_usp`)'
  )
  await client.schemaMenuItems.update('P32ltwDgRca-MXkk7wr0tg', {
    position: 54
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.schemaMenuItems.update('IjEYvwmsTImztSNtOpOFdw', {
    position: 53
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.schemaMenuItems.update('Wd6VR9ZRSs2hz0PH6NuZHw', {
    position: 50
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.schemaMenuItems.update('IhHlEBT4TyG5M7xPE0DWLw', {
    position: 47
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Press Brand Grid" (`section_press_brand_grid`)'
  )
  await client.schemaMenuItems.update('TCxV-xQXQXGH_vbONl406A', {
    position: 46
  })
}
