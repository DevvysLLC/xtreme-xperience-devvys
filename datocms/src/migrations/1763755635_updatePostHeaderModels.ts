import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log('Create model "\u270F\uFE0F Category" (`category`)')
  await client.itemTypes.create(
    {
      id: 'AxGxWw59T2ekBCXzqr5Kww',
      name: '\u270F\uFE0F Category',
      api_key: 'category',
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'X3IkFB1-T_mwAyr_P75-7A'
    }
  )

  console.log(
    'Create block model "\u270F\uFE0F Category - Model" (`category_model`)'
  )
  await client.itemTypes.create(
    {
      id: 'Vrkau1NcQBqozAZQtQ6-nA',
      name: '\u270F\uFE0F Category - Model',
      api_key: 'category_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'A0UsKKItSmaThF0v-vo-NA'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in model "\u270F\uFE0F Category" (`category`)'
  )
  await client.fields.create('AxGxWw59T2ekBCXzqr5Kww', {
    id: 'fV-MtvxzTTKv924aFWtJ3A',
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
    'Create Modular Content (Single block) field "Model" (`model`) in model "\u270F\uFE0F Category" (`category`)'
  )
  await client.fields.create('AxGxWw59T2ekBCXzqr5Kww', {
    id: 'cY9ZBIjyRk67NwlCG0oQwA',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['Vrkau1NcQBqozAZQtQ6-nA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    },
    deep_filtering_enabled: true
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\u270F\uFE0F Category - Model" (`category_model`)'
  )
  await client.fields.create('Vrkau1NcQBqozAZQtQ6-nA', {
    id: 'bov4h1sYR-qAUZw1CFZ6nA',
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
    'Create Slug field "Handle" (`handle`) in block model "\u270F\uFE0F Category - Model" (`category_model`)'
  )
  await client.fields.create('Vrkau1NcQBqozAZQtQ6-nA', {
    id: 'NB3uAu4BSeisxGwQ-8fX6g',
    label: 'Handle',
    field_type: 'slug',
    api_key: 'handle',
    validators: {
      slug_title_field: { title_field_id: 'bov4h1sYR-qAUZw1CFZ6nA' },
      slug_format: { predefined_pattern: 'webpage_slug' }
    },
    appearance: {
      addons: [],
      editor: 'slug',
      parameters: { url_prefix: '/blog/category/', placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'OwcJ9ncZRNKO6iaKsB6OVA',
    label: 'Gradient',
    field_type: 'single_block',
    api_key: 'gradient',
    validators: {
      single_block_blocks: { item_types: ['TOfj9tVmS320OVdSwEzVLQ'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: true }
    }
  })

  console.log(
    'Create Single link field "Featured Mobile Navigation" (`featured_mobile_navigation`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'YVF6TmMMS_iP5eyS9Ce9DQ',
    label: 'Featured Mobile Navigation',
    field_type: 'link',
    api_key: 'featured_mobile_navigation',
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
    'Create Modular Content (Single block) field "Link" (`link`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.create('HjDd_vQURziXWonrnL8mSw', {
    id: 'WZk9HNpSRcuW-OQT5pv5fQ',
    label: 'Link',
    field_type: 'single_block',
    api_key: 'link',
    validators: {
      single_block_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Multiple links field "Categories" (`categories`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.create('HjDd_vQURziXWonrnL8mSw', {
    id: 'RkWVbHNOSMau-hbdO2v_kA',
    label: 'Categories',
    field_type: 'links',
    api_key: 'categories',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['AxGxWw59T2ekBCXzqr5Kww']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Icon" (`icon`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('GHNsbpyNRKCZobLzPojTxg', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Arrow right down', value: 'arrow-right-down' },
          { hint: '', label: 'Arrow right', value: 'arrow-right' }
        ]
      }
    }
  })

  console.log(
    'Update Single link field "Featured Mobile Navigation" (`featured_mobile_navigation`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.update('YVF6TmMMS_iP5eyS9Ce9DQ', { position: 3 })

  console.log(
    'Update Modular Content (Single block) field "Link" (`link`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.update('WZk9HNpSRcuW-OQT5pv5fQ', { position: 3 })

  console.log(
    'Update Modular Content (Single block) field "Featured Media" (`featured_media`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.update('Ex_GKKcoS56Ihknypt6zWg', {
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    }
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
          'SHn2LwXwS1KBDPW0hCpfJg',
          'Waja7LEiS9Se3JoNMhnZQg',
          'ZJcRHg4SSX-WyCUJTg52HQ'
        ]
      }
    },
    appearance: {
      addons: [],
      editor: 'structured_text',
      parameters: {
        marks: [
          'strong',
          'emphasis',
          'underline',
          'strikethrough',
          'highlight'
        ],
        nodes: ['blockquote', 'heading', 'link', 'list', 'thematicBreak'],
        heading_levels: [2, 3, 4, 5, 6],
        blocks_start_collapsed: false,
        show_links_meta_editor: false,
        show_links_target_blank: true
      }
    }
  })

  console.log('Finalize models/block models')

  console.log('Update model "\u270F\uFE0F Category" (`category`)')
  await client.itemTypes.update('AxGxWw59T2ekBCXzqr5Kww', {
    presentation_title_field: { id: 'fV-MtvxzTTKv924aFWtJ3A', type: 'field' },
    title_field: { id: 'fV-MtvxzTTKv924aFWtJ3A', type: 'field' }
  })

  console.log(
    'Update block model "\u270F\uFE0F Category - Model" (`category_model`)'
  )
  await client.itemTypes.update('Vrkau1NcQBqozAZQtQ6-nA', {
    presentation_title_field: { id: 'bov4h1sYR-qAUZw1CFZ6nA', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Create menu item "\u270F\uFE0F Category"')
  await client.menuItems.create({
    id: 'cAWLaWnwQZah2WfmNg4RGg',
    label: '\u270F\uFE0F Category',
    item_type: { id: 'AxGxWw59T2ekBCXzqr5Kww', type: 'item_type' }
  })

  console.log('Update menu item "\u270F\uFE0F Post"')
  await client.menuItems.update('Ojhd_c9RRpCB0KcWjQZwvA', { position: 16 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\u270F\uFE0F Category - Model" (`category_model`)'
  )
  await client.schemaMenuItems.update('A0UsKKItSmaThF0v-vo-NA', {
    position: 23
  })
}
