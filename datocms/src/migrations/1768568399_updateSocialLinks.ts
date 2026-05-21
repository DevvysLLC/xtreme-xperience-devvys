import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Title CTA" (`title_cta`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.create('Egiw2WiRQXGl65gNK9G6Rw', {
    id: 'HuPlX6QwSnmL4YUs_PySww',
    label: 'Title CTA',
    field_type: 'single_block',
    api_key: 'title_cta',
    validators: {
      single_block_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Title CTA" (`title_cta`) in block model "\uD83D\uDDA5\uFE0F Section - Social Grid" (`section_social_grid`)'
  )
  await client.fields.update('HuPlX6QwSnmL4YUs_PySww', { position: 4 })
}
