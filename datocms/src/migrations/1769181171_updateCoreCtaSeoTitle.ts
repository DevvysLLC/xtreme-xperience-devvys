import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "SEO Title" (`seo_title`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'U0ki25CHR1W-jgODZCZbkw',
    label: 'SEO Title',
    field_type: 'string',
    api_key: 'seo_title',
    hint: 'Used by screen readers and SEO',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "SEO Title" (`seo_title`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('U0ki25CHR1W-jgODZCZbkw', { position: 2 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.schemaMenuItems.update('Wd6VR9ZRSs2hz0PH6NuZHw', {
    position: 58
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
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Policies" (`section_policy`)'
  )
  await client.schemaMenuItems.update('WdXhe1LFQQWPS1rb1IfMsg', {
    position: 59
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
    'Update block schema menu item for block model "\uD83D\uDCC5 Booking - Decorator" (`booking_decorator`)'
  )
  await client.schemaMenuItems.update('UBOHn75KSK6zzt2p-vy1Nw', {
    position: 105
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
}
