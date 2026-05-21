import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.create('M6Eqatu0Ro2A7VoCtBgRoQ', {
    id: 'OwJGtDcXSVuIEP1UNXvbag',
    label: 'Media',
    field_type: 'single_block',
    api_key: 'media',
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

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.fields.create('fCe0HjpPR_irS7VGM4lG2A', {
    id: 'NodmjIPWQnSfg5OB4mjlYw',
    label: 'CTAs',
    field_type: 'rich_text',
    api_key: 'ctas',
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDDA5\uFE0F Section - Highlight" (`section_highlight`)'
  )
  await client.fields.update('OwJGtDcXSVuIEP1UNXvbag', { position: 5 })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\u2699\uFE0F Core - Highlight" (`core_highlight`)'
  )
  await client.fields.update('NodmjIPWQnSfg5OB4mjlYw', { position: 4 })
}
