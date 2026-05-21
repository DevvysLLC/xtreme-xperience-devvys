import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Color Type" (`color_type`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.create('Dpb0LeFvRym9PXvdyVaIew', {
    id: 'MYX35DH8Q2WpHpXIFfHRRA',
    label: 'Color Type',
    field_type: 'string',
    api_key: 'color_type',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Black', value: 'black' },
          { hint: '', label: 'White', value: 'white' },
          { hint: '', label: 'White Transparent', value: 'white-transparent' },
          { hint: '', label: 'Orange', value: 'orange' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Mode" (`mode`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.create('QG68cRN5Tr6_-emTklhMAg', {
    id: 'NIyD6NVBQ5e0KGErFHlm_Q',
    label: 'Mode',
    field_type: 'string',
    api_key: 'mode',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'White', value: 'white' },
          { hint: '', label: 'Black', value: 'black' },
          { hint: '', label: 'Carrara', value: 'carrara' },
          { hint: '', label: 'Orange', value: 'orange' }
        ]
      }
    },
    default_value: 'white'
  })

  console.log(
    'Create Single asset field "Maker Logo" (`maker_logo`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'BDbT3b_vT5O7382FPnJ6Kw',
    label: 'Maker Logo',
    field_type: 'file',
    api_key: 'maker_logo',
    validators: { extension: { extensions: ['svg'] } },
    appearance: { addons: [], editor: 'file', parameters: {} }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Color Type" (`color_type`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('MYX35DH8Q2WpHpXIFfHRRA', { position: 5 })

  console.log(
    'Update Single-line string field "Mode" (`mode`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('NIyD6NVBQ5e0KGErFHlm_Q', { position: 3 })

  console.log(
    'Update Single asset field "Maker Logo" (`maker_logo`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('BDbT3b_vT5O7382FPnJ6Kw', { position: 31 })
}
