import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log('Create block model "\u270F\uFE0F FAQ - Config" (`faq_config`)')
  await client.itemTypes.create(
    {
      id: 'XdmCS4GRTFWIUASGoprDeg',
      name: '\u270F\uFE0F FAQ - Config',
      api_key: 'faq_config',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'IDCrRePjR66OCvOUM2JT1A'
    }
  )

  console.log('Create block model "\u270F\uFE0F FAQ - Model" (`faq_model`)')
  await client.itemTypes.create(
    {
      id: 'a1StO0UXTn26UqnRQrtLmQ',
      name: '\u270F\uFE0F FAQ - Model',
      api_key: 'faq_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'RciP342WSg-XSNXQWCZC0A'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\u270F\uFE0F FAQ - Config" (`faq_config`)'
  )
  await client.fields.create('XdmCS4GRTFWIUASGoprDeg', {
    id: 'dwCADOcmTgmuJNA7EbymgA',
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
    'Create SEO meta tags field "SEO" (`seo`) in block model "\u270F\uFE0F FAQ - Config" (`faq_config`)'
  )
  await client.fields.create('XdmCS4GRTFWIUASGoprDeg', {
    id: 'C5VfrljlQUuDK9PcXCXAaw',
    label: 'SEO',
    field_type: 'seo',
    api_key: 'seo',
    validators: { title_length: { max: 60 }, description_length: { max: 160 } },
    appearance: {
      addons: [],
      editor: 'seo',
      parameters: {
        fields: ['title', 'description', 'image', 'no_index', 'twitter_card'],
        previews: [
          'google',
          'twitter',
          'facebook',
          'linkedin',
          'slack',
          'telegram',
          'whatsapp'
        ]
      }
    }
  })

  console.log(
    'Create Slug field "Handle" (`handle`) in block model "\u270F\uFE0F FAQ - Config" (`faq_config`)'
  )
  await client.fields.create('XdmCS4GRTFWIUASGoprDeg', {
    id: 'OfSbgpOtQj23hwqR90e_hw',
    label: 'Handle',
    field_type: 'slug',
    api_key: 'handle',
    validators: {
      slug_title_field: { title_field_id: 'dwCADOcmTgmuJNA7EbymgA' },
      slug_format: { predefined_pattern: 'webpage_slug' }
    },
    appearance: {
      addons: [],
      editor: 'slug',
      parameters: { url_prefix: null, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\u270F\uFE0F FAQ - Model" (`faq_model`)'
  )
  await client.fields.create('a1StO0UXTn26UqnRQrtLmQ', {
    id: 'W0ulw6_NQB-cPjRlGm64JA',
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
    'Create Modular Content (Multiple blocks) field "FAQs" (`faqs`) in block model "\u270F\uFE0F FAQ - Model" (`faq_model`)'
  )
  await client.fields.create('a1StO0UXTn26UqnRQrtLmQ', {
    id: 'GQsgpea2TFa0Nqn6SIQEbQ',
    label: 'FAQs',
    field_type: 'rich_text',
    api_key: 'faqs',
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
    'Create Modular Content (Single block) field "CTA" (`cta`) in block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.fields.create('CrkoyoqRT6uMhY6hhBdJNA', {
    id: 'AmrBcckzRLG_R6K3JXMIJw',
    label: 'CTA',
    field_type: 'single_block',
    api_key: 'cta',
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
    'Create Modular Content (Single block) field "CTA" (`cta`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.create('C798bqdmSeucDjFGRDhzhA', {
    id: 'fWWoEU9oSWOOLvR7WjI4qw',
    label: 'CTA',
    field_type: 'single_block',
    api_key: 'cta',
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
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.create('Egiw2WiRQXGl65gNK9G6Rw', {
    id: 'WyIdw6lPTvSCRKa1bVL8ow',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.create('Egiw2WiRQXGl65gNK9G6Rw', {
    id: 'TkZP5DzLRoOdP2IkTVqozg',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.create('Egiw2WiRQXGl65gNK9G6Rw', {
    id: 'dDh6bJofRkqFuTdCJ5sNaA',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.create('GJtYJjxPQA2e5m38Hs8cug', {
    id: 'Ln6pQM1-QHuAXl27ZmWLYw',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.create('GJtYJjxPQA2e5m38Hs8cug', {
    id: 'PJWf4KpHSMyqniZURUskqQ',
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
    'Create Boolean field "Show Track Finder" (`show_track_finder`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'Qx9O52Z8QNuyeDWebDHBNw',
    label: 'Show Track Finder',
    field_type: 'boolean',
    api_key: 'show_track_finder',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Show Search" (`show_search`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'VnzsHMHlTbC4qYweNRkC5Q',
    label: 'Show Search',
    field_type: 'boolean',
    api_key: 'show_search',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Show Cart" (`show_cart`) in block model "\uD83C\uDFE0 Header - Config" (`header_config`)'
  )
  await client.fields.create('HReTypuARpuNUHBYn52PmQ', {
    id: 'JrNsSIS4QvaWbyt3jcxQ8A',
    label: 'Show Cart',
    field_type: 'boolean',
    api_key: 'show_cart',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.create('Mq2h8YsaTwKWag48Hs8GHg', {
    id: 'DK6RCqLDTZyBSkSBOS8EaA',
    label: 'Config',
    field_type: 'single_block',
    api_key: 'config',
    validators: {
      single_block_blocks: { item_types: ['XdmCS4GRTFWIUASGoprDeg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    },
    deep_filtering_enabled: true
  })

  console.log(
    'Create Modular Content (Single block) field "Model" (`model`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.create('Mq2h8YsaTwKWag48Hs8GHg', {
    id: 'ff_HkhvWQsSSHBBQniZyow',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['a1StO0UXTn26UqnRQrtLmQ'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    },
    deep_filtering_enabled: true
  })

  console.log(
    'Create Multiple-paragraph text field "Contacts" (`contacts`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'QZ49_D_AS-6EdTUBOeNmRw',
    label: 'Contacts',
    field_type: 'text',
    api_key: 'contacts',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Hours" (`hours`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'ef_Qj3y1TW6cdKoLe1qywg',
    label: 'Hours',
    field_type: 'text',
    api_key: 'hours',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Single link field "Social" (`social`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'V1GBGnWpQVO0qq3f5mvDAA',
    label: 'Social',
    field_type: 'link',
    api_key: 'social',
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
    'Create Boolean field "Show Newsletter Signup Form" (`show_newsletter_signup_form`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'FA8ciuMZS5exS9zNauBH1g',
    label: 'Show Newsletter Signup Form',
    field_type: 'boolean',
    api_key: 'show_newsletter_signup_form',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Boolean field "Show Social" (`show_social`) in block model "\uD83C\uDFE0 Footer - Config" (`footer_config`)'
  )
  await client.fields.create('U7Y2BaDuQtCZ0faJKn2LIw', {
    id: 'J3R0bdtEQR2vqwvzI0cvlA',
    label: 'Show Social',
    field_type: 'boolean',
    api_key: 'show_social',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'fu1QENTsSxqAt13HaIexYA',
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
    'Create Single-line string field "Subtitle" (`subtitle`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'TNW0JlH9QQykLcKalPK3yA',
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
    'Create Multiple-paragraph text field "Desciption" (`desciption`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'I-lt95MCSbKQoj_dkVJysg',
    label: 'Desciption',
    field_type: 'text',
    api_key: 'desciption',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['heading', 'bold', 'italic'] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.fields.create('ZUG1JR-nTMmVDBkvK5HEBw', {
    id: 'Kz-DgHKoRc-HPFqR_86m6g',
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

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single link field "Link" (`link`) in block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.fields.destroy('CHLUdt4YSCCTPDkHhUodiA')

  console.log(
    'Delete Modular Content (Single block) field "Price" (`price`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.destroy('I_HFP9j-TQqXeXI64LWmtQ')

  console.log(
    'Delete Single link field "Link" (`link`) in block model "\u2699\uFE0F Core - Media Card" (`core_media_card`)'
  )
  await client.fields.destroy('Kfzb6k_iRPKyKy8FRpkfUw')

  console.log(
    'Delete Modular Content (Multiple blocks) field "FAQs" (`faqs`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.destroy('IMsgAn8gSVSWD0xrCRy54g')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Model" (`model`) in model "\u270F\uFE0F Post" (`post`)'
  )
  await client.fields.update('CCEJS6PeQt6DBrbxwaHZNg', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83C\uDFE0 Header" (`header`)'
  )
  await client.fields.update('OKh6pOu8Rb-CbtTVToSFeQ', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "CTA" (`cta`) in block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.fields.update('AmrBcckzRLG_R6K3JXMIJw', { position: 3 })

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\u2699\uFE0F Core - Social Card" (`core_social_card`)'
  )
  await client.fields.update('OAZlUqFDTz2fNiDFOJMAhA', { position: 2 })

  console.log(
    'Update Modular Content (Single block) field "Model" (`model`) in model "\uD83D\uDCC5 Event" (`event`)'
  )
  await client.fields.update('SdkZVk3RQgKOQ-uXtcJWQQ', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "Cards" (`cards`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.update('Hsbn9_oBTzGn937uqyoslw', { position: 5 })

  console.log(
    'Update Multiple links field "FAQs" (`faqs`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.update('R2FKfVd-QyGPBkFowLDOLA', { position: 5 })

  console.log(
    'Update Structured text field "Body" (`body`) in block model "\u270F\uFE0F Post - Model" (`post_model`)'
  )
  await client.fields.update('Hi5_GLsURYmQuXadKXBxjw', {
    validators: {
      structured_text_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
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
    },
    appearance: {
      addons: [],
      editor: 'structured_text',
      parameters: {
        marks: [
          'strong',
          'code',
          'emphasis',
          'underline',
          'strikethrough',
          'highlight'
        ],
        nodes: [
          'blockquote',
          'code',
          'heading',
          'link',
          'list',
          'thematicBreak'
        ],
        heading_levels: [2, 3, 4, 5, 6],
        blocks_start_collapsed: false,
        show_links_meta_editor: false,
        show_links_target_blank: true
      }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.update('DK6RCqLDTZyBSkSBOS8EaA', { position: 2 })

  console.log(
    'Update Modular Content (Single block) field "Model" (`model`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.update('ff_HkhvWQsSSHBBQniZyow', { position: 3 })

  console.log(
    'Update Single-line string field "Title Internal" (`title_internal`) in model "\u270F\uFE0F FAQ" (`faq`)'
  )
  await client.fields.update('BXR70QazQaKh0PvxKDafzg', { position: 1 })

  console.log(
    'Update Multiple links field "Events" (`events`) in block model "\uD83D\uDCC5 Section - Events Feature" (`section_events_feature`)'
  )
  await client.fields.update('fC3FpC4tSfqii680osNaqw', { position: 5 })

  console.log(
    'Update Color field "Start Color" (`start_color`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.update('DfxiIJc6RZSHH-p2BgHx3A', {
    appearance: {
      addons: [],
      editor: 'color_picker',
      parameters: { enable_alpha: true, preset_colors: [] }
    }
  })

  console.log(
    'Update Color field "End Color" (`end_color`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.update('BTexZ7rlTqa6Z4TpE4DmJQ', {
    appearance: {
      addons: [],
      editor: 'color_picker',
      parameters: { enable_alpha: true, preset_colors: [] }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in model "\uD83C\uDFE0 Footer" (`footer`)'
  )
  await client.fields.update('DOrBp6viTXuObMwR_Y02uA', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Single block) field "Model" (`model`) in model "\uD83D\uDEE3\uFE0F Track" (`track`)'
  )
  await client.fields.update('aArAvSDERtyqD0EhVVHrLw', {
    deep_filtering_enabled: true
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "Cards" (`cards`) in block model "\uD83D\uDDA5\uFE0F Section - USP" (`section_usp`)'
  )
  await client.fields.update('dKswiRVIS5KHVDuPDPe1uw', {
    validators: {
      rich_text_blocks: { item_types: ['X22zvr4MTi21gMhwRGSG-A'] },
      size: { min: 0, max: 3 }
    }
  })

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('comqfrebSH6FqCdgJv7Vpg', {
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    }
  })

  console.log('Finalize models/block models')

  console.log('Update block model "\u270F\uFE0F FAQ - Config" (`faq_config`)')
  await client.itemTypes.update('XdmCS4GRTFWIUASGoprDeg', {
    presentation_title_field: { id: 'dwCADOcmTgmuJNA7EbymgA', type: 'field' }
  })

  console.log('Update block model "\u270F\uFE0F FAQ - Model" (`faq_model`)')
  await client.itemTypes.update('a1StO0UXTn26UqnRQrtLmQ', {
    presentation_title_field: { id: 'W0ulw6_NQB-cPjRlGm64JA', type: 'field' }
  })

  console.log('Update model "\uD83D\uDD27 Global Settings" (`global_config`)')
  await client.itemTypes.update('AJkWIHW1QnSBRleF4BAbvQ', {
    name: '\uD83D\uDD27 Global Settings'
  })

  console.log(
    'Update block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.itemTypes.update('Egiw2WiRQXGl65gNK9G6Rw', {
    presentation_title_field: { id: 'WyIdw6lPTvSCRKa1bVL8ow', type: 'field' }
  })

  console.log(
    'Update block model "\uD83D\uDEE3\uFE0F Section - Track Map Callout" (`section_track_map_callout`)'
  )
  await client.itemTypes.update('ZUG1JR-nTMmVDBkvK5HEBw', {
    presentation_title_field: { id: 'fu1QENTsSxqAt13HaIexYA', type: 'field' }
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\u270F\uFE0F FAQ - Config" (`faq_config`)'
  )
  await client.schemaMenuItems.update('IDCrRePjR66OCvOUM2JT1A', {
    position: 21
  })

  console.log(
    'Update block schema menu item for block model "\u270F\uFE0F FAQ - Model" (`faq_model`)'
  )
  await client.schemaMenuItems.update('RciP342WSg-XSNXQWCZC0A', {
    position: 22
  })
}
