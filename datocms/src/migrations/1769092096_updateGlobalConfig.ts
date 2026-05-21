import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "\u2709\uFE0F Sendlane" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'd3Z0oEABQC2oD9T9EodU_A',
    title: '\u2709\uFE0F Sendlane',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Single-line string field "Newsletter List ID" (`sendlane_newsletter_list_id`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'GGoaGs4qRMiV4JDghXaSFQ',
    label: 'Newsletter List ID',
    field_type: 'string',
    api_key: 'sendlane_newsletter_list_id',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'd3Z0oEABQC2oD9T9EodU_A', type: 'fieldset' }
  })

  console.log(
    'Create Multiple-paragraph text field "Embed Form" (`embed_form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'KwYWuh1cTKCqdF7209EHmA',
    label: 'Embed Form',
    field_type: 'text',
    api_key: 'embed_form',
    hint: 'If populated, it will overwrite Form field',
    appearance: { addons: [], editor: 'markdown', parameters: { toolbar: [] } }
  })

  console.log(
    'Create Single-line string field "HubSpot Form ID" (`form_hubspot_guid`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'Br0qSlFTQ7GgS8hpmrFYug',
    label: 'HubSpot Form ID',
    field_type: 'string',
    api_key: 'form_hubspot_guid',
    hint: 'Mandatory if Hubspot is the provider',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Newsletter List ID" (`sendlane_newsletter_list_id`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('GGoaGs4qRMiV4JDghXaSFQ', { position: 0 })

  console.log(
    'Update Multiple-paragraph text field "Embed Form" (`embed_form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.update('KwYWuh1cTKCqdF7209EHmA', { position: 5 })

  console.log(
    'Update Single-line string field "HubSpot Form ID" (`form_hubspot_guid`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.update('Br0qSlFTQ7GgS8hpmrFYug', { position: 2 })

  console.log('Manage schema menu items')

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
