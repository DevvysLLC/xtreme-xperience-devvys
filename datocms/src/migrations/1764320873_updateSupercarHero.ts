import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Multiple-paragraph text field "Large Text" (`large_text`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.create('aBPYjVj8T6KfjIrbrn5KKA', {
    id: 'euvvzJjJRLWR8ufrdl8mhA',
    label: 'Large Text',
    field_type: 'text',
    api_key: 'large_text',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Large Text" (`large_text`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Hero" (`section_supercar_hero`)'
  )
  await client.fields.update('euvvzJjJRLWR8ufrdl8mhA', { position: 4 })
}
