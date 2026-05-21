import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.itemTypes.create(
    {
      id: 'FOo5sFWlS-6DEPY76lvhww',
      name: '\uD83D\uDEE3\uFE0F Section - Track Spec',
      api_key: 'section_track_spec',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'KTb1ICT5TRC0PCGhpp8d5Q'
    }
  )

  console.log(
    'Create block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.itemTypes.create(
    {
      id: 'JQ0sCegkSeybGWHmzRRB4w',
      name: '\uD83D\uDEE3\uFE0F Section - Track Hero',
      api_key: 'section_track_hero',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'Tx0QLRNqSBa9X7wQqqmViQ'
    }
  )

  console.log(
    'Create block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.itemTypes.create(
    {
      id: 'aBPYjVj8T6KfjIrbrn5KKA',
      name: '\uD83C\uDFCE\uFE0F Section - Supercar Hero',
      api_key: 'section_supercar_hero',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'LCIZMxrjRvCJ60kRgglFKA'
    }
  )

  console.log(
    'Create block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.itemTypes.create(
    {
      id: 'ar7S0nqvTLiRuU7glh28Gg',
      name: '\uD83D\uDDA5\uFE0F Section - Media Gallery',
      api_key: 'section_media_gallery',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'ItJOjnRdSly2ciAvI4Gpzg'
    }
  )

  console.log(
    'Create block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.itemTypes.create(
    {
      id: 'cS0F9pnjQSu4cV9RRoBvMg',
      name: '\uD83C\uDFCE\uFE0F Section - Supercar Spec',
      api_key: 'section_supercar_spec',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'dXevvOMqTOCY4ULWsH8AyQ'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.fields.create('FOo5sFWlS-6DEPY76lvhww', {
    id: 'cdIKXUVaRbmliJz0gBQSfQ',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    hint: 'Please note this section does not have any direct inputs, the data comes from the model',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('JQ0sCegkSeybGWHmzRRB4w', {
    id: 'P9loWVc1TSSRXbHLk_t8wg',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    hint: 'Please note this section does not have any direct inputs, the data comes from the model',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'I-QCpcD-Tb2Ggexp8j3CVQ',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    hint: 'Please note this section does not have any direct inputs, the data comes from the model',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.create('ar7S0nqvTLiRuU7glh28Gg', {
    id: 'H4Y1r5UmSeGCmCsX7rqZqg',
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
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.create('ar7S0nqvTLiRuU7glh28Gg', {
    id: 'RpOqhZGoQWKh0ruII2kfLA',
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
    'Create Single-line string field "Title Internal" (`title_internal`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.fields.create('cS0F9pnjQSu4cV9RRoBvMg', {
    id: 'fY5Eh1LOR_CPpjGsTNehGA',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    hint: 'Please note this section does not have any direct inputs, the data comes from the model',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.fields.create('c2ZW9BjWQzaTcboXDWmD1A', {
    id: 'cZhwAiplRv2YaZboL_3pEg',
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
    'Create Floating-point number field "Rating" (`rating`) in block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.fields.create('c2ZW9BjWQzaTcboXDWmD1A', {
    id: 'fJvNdGflQ4iu_DY6yjVArw',
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

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.destroy('cXf8qF4DTi-Nh7MWLSB6lQ')

  console.log(
    'Delete Modular Content (Single block) field "Thumbnail" (`thumbnail`) in block model "\u270D\uFE0F Review - Model" (`review_model`)'
  )
  await client.fields.destroy('JYwQE0ddTnyw6x6_07OHyQ')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Body" (`body`) in block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.fields.update('Q2HeYSECTUW9ljDzuFBahA', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: ['bold', 'italic', 'ordered_list', 'unordered_list']
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
          'JQ0sCegkSeybGWHmzRRB4w',
          'LOTwpXWiSzq0KhK9NOlJ0w',
          'LudhX9NjTk65U2U1Q8dL1g',
          'MK-gWkLWTeGYg6-EzAoTQw',
          'MmYG4Gj7SECdAJwKKjsO8g',
          'M6Eqatu0Ro2A7VoCtBgRoQ',
          'NF7JVHsmQHuqIE3BUAUrmA',
          'OdJLte3sQRq8oT9SbSjY6A',
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
    'Update Modular Content (Single block) field "Content" (`content`) in model "\uD83C\uDFCE\uFE0F Supercar" (`supercar`)'
  )
  await client.fields.update('A7oS9eHZRRO15yEG-Gycjw', {
    validators: {
      single_block_blocks: { item_types: ['L9CuE6eYSxmP-Qgj-KvxAg'] }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Content" (`content`) in model "\uD83D\uDEE3\uFE0F Track" (`track`)'
  )
  await client.fields.update('I3_Ug6DcTNKqg3W-dJ37Nw', {
    validators: {
      single_block_blocks: { item_types: ['L9CuE6eYSxmP-Qgj-KvxAg'] }
    }
  })

  console.log(
    'Update Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.fields.update('cZhwAiplRv2YaZboL_3pEg', { position: 3 })

  console.log(
    'Update Floating-point number field "Rating" (`rating`) in block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.fields.update('fJvNdGflQ4iu_DY6yjVArw', { position: 4 })

  console.log('Destroy models/block models')

  console.log(
    'Delete block model "\uD83D\uDEE3\uFE0F Track - Itinerary" (`track_itinerary`)'
  )
  await client.itemTypes.destroy('AgTkMfQ_SHqL9F5ICEg5oQ', {
    skip_menu_items_deletion: true
  })

  console.log(
    'Delete block model "\uD83C\uDFCE\uFE0F Supercar - Content" (`supercar_content`)'
  )
  await client.itemTypes.destroy('IIFN1qC-SDa7y6MbbrfGTQ', {
    skip_menu_items_deletion: true
  })

  console.log(
    'Delete block model "\uD83D\uDEE3\uFE0F Track - Content" (`track_content`)'
  )
  await client.itemTypes.destroy('Irzonv5MRqGxR1LrncDrZA', {
    skip_menu_items_deletion: true
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.itemTypes.update('FOo5sFWlS-6DEPY76lvhww', {
    presentation_title_field: { id: 'cdIKXUVaRbmliJz0gBQSfQ', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.itemTypes.update('JQ0sCegkSeybGWHmzRRB4w', {
    presentation_title_field: { id: 'P9loWVc1TSSRXbHLk_t8wg', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.itemTypes.update('aBPYjVj8T6KfjIrbrn5KKA', {
    presentation_title_field: { id: 'I-QCpcD-Tb2Ggexp8j3CVQ', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.itemTypes.update('ar7S0nqvTLiRuU7glh28Gg', {
    presentation_title_field: { id: 'H4Y1r5UmSeGCmCsX7rqZqg', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.itemTypes.update('cS0F9pnjQSu4cV9RRoBvMg', {
    presentation_title_field: { id: 'fY5Eh1LOR_CPpjGsTNehGA', type: 'field' }
  })

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.itemTypes.update('WU6ueJWZTfuxaFlXZDJy6w', {
    name: '\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero'
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.schemaMenuItems.update('ItJOjnRdSly2ciAvI4Gpzg', {
    position: 55
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.schemaMenuItems.update('KTb1ICT5TRC0PCGhpp8d5Q', {
    position: 58
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.schemaMenuItems.update('Tx0QLRNqSBa9X7wQqqmViQ', {
    position: 57
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.schemaMenuItems.update('dXevvOMqTOCY4ULWsH8AyQ', {
    position: 68
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.schemaMenuItems.update('LCIZMxrjRvCJ60kRgglFKA', {
    position: 67
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.schemaMenuItems.update('B1fbLr_bQXeL4dZnPObTRw', {
    position: 78
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Image" (`core_image`)'
  )
  await client.schemaMenuItems.update('Qk5_eLN3Tu6dM818aKGYUw', {
    position: 76
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.schemaMenuItems.update('N89P5xHZRc2NixLTrQkaTg', {
    position: 75
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.schemaMenuItems.update('fzVePPv7Q6mMscnX3V8yIw', {
    position: 80
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.schemaMenuItems.update('C8FUntmpRDS_26VBlz8apQ', {
    position: 82
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.schemaMenuItems.update('IK9CCfydQY2GfTtyDHfrdA', {
    position: 70
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.schemaMenuItems.update('PhOgOysiT9uPQAw-gT4GGQ', {
    position: 81
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.schemaMenuItems.update('Vk5Kq8TjR7yp2Oaf-RRAtw', {
    position: 77
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.schemaMenuItems.update('TmoxCsx8Ri-AUf_nsioMaA', {
    position: 83
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Post" (`post`)'
  )
  await client.schemaMenuItems.update('DyHShJ8BRmaWXMxFVOXU5A', {
    position: 88
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.schemaMenuItems.update('OWE4DLnxR0OXvszI-pMxWg', {
    position: 89
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Badge" (`core_badge`)'
  )
  await client.schemaMenuItems.update('WRNz9vAbTses6Y5eqLgWWQ', {
    position: 85
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.schemaMenuItems.update('cWJzrGoIRjurl1OjbyaDSQ', {
    position: 69
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.schemaMenuItems.update('Q4v5wACvQxS1aCQtnXZd5Q', {
    position: 72
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.schemaMenuItems.update('LvNCw6B_Siu0ieaTCFoPuw', {
    position: 74
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.schemaMenuItems.update('JEUgkHJDQJKcT_nmst_UqQ', {
    position: 65
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.schemaMenuItems.update('S1ProRfKRk2PK3SAlZZOqg', {
    position: 63
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.schemaMenuItems.update('flHBGeiDRk-pOxzxqgkxTg', {
    position: 59
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.schemaMenuItems.update('ZGpB5V7uTc-_uRae929nkA', {
    position: 61
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.schemaMenuItems.update('AIs2wUSHTAKZaMxGRU8xEQ', {
    position: 64
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.schemaMenuItems.update('CKgon9kATHWDBe29HpQ0SQ', {
    position: 60
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Announcement Bar" (`section_announcement_bar`)'
  )
  await client.schemaMenuItems.update('NDVWFKHmTWewQe09kRxH0A', {
    position: 56
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.schemaMenuItems.update('C7yoLZvxQLK4kGLYWhMzSA', {
    position: 42
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Split Callout Collage" (`section_split_callout_collage`)'
  )
  await client.schemaMenuItems.update('LCV5jboyS-ai01zek58ecA', {
    position: 44
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Press Brand Grid" (`section_press_brand_grid`)'
  )
  await client.schemaMenuItems.update('TCxV-xQXQXGH_vbONl406A', {
    position: 46
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.schemaMenuItems.update('YYBt5xiHRMWkzhGXfIknRw', {
    position: 39
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.schemaMenuItems.update('MNVeqdNxTUKImsN0Mis2jw', {
    position: 52
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.schemaMenuItems.update('HN3rShX8Sh2LY0WfG8EtIw', {
    position: 48
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.schemaMenuItems.update('UuE5aXNfSpSyM72KBLTfzQ', {
    position: 49
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.schemaMenuItems.update('IhHlEBT4TyG5M7xPE0DWLw', {
    position: 47
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Split Callout" (`section_split_callout`)'
  )
  await client.schemaMenuItems.update('ZwodKcGbSIS_LHJl_e2_3w', {
    position: 43
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Headline" (`section_headline`)'
  )
  await client.schemaMenuItems.update('dv0lj_0AT9Kv4WeTJoyC_A', {
    position: 40
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.schemaMenuItems.update('ZNuaXl-ZTEK0wh2B5TTsjQ', {
    position: 41
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.schemaMenuItems.update('WdXhe1LFQQWPS1rb1IfMsg', {
    position: 51
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
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.schemaMenuItems.update('K1yK2MHkSWm3rfiynIA3Xg', {
    position: 38
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Track - Config" (`track_config`)'
  )
  await client.schemaMenuItems.update('XIebkEpbQKGTSyS8mqJZfQ', {
    position: 34
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.schemaMenuItems.update('P5xsJTn-TmORko9cVEDSrQ', {
    position: 35
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Content" (`page_content`)'
  )
  await client.schemaMenuItems.update('O65sjeaaQ3qfKFTnuyjo5w', {
    position: 33
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Config" (`page_config`)'
  )
  await client.schemaMenuItems.update('DLHrhSMUTaO5NIhwMW11rQ', {
    position: 32
  })
}
