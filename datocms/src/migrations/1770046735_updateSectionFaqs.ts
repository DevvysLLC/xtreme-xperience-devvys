import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.create('GJtYJjxPQA2e5m38Hs8cug', {
    id: 'Ti63_9X_RhqGYx33vQR82Q',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '1 Column', value: '1-column' },
          { hint: '', label: '2 Columns', value: '2-column' }
        ]
      }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - FAQs" (`section_faq`)'
  )
  await client.fields.update('Ti63_9X_RhqGYx33vQR82Q', { position: 2 })
}
