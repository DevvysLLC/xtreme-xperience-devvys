import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Integer number field "Max Height" (`max_height`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'e2ECISOxTS-9jfXiuBp6HQ',
    label: 'Max Height',
    field_type: 'integer',
    api_key: 'max_height',
    validators: { number_range: { min: 50, max: 100 } },
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 100
  })

  console.log(
    'Create Boolean field "Show Prices" (`show_prices`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.create('ExGw39zgSKeKR9IDP14Rew', {
    id: 'UfrZAf-YTSu4f-ZCtgVo9Q',
    label: 'Show Prices',
    field_type: 'boolean',
    api_key: 'show_prices',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    default_value: false
  })

  console.log(
    'Create Integer number field "Max Height" (`max_height`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.create('WU6ueJWZTfuxaFlXZDJy6w', {
    id: 'AhQJtmlySBajDakUn9F_Vw',
    label: 'Max Height',
    field_type: 'integer',
    api_key: 'max_height',
    validators: { number_range: { min: 50, max: 100 } },
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 100
  })

  console.log(
    'Create Integer number field "Max Height" (`max_height`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'ZWQ7y52UQTGko9i-X-CSqg',
    label: 'Max Height',
    field_type: 'integer',
    api_key: 'max_height',
    validators: { number_range: { min: 50, max: 100 } },
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 100
  })

  console.log(
    'Create Integer number field "Max Height" (`max_height`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'SNUhPl_YQL6zN6MVj-CeJw',
    label: 'Max Height',
    field_type: 'integer',
    api_key: 'max_height',
    validators: { number_range: { min: 50, max: 100 } },
    appearance: {
      addons: [],
      editor: 'integer',
      parameters: { placeholder: null }
    },
    default_value: 100
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single link field "Track" (`track`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('QrYgSci3Tf6yw1rE9MTNig', {
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['ZJcRHg4SSX-WyCUJTg52HQ']
      },
      required: {}
    }
  })

  console.log(
    'Update Integer number field "Max Height" (`max_height`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.update('e2ECISOxTS-9jfXiuBp6HQ', { position: 2 })

  console.log(
    'Update Integer number field "Max Height" (`max_height`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.update('AhQJtmlySBajDakUn9F_Vw', { position: 2 })

  console.log(
    'Update Modular Content (Single block) field "Gradient" (`gradient`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.update('XlOecM5DSLSxfxr98UT-Dw', { position: 4 })

  console.log(
    'Update Integer number field "Max Height" (`max_height`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('ZWQ7y52UQTGko9i-X-CSqg', { position: 2 })

  console.log(
    'Update Integer number field "Max Height" (`max_height`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('SNUhPl_YQL6zN6MVj-CeJw', { position: 2 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.schemaMenuItems.update('Vk5Kq8TjR7yp2Oaf-RRAtw', {
    position: 88
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Track - Config" (`track_config`)'
  )
  await client.schemaMenuItems.update('XIebkEpbQKGTSyS8mqJZfQ', {
    position: 40
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.schemaMenuItems.update('ZNuaXl-ZTEK0wh2B5TTsjQ', {
    position: 49
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.schemaMenuItems.update('Wd6VR9ZRSs2hz0PH6NuZHw', {
    position: 58
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.schemaMenuItems.update('IjEYvwmsTImztSNtOpOFdw', {
    position: 61
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.schemaMenuItems.update('flHBGeiDRk-pOxzxqgkxTg', {
    position: 68
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Metadata" (`booking_metad`)'
  )
  await client.schemaMenuItems.update('VpB-pp5ASqWUi3H33G_iUA', {
    position: 104
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Accordion" (`section_accordion`)'
  )
  await client.schemaMenuItems.update('HN3rShX8Sh2LY0WfG8EtIw', {
    position: 56
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Announcement" (`core_announcement`)'
  )
  await client.schemaMenuItems.update('OWE4DLnxR0OXvszI-pMxWg', {
    position: 100
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Spec" (`section_supercar_spec`)'
  )
  await client.schemaMenuItems.update('dXevvOMqTOCY4ULWsH8AyQ', {
    position: 79
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.schemaMenuItems.update('eL0Bup0rQn2qFOFYFty-2Q', {
    position: 46
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.schemaMenuItems.update('K1yK2MHkSWm3rfiynIA3Xg', {
    position: 45
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.schemaMenuItems.update('LCIZMxrjRvCJ60kRgglFKA', {
    position: 78
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.schemaMenuItems.update('PhOgOysiT9uPQAw-gT4GGQ', {
    position: 92
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.schemaMenuItems.update('WdXhe1LFQQWPS1rb1IfMsg', {
    position: 59
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - USP" (`section_usp`)'
  )
  await client.schemaMenuItems.update('P32ltwDgRca-MXkk7wr0tg', {
    position: 62
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Event Finder" (`section_event_finder`)'
  )
  await client.schemaMenuItems.update('NkMR4ttkSpa1msOvEUrL5Q', {
    position: 70
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Fleet Grid" (`section_supercar_fleet_grid`)'
  )
  await client.schemaMenuItems.update('S1ProRfKRk2PK3SAlZZOqg', {
    position: 73
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - USP" (`core_usp`)'
  )
  await client.schemaMenuItems.update('fzVePPv7Q6mMscnX3V8yIw', {
    position: 91
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.schemaMenuItems.update('C8FUntmpRDS_26VBlz8apQ', {
    position: 93
  })

  console.log(
    'Update block schema menu item for block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.schemaMenuItems.update('Quw9Nv9pTn-qUM2cSM0mBg', {
    position: 74
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.schemaMenuItems.update('CKgon9kATHWDBe29HpQ0SQ', {
    position: 69
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.schemaMenuItems.update('XJLB6OzWQpC1umD8tNwrpQ', {
    position: 66
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Post" (`post`)'
  )
  await client.schemaMenuItems.update('DyHShJ8BRmaWXMxFVOXU5A', {
    position: 99
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.schemaMenuItems.update('LvNCw6B_Siu0ieaTCFoPuw', {
    position: 85
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE1\uFE0F Insurance - Model" (`insurance_model`)'
  )
  await client.schemaMenuItems.update('dIRKNyszTQyrBlKKpmpN_g', {
    position: 33
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Decorator" (`booking_decorator`)'
  )
  await client.schemaMenuItems.update('UBOHn75KSK6zzt2p-vy1Nw', {
    position: 105
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Page" (`booking_page`)'
  )
  await client.schemaMenuItems.update('YjuvxpbSTbSAvUDKMY1eWQ', {
    position: 106
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.schemaMenuItems.update('fd1l0fFKQBSFkUSv6z4GYw', {
    position: 102
  })

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Category" (`category`)'
  )
  await client.schemaMenuItems.update('X3IkFB1-T_mwAyr_P75-7A', {
    position: 101
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.schemaMenuItems.update('C7yoLZvxQLK4kGLYWhMzSA', {
    position: 50
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Press Brand Grid" (`section_press_brand_grid`)'
  )
  await client.schemaMenuItems.update('TCxV-xQXQXGH_vbONl406A', {
    position: 54
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.schemaMenuItems.update('YYBt5xiHRMWkzhGXfIknRw', {
    position: 47
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Supercar Group" (`booking_supercar_group`)'
  )
  await client.schemaMenuItems.update('axb0trp9Slazr2pxPu6hJw', {
    position: 107
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Content" (`page_content`)'
  )
  await client.schemaMenuItems.update('O65sjeaaQ3qfKFTnuyjo5w', {
    position: 39
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCDA Page - Config" (`page_config`)'
  )
  await client.schemaMenuItems.update('DLHrhSMUTaO5NIhwMW11rQ', {
    position: 38
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Image" (`core_image`)'
  )
  await client.schemaMenuItems.update('Qk5_eLN3Tu6dM818aKGYUw', {
    position: 87
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.schemaMenuItems.update('N89P5xHZRc2NixLTrQkaTg', {
    position: 86
  })

  console.log(
    'Update block schema menu item for block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.schemaMenuItems.update('CU-1MY3iR7qbBuSA6k7tbg', {
    position: 103
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.schemaMenuItems.update('KTb1ICT5TRC0PCGhpp8d5Q', {
    position: 67
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.schemaMenuItems.update('MNVeqdNxTUKImsN0Mis2jw', {
    position: 60
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.schemaMenuItems.update('UuE5aXNfSpSyM72KBLTfzQ', {
    position: 57
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Review" (`section_review`)'
  )
  await client.schemaMenuItems.update('IhHlEBT4TyG5M7xPE0DWLw', {
    position: 55
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Headline" (`section_headline`)'
  )
  await client.schemaMenuItems.update('dv0lj_0AT9Kv4WeTJoyC_A', {
    position: 48
  })
}
