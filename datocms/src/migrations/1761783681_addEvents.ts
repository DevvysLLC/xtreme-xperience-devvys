import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.itemTypes.create(
    {
      id: 'TOfj9tVmS320OVdSwEzVLQ',
      name: '\u2699\uFE0F Core - Gradient',
      api_key: 'core_gradient',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'cWJzrGoIRjurl1OjbyaDSQ'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Boolean field "Enabled" (`enabled`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.create('TOfj9tVmS320OVdSwEzVLQ', {
    id: 'GefLSHAVQTWhngpQx8N0cw',
    label: 'Enabled',
    field_type: 'boolean',
    api_key: 'enabled',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Direction" (`direction`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.create('TOfj9tVmS320OVdSwEzVLQ', {
    id: 'Z3TktVd_TjSYqT6jUSb8QQ',
    label: 'Direction',
    field_type: 'string',
    api_key: 'direction',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Top', value: 'top' },
          { hint: '', label: 'Right', value: 'right' },
          { hint: '', label: 'Bottom', value: 'bottom' },
          { hint: '', label: 'Left', value: 'left' }
        ]
      }
    }
  })

  console.log(
    'Create Color field "Start Color" (`start_color`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.create('TOfj9tVmS320OVdSwEzVLQ', {
    id: 'DfxiIJc6RZSHH-p2BgHx3A',
    label: 'Start Color',
    field_type: 'color',
    api_key: 'start_color',
    appearance: {
      addons: [],
      editor: 'color_picker',
      parameters: { enable_alpha: false, preset_colors: [] }
    }
  })

  console.log(
    'Create Color field "End Color" (`end_color`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.create('TOfj9tVmS320OVdSwEzVLQ', {
    id: 'BTexZ7rlTqa6Z4TpE4DmJQ',
    label: 'End Color',
    field_type: 'color',
    api_key: 'end_color',
    appearance: {
      addons: [],
      editor: 'color_picker',
      parameters: { enable_alpha: false, preset_colors: [] }
    }
  })

  console.log(
    'Create Single-line string field "Path" (`path`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'Kk5LAOloSnSE94JNulRJpg',
    label: 'Path',
    field_type: 'string',
    api_key: 'path',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Size" (`size`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'aWFRceLcSm2ozyAvqJPE8g',
    label: 'Size',
    field_type: 'string',
    api_key: 'size',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Small', value: 'small' },
          { hint: '', label: 'Medium', value: 'medium' },
          { hint: '', label: 'Large', value: 'large' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Target" (`target`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'Mo9om3lySgq610h2ZkJLNw',
    label: 'Target',
    field_type: 'string',
    api_key: 'target',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Self', value: '_self' },
          { hint: '', label: 'Blank', value: '_blank' }
        ]
      }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.create('NF7JVHsmQHuqIE3BUAUrmA', {
    id: 'UpIwyr8LRNusMEdIlFF1FQ',
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
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.create('NF7JVHsmQHuqIE3BUAUrmA', {
    id: 'fQElp8C8QkiiihvDoQH6Zg',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.create('OdJLte3sQRq8oT9SbSjY6A', {
    id: 'JI_nJL4lTg-hSxMmxrfkfQ',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.create('OdJLte3sQRq8oT9SbSjY6A', {
    id: 'baHQUn8KRZ6mKudi-2M1ag',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.create('OdJLte3sQRq8oT9SbSjY6A', {
    id: 'NOoqWqPXSyaF08e5yln3mw',
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
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.create('OdJLte3sQRq8oT9SbSjY6A', {
    id: 'OGp1IDfPQ9aAoPznHxgBXA',
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
    'Create Multiple links field "Events" (`events`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.create('OdJLte3sQRq8oT9SbSjY6A', {
    id: 'fC3FpC4tSfqii680osNaqw',
    label: 'Events',
    field_type: 'links',
    api_key: 'events',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['C5xdhHU0TxuME6A18rivgg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'WXMjKaqlRfaO_7VIr2tTLQ',
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
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'FQNHPoSlTzCp98759fuduQ',
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
    'Create Boolean field "Show Track Finder" (`show_track_finder`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'Bfdht5QBRCuTUbeicq_DWA',
    label: 'Show Track Finder',
    field_type: 'boolean',
    api_key: 'show_track_finder',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.destroy('GrOENWJ_SJ6Cb5J77leLDA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Post" (`post`)'
  )
  await client.fields.update('TcxzsE5NTOu952EXSdsSog', {
    validators: {
      single_block_blocks: { item_types: ['A_gs2Z6HSgafR1zUnwIS7Q'] }
    }
  })

  console.log(
    'Update Single-line string field "Path" (`path`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('Kk5LAOloSnSE94JNulRJpg', { position: 2 })

  console.log(
    'Update Single-line string field "Action" (`action`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('Cpd1WKRnTciXkWrG-28WfA', {
    label: 'Action',
    api_key: 'action',
    position: 7
  })

  console.log(
    'Update Single link field "Link" (`link`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('ERfDz6EWRAalmSyGCd97Zg', {
    validators: {
      item_item_type: {
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
    }
  })

  console.log(
    'Update Single-line string field "Title" (`title`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.fields.update('bCh2sGb-ThWPxFxYbVzpqg', { validators: {} })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.update('UpIwyr8LRNusMEdIlFF1FQ', { position: 4 })

  console.log(
    'Update Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.update('fQElp8C8QkiiihvDoQH6Zg', { position: 5 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('WXMjKaqlRfaO_7VIr2tTLQ', { position: 4 })

  console.log(
    'Update Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('FQNHPoSlTzCp98759fuduQ', { position: 6 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.itemTypes.update('TOfj9tVmS320OVdSwEzVLQ', {
    presentation_title_field: { id: 'Z3TktVd_TjSYqT6jUSb8QQ', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.itemTypes.update('OdJLte3sQRq8oT9SbSjY6A', {
    presentation_title_field: { id: 'JI_nJL4lTg-hSxMmxrfkfQ', type: 'field' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.schemaMenuItems.update('cWJzrGoIRjurl1OjbyaDSQ', {
    position: 52
  })
}
