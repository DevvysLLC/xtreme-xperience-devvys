import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.itemTypes.create(
    {
      id: 'Qwc0SwomSyauTmZrlQ-fhg',
      name: '\uD83D\uDCB5 Section - Addons Grid',
      api_key: 'section_addons_grid',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'eL0Bup0rQn2qFOFYFty-2Q'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.fields.create('Qwc0SwomSyauTmZrlQ-fhg', {
    id: 'UFbLyX-ZTna_4cCb1xxYmw',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.fields.create('Qwc0SwomSyauTmZrlQ-fhg', {
    id: 'XCQXYDdQSHyVn1hIHQdyRA',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.fields.create('Qwc0SwomSyauTmZrlQ-fhg', {
    id: 'cjvs9LyTR7qDflnPW7wUiQ',
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
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.fields.create('Qwc0SwomSyauTmZrlQ-fhg', {
    id: 'PZM3WFdbTaqLYWwIfi_BSQ',
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
    'Create Multiple links field "Addons" (`addons`) in block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.fields.create('Qwc0SwomSyauTmZrlQ-fhg', {
    id: 'Afv3CdqPQ_mr0pxW4JU9Eg',
    label: 'Addons',
    field_type: 'links',
    api_key: 'addons',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['fvhQe2gWS8-0s_fQQjvXvg']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log(
    'Create Multiple-paragraph text field "Working Hours" (`working_hours`) in model "\uD83D\uDD27 Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'dhM44wkQRFi8YYb_wJjgVg',
    label: 'Working Hours',
    field_type: 'text',
    api_key: 'working_hours',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: [
          'heading',
          'bold',
          'italic',
          'strikethrough',
          'code',
          'unordered_list',
          'ordered_list',
          'quote',
          'link',
          'image',
          'fullscreen'
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Action Detail" (`action_detail`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'P4fQ7JCGQ8aFmwngnOsIIQ',
    label: 'Action Detail',
    field_type: 'string',
    api_key: 'action_detail',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Multiple links field "Related Posts" (`related_posts`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.create('HjDd_vQURziXWonrnL8mSw', {
    id: 'ORsN--R0QwCyyx1BnPW5-g',
    label: 'Related Posts',
    field_type: 'links',
    api_key: 'related_posts',
    validators: {
      items_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['AFEr51ZSRu63RSadF2W5nQ']
      }
    },
    appearance: { addons: [], editor: 'links_select', parameters: {} }
  })

  console.log(
    'Create Boolean field "Show Filters" (`show_filters`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.create('MmYG4Gj7SECdAJwKKjsO8g', {
    id: 'GtN2f70iT1CkiH5hh2TiDA',
    label: 'Show Filters',
    field_type: 'boolean',
    api_key: 'show_filters',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Modular Content (Single block) field "Price" (`price`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'BCCSzvDBTvm8HrMHu8c_Ng',
    label: 'Price',
    field_type: 'single_block',
    api_key: 'price',
    validators: {
      single_block_blocks: { item_types: ['ft4xDixyRuaoVG_33vUqPw'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Badge" (`badge`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.create('SDasSAA3TMS3_SjXcasgEg', {
    id: 'MNd7APRVT2iWzduFmUGVUw',
    label: 'Badge',
    field_type: 'single_block',
    api_key: 'badge',
    validators: {
      single_block_blocks: { item_types: ['B_Ne5JBoTKaz9kIS8_x6GA'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Spec Badges" (`spec_badges`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'WpZA-yDqQuqe4P7UHTuRmA',
    label: 'Spec Badges',
    field_type: 'rich_text',
    api_key: 'spec_badges',
    validators: {
      rich_text_blocks: { item_types: ['B_Ne5JBoTKaz9kIS8_x6GA'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'TrF8Vbl3Qz62vaDDMC5ZUA',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'QWxF7cQQSKqp7PdSh0Ek0A',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'EMWCvyJDQSmwBYDgrJ69AQ',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'fvh-21vtTFa-QcI-FM8eVg',
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
    'Create Single-line string field "Marquee" (`marquee`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'PB4VX011STeEEFAuuj0wcA',
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
    'Create Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'YRgNUFrCSjyM5lFUvz9H3w',
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
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'd9LtsjhJR4uAmJNSfaqA7g',
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
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'f5MQGCVRTWKHKnhV2xIWTA',
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
    'Create Boolean field "Show Track Finder" (`show_track_finder`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'N-TMGhR6T5qrCD14ociH7g',
    label: 'Show Track Finder',
    field_type: 'boolean',
    api_key: 'show_track_finder',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single-line string field "Title Internal" (`title_internal`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.destroy('I-QCpcD-Tb2Ggexp8j3CVQ')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Slug field "Handle" (`handle`) in block model "\u270F\uFE0F Post - Config" (`post_config`)'
  )
  await client.fields.update('Tqu1gNg0TGmBTOomHaxiqA', {
    appearance: {
      addons: [],
      editor: 'slug',
      parameters: { url_prefix: '/blog/', placeholder: null }
    }
  })

  console.log(
    'Update Single-line string field "Action Detail" (`action_detail`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('P4fQ7JCGQ8aFmwngnOsIIQ', { position: 8 })

  console.log(
    'Update Single-line string field "Action" (`action`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('Cpd1WKRnTciXkWrG-28WfA', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Scroll To', value: 'scrollto:section' },
          { hint: '', label: 'Open Drawer', value: 'open:drawer' }
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

  console.log(
    'Update Boolean field "Show Filters" (`show_filters`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.fields.update('GtN2f70iT1CkiH5hh2TiDA', { position: 3 })

  console.log(
    'Update Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\uD83D\uDCB5 Addon - Model" (`addon_model`)'
  )
  await client.fields.update('J6xVUzpHSaaawMcsJHHWUQ', { position: 6 })

  console.log(
    'Update Modular Content (Multiple blocks) field "Spec Badges" (`spec_badges`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('WpZA-yDqQuqe4P7UHTuRmA', { position: 23 })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('TrF8Vbl3Qz62vaDDMC5ZUA', { position: 1 })

  console.log(
    'Update Single-line string field "Title" (`title`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('QWxF7cQQSKqp7PdSh0Ek0A', { position: 2 })

  console.log(
    'Update Single-line string field "Subtitle" (`subtitle`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('EMWCvyJDQSmwBYDgrJ69AQ', { position: 3 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('fvh-21vtTFa-QcI-FM8eVg', { position: 4 })

  console.log(
    'Update Single-line string field "Marquee" (`marquee`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('PB4VX011STeEEFAuuj0wcA', { position: 5 })

  console.log(
    'Update Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('YRgNUFrCSjyM5lFUvz9H3w', { position: 6 })

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('d9LtsjhJR4uAmJNSfaqA7g', { position: 7 })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('f5MQGCVRTWKHKnhV2xIWTA', { position: 8 })

  console.log(
    'Update Boolean field "Show Track Finder" (`show_track_finder`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('N-TMGhR6T5qrCD14ociH7g', { position: 9 })

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('WXMjKaqlRfaO_7VIr2tTLQ', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log('Destroy models/block models')

  console.log(
    'Delete block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.itemTypes.destroy('JQ0sCegkSeybGWHmzRRB4w', {
    skip_menu_items_deletion: true
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.itemTypes.update('Qwc0SwomSyauTmZrlQ-fhg', {
    presentation_title_field: { id: 'XCQXYDdQSHyVn1hIHQdyRA', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.itemTypes.update('aBPYjVj8T6KfjIrbrn5KKA', {
    presentation_title_field: { id: 'QWxF7cQQSKqp7PdSh0Ek0A', type: 'field' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.schemaMenuItems.update('eL0Bup0rQn2qFOFYFty-2Q', {
    position: 38
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.schemaMenuItems.update('JEUgkHJDQJKcT_nmst_UqQ', {
    position: 66
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.schemaMenuItems.update('cWJzrGoIRjurl1OjbyaDSQ', {
    position: 70
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.schemaMenuItems.update('Q4v5wACvQxS1aCQtnXZd5Q', {
    position: 73
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.schemaMenuItems.update('LvNCw6B_Siu0ieaTCFoPuw', {
    position: 75
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.schemaMenuItems.update('flHBGeiDRk-pOxzxqgkxTg', {
    position: 60
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.schemaMenuItems.update('ZGpB5V7uTc-_uRae929nkA', {
    position: 62
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.schemaMenuItems.update('AIs2wUSHTAKZaMxGRU8xEQ', {
    position: 65
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.schemaMenuItems.update('CKgon9kATHWDBe29HpQ0SQ', {
    position: 61
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.schemaMenuItems.update('KTb1ICT5TRC0PCGhpp8d5Q', {
    position: 59
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.schemaMenuItems.update('dXevvOMqTOCY4ULWsH8AyQ', {
    position: 69
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.schemaMenuItems.update('LCIZMxrjRvCJ60kRgglFKA', {
    position: 68
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.schemaMenuItems.update('PhOgOysiT9uPQAw-gT4GGQ', {
    position: 82
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.schemaMenuItems.update('Vk5Kq8TjR7yp2Oaf-RRAtw', {
    position: 78
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.schemaMenuItems.update('TmoxCsx8Ri-AUf_nsioMaA', {
    position: 84
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Post" (`post`)'
  )
  await client.schemaMenuItems.update('DyHShJ8BRmaWXMxFVOXU5A', {
    position: 89
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.schemaMenuItems.update('OWE4DLnxR0OXvszI-pMxWg', {
    position: 90
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Badge" (`core_badge`)'
  )
  await client.schemaMenuItems.update('WRNz9vAbTses6Y5eqLgWWQ', {
    position: 86
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.schemaMenuItems.update('S1ProRfKRk2PK3SAlZZOqg', {
    position: 64
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.schemaMenuItems.update('B1fbLr_bQXeL4dZnPObTRw', {
    position: 79
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Image" (`core_image`)'
  )
  await client.schemaMenuItems.update('Qk5_eLN3Tu6dM818aKGYUw', {
    position: 77
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.schemaMenuItems.update('N89P5xHZRc2NixLTrQkaTg', {
    position: 76
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.schemaMenuItems.update('fzVePPv7Q6mMscnX3V8yIw', {
    position: 81
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.schemaMenuItems.update('C8FUntmpRDS_26VBlz8apQ', {
    position: 83
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.schemaMenuItems.update('IK9CCfydQY2GfTtyDHfrdA', {
    position: 71
  })
}
