import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Fullscreen Aspect Ratio" (`fullscreen_aspect_ratio`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.create('frxUjrsTQx6FBwQ9nJRyAg', {
    id: 'c_klUhJASTmqK5m0WYkEFA',
    label: 'Fullscreen Aspect Ratio',
    field_type: 'string',
    api_key: 'fullscreen_aspect_ratio',
    hint: 'When layout is fullscreen, this value determines the aspect ratio of the iframe container.',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '16/9', value: '16/9' },
          { hint: '', label: '4/3', value: '4/3' },
          { hint: '', label: '2/1', value: '2/1' },
          { hint: '', label: '1/1', value: '1/1' },
          { hint: '', label: '1/2', value: '1/2' }
        ]
      }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Highlight Color" (`highlight_color`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('Ybi2RvKPQkeNG5TywoIJfw', {
    hint: 'Add a valid hexcode including the hash, eg: #AB832E',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Update Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.fields.update('Rh-6Yxd8TwKOTg_7CK9Rgw', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '1 Column', value: '1-column' },
          { hint: '', label: '2 Columns', value: '2-column' },
          { hint: '', label: 'Fullscreen', value: 'fullscreen' }
        ]
      }
    }
  })
}
