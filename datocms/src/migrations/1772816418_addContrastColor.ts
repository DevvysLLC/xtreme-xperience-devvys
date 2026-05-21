import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Contrast Color" (`contrast_color`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.create('QG68cRN5Tr6_-emTklhMAg', {
    id: 'TLSyQ7QiSyW-LaPpPPmJHg',
    label: 'Contrast Color',
    field_type: 'string',
    api_key: 'contrast_color',
    hint: 'Add a valid hexcode including the hash, eg: #AB832E',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Color Type" (`color_type`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('MYX35DH8Q2WpHpXIFfHRRA', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Black', value: 'black' },
          { hint: '', label: 'White', value: 'white' },
          { hint: '', label: 'White Transparent', value: 'white-transparent' },
          { hint: '', label: 'Orange', value: 'orange' },
          {
            hint: 'Inherit the highlight color from the section',
            label: 'Highlight',
            value: 'highlight'
          }
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "Contrast Color" (`contrast_color`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('TLSyQ7QiSyW-LaPpPPmJHg', { position: 5 })
}
