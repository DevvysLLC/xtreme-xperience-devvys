import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Tagline" (`tagline`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('TtS8fcRDTQGUev16oWhKzQ', {
    hint: 'Used for Supercar cards title'
  })
}
