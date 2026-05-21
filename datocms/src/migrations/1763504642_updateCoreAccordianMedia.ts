import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\u2699\uFE0F Core - Accordion" (`core_accordion`)'
  )
  await client.fields.update('B2YmZN7kR2W-aPuKkJ3rQA', {
    field_type: 'single_block'
  })
  await client.fields.update('B2YmZN7kR2W-aPuKkJ3rQA', {
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })
}
