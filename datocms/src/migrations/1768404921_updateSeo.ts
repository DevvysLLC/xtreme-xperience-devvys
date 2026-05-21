import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "\uD83C\uDF0E SEO" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'WIi8ZEAtQFSPSjBJnPFtzA',
    title: '\uD83C\uDF0E SEO',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Single-line string field "SEO Site Name" (`seo_site_name`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'Oe3OjuxcRz-H154aR-ajNw',
    label: 'SEO Site Name',
    field_type: 'string',
    api_key: 'seo_site_name',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'WIi8ZEAtQFSPSjBJnPFtzA', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "SEO Site Description" (`seo_site_description`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'XcnTY6KASS-hslBCoQFZ1w',
    label: 'SEO Site Description',
    field_type: 'string',
    api_key: 'seo_site_description',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'WIi8ZEAtQFSPSjBJnPFtzA', type: 'fieldset' }
  })

  console.log(
    'Create Boolean field "Show Map" (`show_map`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'SrsdkVWCQAy8tzHgPkDChQ',
    label: 'Show Map',
    field_type: 'boolean',
    api_key: 'show_map',
    hint: 'If disabled, it will show the Media instead',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update fieldset "\uD83C\uDF0E SEO" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.update('WIi8ZEAtQFSPSjBJnPFtzA', { position: 1 })

  console.log(
    'Update Single-line string field "SEO Site Name" (`seo_site_name`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('Oe3OjuxcRz-H154aR-ajNw', { position: 0 })

  console.log(
    'Update Single-line string field "SEO Site Description" (`seo_site_description`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('XcnTY6KASS-hslBCoQFZ1w', { position: 1 })

  console.log(
    'Update Boolean field "Show Map" (`show_map`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.update('SrsdkVWCQAy8tzHgPkDChQ', { position: 5 })

  console.log('Manage menu items')

  console.log('Delete menu item "\uD83D\uDCC5 Event"')
  await client.menuItems.destroy('W00nec5LQQKZa8R84M7WSA')
}
