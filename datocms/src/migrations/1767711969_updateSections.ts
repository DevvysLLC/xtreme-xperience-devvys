import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title" (`title`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.fields.create('MK-gWkLWTeGYg6-EzAoTQw', {
    id: 'UaHnIHDRRiC4syJlGFisIA',
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
    'Create Multiple-paragraph text field "Description" (`description`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.fields.create('MK-gWkLWTeGYg6-EzAoTQw', {
    id: 'SYAH5-dJT7G8qfPg78wZZg',
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
    'Create Boolean field "Add Flag Pattern" (`add_flag_pattern`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.create('QG68cRN5Tr6_-emTklhMAg', {
    id: 'VjSMx0RjT8uKS-z6xoMStA',
    label: 'Add Flag Pattern',
    field_type: 'boolean',
    api_key: 'add_flag_pattern',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Mode" (`mode`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('NIyD6NVBQ5e0KGErFHlm_Q', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '#ffffff', label: 'White', value: 'white' },
          { hint: '#111111', label: 'Black', value: 'black' },
          { hint: '#f0edeb', label: 'Carrara', value: 'carrara' },
          { hint: '#eb642c', label: 'Orange', value: 'orange' },
          { hint: '#53565a', label: 'Gray', value: 'gray' }
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "Icon" (`icon`) in block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.fields.update('ZpHbgnA1Si-Uz3esffCORw', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '3D', value: '3d' },
          { hint: '', label: 'Account', value: 'account' },
          { hint: '', label: 'Check', value: 'check' },
          { hint: '', label: 'Date', value: 'date' },
          { hint: '', label: 'Double Column', value: 'double-column' },
          { hint: '', label: 'Car', value: 'car' },
          { hint: '', label: 'Heart', value: 'heart' },
          { hint: '', label: 'Location', value: 'location' },
          { hint: '', label: 'Location Solid', value: 'location-solid' },
          { hint: '', label: 'Plus', value: 'plus' },
          { hint: '', label: 'Premium', value: 'premium' },
          { hint: '', label: 'Reviews', value: 'reviews' },
          { hint: '', label: 'Security', value: 'security' },
          { hint: '', label: 'Shipping', value: 'shipping' },
          { hint: '', label: 'Single Column', value: 'single-column' },
          { hint: '', label: 'Travel', value: 'travel' },
          { hint: '', label: 'Turnkey Orange', value: 'turnkey-orange' },
          {
            hint: '',
            label: 'Pro Instructions Orange',
            value: 'pro-instructions-orange'
          },
          { hint: '', label: 'Location Orange', value: 'location-orange' },
          { hint: '', label: 'Speed Orange', value: 'speed-orange' }
        ]
      }
    }
  })

  console.log(
    'Update Modular Content (Multiple blocks) field "Cards" (`cards`) in block model "\uD83D\uDDA5\uFE0F Section - USP" (`section_usp`)'
  )
  await client.fields.update('dKswiRVIS5KHVDuPDPe1uw', {
    validators: {
      rich_text_blocks: { item_types: ['X22zvr4MTi21gMhwRGSG-A'] },
      size: { min: 0, max: 4 }
    }
  })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Grid" (`section_supercar_brand_grid`)'
  )
  await client.itemTypes.update('MK-gWkLWTeGYg6-EzAoTQw', {
    presentation_title_field: { id: 'UaHnIHDRRiC4syJlGFisIA', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Create menu item "Event"')
  await client.menuItems.create({
    id: 'Ho6Tz5a5SpiQPuio857Gww',
    label: 'Event',
    item_type: { id: 'C5xdhHU0TxuME6A18rivgg', type: 'item_type' }
  })

  console.log('Update menu item "Event"')
  await client.menuItems.update('Ho6Tz5a5SpiQPuio857Gww', { position: 14 })

  console.log('Update menu item "\u270F\uFE0F Post"')
  await client.menuItems.update('Ojhd_c9RRpCB0KcWjQZwvA', { position: 16 })

  console.log('Update menu item "\u270F\uFE0F Category"')
  await client.menuItems.update('cAWLaWnwQZah2WfmNg4RGg', { position: 17 })

  console.log('Update menu item "\u270F\uFE0F Policy"')
  await client.menuItems.update('clwBsWn-Q4qSzwBBflQL_w', { position: 15 })
}
