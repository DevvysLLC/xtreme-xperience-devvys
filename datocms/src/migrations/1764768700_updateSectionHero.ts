import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Boolean field "Media Full Height" (`media_full_height`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'Nn_fepZSSY-oTSAGAsJzVA',
    label: 'Media Full Height',
    field_type: 'boolean',
    api_key: 'media_full_height',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single asset field "Logo" (`logo`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.update('KY5TzG6tRbG4zXFJ4PSydg', {
    validators: { extension: { extensions: ['svg'] } }
  })

  console.log(
    'Update Boolean field "Media Full Height" (`media_full_height`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('Nn_fepZSSY-oTSAGAsJzVA', { position: 9 })
}
