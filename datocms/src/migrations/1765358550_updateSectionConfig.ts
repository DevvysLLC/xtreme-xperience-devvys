import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.create('ar7S0nqvTLiRuU7glh28Gg', {
    id: 'EGKQdIT8Scu3I6vmQ1vTSg',
    label: 'Config',
    field_type: 'single_block',
    api_key: 'config',
    validators: {
      single_block_blocks: { item_types: ['QG68cRN5Tr6_-emTklhMAg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single-line string field "Section Background Color" (`section_background_color`) in block model "Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.destroy('ZF1fkxP6R62Na53g-_XnAw')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Config" (`config`) in block model "\uD83D\uDDA5\uFE0F Section - Media Gallery" (`section_media_gallery`)'
  )
  await client.fields.update('EGKQdIT8Scu3I6vmQ1vTSg', { position: 1 })
}
