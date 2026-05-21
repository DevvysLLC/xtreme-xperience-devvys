import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.itemTypes.create(
    {
      id: 'a6xK4VfRQ5aWLrZqwXFzuA',
      name: '\u270D\uFE0F Review - Model',
      api_key: 'review_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'U1YM8hH8S5W_dXXCt7i81A'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'fv5qUVWnRYiT6Qpkh1YYAA',
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
    'Create Multiple-paragraph text field "Quote" (`quote`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'IvoQsvUDQ36LiZY1On1uHw',
    label: 'Quote',
    field_type: 'text',
    api_key: 'quote',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Single-line string field "Attribution" (`attribution`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'UzGNqllkSs2sWDTRqGPgVA',
    label: 'Attribution',
    field_type: 'string',
    api_key: 'attribution',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Floating-point number field "Rating" (`rating`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'AXtAjshLTQ63MYDLYUemuw',
    label: 'Rating',
    field_type: 'float',
    api_key: 'rating',
    validators: { number_range: { min: 1, max: 5 } },
    appearance: {
      addons: [],
      editor: 'float',
      parameters: { placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'Ef8Aw2RtR6SODXXJI-pwOA',
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
    'Create Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.create('a6xK4VfRQ5aWLrZqwXFzuA', {
    id: 'JYwQE0ddTnyw6x6_07OHyQ',
    label: 'Thumbnail',
    field_type: 'single_block',
    api_key: 'thumbnail',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'MjS65iwrSLKuVlaXcQ7EsA',
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
    'Create Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'TG6NgbNFSAi66X0Mi3hltQ',
    label: 'Rocket Rez ID',
    field_type: 'string',
    api_key: 'rocket_rez_id',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Date field "Date" (`date`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'XsIfZmhNRFCLLzbWHsJOaA',
    label: 'Date',
    field_type: 'date',
    api_key: 'date',
    appearance: { addons: [], editor: 'date_picker', parameters: {} }
  })

  console.log(
    'Create Single link field "Track" (`track`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'QrYgSci3Tf6yw1rE9MTNig',
    label: 'Track',
    field_type: 'link',
    api_key: 'track',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['ZJcRHg4SSX-WyCUJTg52HQ']
      }
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} }
  })

  console.log(
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'fMNMyOsqRCKAnz5He0mwEg',
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
    'Create Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.create('DwRudIblQkaD31PkyUnnJw', {
    id: 'cXf8qF4DTi-Nh7MWLSB6lQ',
    label: 'Thumbnail',
    field_type: 'single_block',
    api_key: 'thumbnail',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'Z1FgBtnQS6G5TRJVR-9lFw',
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
    'Create Single-line string field "Rocket Rez ID" (`rocket_rez_id`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'N_MiV2r2RCqjHHBiOp7K-A',
    label: 'Rocket Rez ID',
    field_type: 'string',
    api_key: 'rocket_rez_id',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'NDMvCXqJRTaXHLnu1BfS7g',
    label: 'Description',
    field_type: 'text',
    api_key: 'description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: [
          'heading',
          'bold',
          'italic',
          'unordered_list',
          'ordered_list',
          'quote',
          'link'
        ]
      }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'J6xVUzpHSaaawMcsJHHWUQ',
    label: 'Thumbnail',
    field_type: 'single_block',
    api_key: 'thumbnail',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Model" (`model`) in model "\u270D\uFE0F Review" (`review`)'
  )
  await client.fields.create('d-gN0Xg4QgK4YL9WlS4nVw', {
    id: 'KBjy_L_BQde_gCCAeyPYNQ',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['a6xK4VfRQ5aWLrZqwXFzuA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Post" (`post`)'
  )
  await client.fields.update('TcxzsE5NTOu952EXSdsSog', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F Page" (`page`)'
  )
  await client.fields.update('P0seb2FhRbSQluAbsOoxPQ', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83C\uDFCE\uFE0F Supercar" (`supercar`)'
  )
  await client.fields.update('FePMc8CJQHyM3FXuEefPaQ', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83D\uDEE3\uFE0F Track" (`track`)'
  )
  await client.fields.update('Jv9-D6zZRYuNPfoz8mYPMA', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Multiple-paragraph text field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.update('DHBS7lNESWagOh7rawJ7dQ', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.update('QQaP4QK4Q_ygMaOwBj7XvA', {
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] },
      size: { min: 0, max: 2 }
    }
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('deSwtWzLTJisp6qp4pAdIw', {
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] },
      size: { min: 0, max: 2 }
    }
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.itemTypes.update('a6xK4VfRQ5aWLrZqwXFzuA', {
    presentation_title_field: { id: 'fv5qUVWnRYiT6Qpkh1YYAA', type: 'field' }
  })

  console.log('Update block model "\uD83D\uDCC5 Event - Model" (`event_model`)')
  await client.itemTypes.update('DwRudIblQkaD31PkyUnnJw', {
    presentation_title_field: { id: 'MjS65iwrSLKuVlaXcQ7EsA', type: 'field' }
  })

  console.log('Update block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)')
  await client.itemTypes.update('SDasSAA3TMS3_SjXcasgEg', {
    presentation_title_field: { id: 'Z1FgBtnQS6G5TRJVR-9lFw', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Update menu item "Global Config"')
  await client.menuItems.update('WxTzWijDQ0KhKPtN_I528w', { position: 3 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.schemaMenuItems.update('U1YM8hH8S5W_dXXCt7i81A', {
    position: 32
  })
}
